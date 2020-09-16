import { action, computed, decorate, observable } from "mobx"
import {
	createNewRightsSplits,
	updateRightsSplits,
} from "../../../../api/workpieces"
import { $workpiece } from "../WorkpieceState"

export default class RightsSplits {
	constructor(workpiece, rightsSplits = {}) {
		this.$workpiece = workpiece
		this.copyright = new CopyrightSplit(rightsSplits.copyright)
		this.performance = new PerformanceSplit(rightsSplits.performance)
		this.recording = new RecordingSplit(rightsSplits.recording)
		Object.defineProperties(this, {
			_state: {
				configurable: true,
				enumerable: false,
				writable: true,
				value: rightsSplits._state,
			},
			$hasChanged: {
				configurable: true,
				enumerable: false,
				writable: true,
				value: false,
			},
			$error: {
				configurable: false,
				enumerable: false,
				writable: true,
				value: null,
			},
			_disposers: {
				configurable: false,
				enumerable: false,
				writable: true,
				value: null,
			},
		})
		decorate(this, {
			copyright: observable,
			performance: observable,
			recording: observable,
			_state: observable,
			$hasChanged: observable,
		})
		this._disposers = [
			this.copyright.shareHolders.observe(this._toggleHasChanged),
			this.copyright.shareHolders.observe(this._toggleHasChanged),
			this.copyright.shareHolders.observe(this._toggleHasChanged),
		]
	}

	@action _toggleHasChanged() {
		this.$hasChanged = true
	}

	@action _updateRightsSplits(rightsSplits) {
		const { _state, ...splits } = rightsSplits
		splits.keys().forEach((type) => {
			if (type in this && this[type].updateShares) {
				this[type].updateShares(splits[type])
			}
		})
		this._state = _state
		this.$hasChanged = false
	}

	_exportRightsSplits() {
		const output = {}

		Object.keys(this).forEach((type) => {
			output[type] = this[type].allShares
			Object.assign(output, { type: this[type].allShares })
		})

		return output
	}

	@action
	async save() {
		if (!this.$hasChanged) return

		try {
			this.$hasChanged = false
			this.$error = null
			let newState
			if (this._state === "draft") {
				newState = await updateRightsSplits(
					this[$workpiece].id,
					this._exportRightsSplits()
				)
			} else {
				newState = await createNewRightsSplits(
					this[$workpiece].id,
					this._exportRightsSplits()
				)
			}

			this._updateRightsSplits(newState)
		} catch (e) {
			this.$hasChanged = true
			this.$error = e
			throw e
		}
	}
}

export class RightSplit {
	constructor(shares) {
		if (shares) this.updateShares(shares)
	}

	@observable shareHolders = new Map()

	@action removeRightHolder(id) {
		this.shareHolders.delete(id)
	}

	@action updateRightHolder(id, share) {
		!share && this.shareHolders.get(id).reset()
		!!share && this.shareHolders.get(id).set(share)
	}

	@action addRightHolder(id, share = {}) {
		if (this.shareHolders.has(id)) {
			throw new Error("Cannot add share: this user already has a share")
		}
		this.shareHolders.set(id, new SplitShare(id, share))
	}

	addShare(share) {
		return this.addRightHolder(share.rightHolder, share)
	}

	updateShare(share) {
		return this.updateRightHolder(share.rightHolder, share)
	}

	removeShare(share) {
		return this.removeRightHolder(share.rightHolder)
	}

	@action updateShares(shares) {
		const seenShareHolders = []
		shares.forEach((share) => {
			seenShareHolders.push(share.rightHolder)
			if (this.shareHolders.has(share.rightHolder)) {
				this.updateShare(share)
			} else {
				this.addShare(share)
			}
		})
		this.shareHolders.forEach(
			(value, key) =>
				seenShareHolders.indexOf(key) < 0 && this.removeRightHolder(key)
		)
	}

	@computed get allShares() {
		return Array.from(this.shareHolders.values())
	}
}

export class CopyrightSplit extends RightSplit {}

export class PerformanceSplit extends RightSplit {}

export class RecordingSplit extends RightSplit {}

const initShareData = {
	shares: 1,
	roles: [],
	comment: "",
	vote: "undecided",
}

export class SplitShare {
	constructor(rightHolder_id, data) {
		Object.assign(this, initShareData)
		Object.assign(this, data)
		this.rightHolder = rightHolder_id
	}

	@observable shares = initShareData.shares
	@observable roles = initShareData.roles
	@observable comment = initShareData.comment
	@observable vote = initShareData.vote
	@action set = (share) => Object.assign(this, share)
	@action setData = (key, data) => Object.assign(this[key], data)
	@action reset = () => Object.assign(this, initShareData)
}
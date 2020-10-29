import { action, decorate, observable } from "mobx"
import {
	createNewRightsSplits,
	updateRightsSplits,
} from "../../../../api/workpieces"
import { $workpiece } from "../WorkpieceState"
import { CopyrightSplit, PerformanceSplit, RecordingSplit } from "./SplitStates"

/**
 *	Class managing the 3 splits (copyright, performance, recording)
 **/
export default class RightsSplits {
	constructor(workpiece, rightsSplits = {}) {
		this.$workpiece = workpiece
		this.copyright = new CopyrightSplit(rightsSplits.copyright)
		this.performance = new PerformanceSplit(
			rightsSplits.performance,
		)
		this.recording = new RecordingSplit(
			rightsSplits.performance,
		)
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

		// Observe splits shareholders and set hasChanged to
		// true on first change
		this._disposers = [
			this.copyright.shareHolders.observe(this._toggleHasChanged),
			// this.performance.shareHolders.observe(this._toggleHasChanged),
			// this.recording.shareHolders.observe(this._toggleHasChanged),
		]
	}

	@action _toggleHasChanged() {
		this.$hasChanged = true
		//TODO: dispose of the observers
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

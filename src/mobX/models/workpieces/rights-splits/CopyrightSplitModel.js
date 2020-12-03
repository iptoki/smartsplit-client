import { observable } from "mobx"
import RightSplitModel from "./RightSplitModel"
import { Field, FieldType } from "../../../BaseModel"

export default class CopyrightSplitModel extends RightSplitModel {
	@observable shares = new Field(this, "shares", { type: FieldType.float })
	@observable roles = new Field(this, "roles", { type: FieldType.collection })
	@observable comment = new Field(this, "comment", { type: FieldType.string })
	@observable vote = new Field(this, "vote", { type: FieldType.string })
	@observable locked = false

	toJS() {
		return { ...super.toJS(), locked: this.locked }
	}
}

/**
 *	Data object to initialize a model instance with default
 *	values
 **/
export const initData = {
	shares: 1,
	roles: ["author", "composer"],
	comment: "",
	vote: "undecided",
}

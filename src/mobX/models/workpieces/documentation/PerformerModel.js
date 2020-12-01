import BaseModel, {
	FieldType,
	Field,
	ModelCollection,
} from "../../../BaseModel"
import { observable, action, computed } from "mobx"
import PlayerInstrumentModel from "./PlayerInstrumentModel"
const makeObservable = () => {}
export const PerformerType = {
	principle: "principle",
	featured: "featured",
	groupMember: "groupMember",
	accompanying: "accompanying",
}
export default class PerformerModel extends BaseModel {
	constructor(parent) {
		super(parent)
		makeObservable(this)
	}
	user = new Field(this, "user", {
		type: FieldType.object,
		required: true,
	})
	isSinger = new Field(this, "isSinger", {
		type: FieldType.bool,
		label: "general:checkbox.singer",
	})
	isMusician = new Field(this, "isMusician", {
		type: FieldType.bool,
		label: "general:checkbox.musician",
	})
	role = new Field(this, "role", { type: FieldType.object })
	type = new Field(this, "type", {
		type: FieldType.string,
		required: true,
		validation: (v) => {
			if (Object.values(PerformerType).indexOf(v) === -1)
				return "errors:invalid performer type"
			return null
		},
	})
	instruments = new ModelCollection(this, "instruments", {
		modelClass: PlayerInstrumentModel,
	})
}
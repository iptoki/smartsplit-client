import BaseModel, { FieldType, Field } from "../../BaseModel"
import { observable, action, computed, runInAction } from "mobx"
import { emailUniqueValidator, emailValidator } from "../validators"
import ContributorModel from "./ContributorModel"
import { inviteNewUser } from "../../../../api/users"
import CollaboratorsAPI from "../../../../api/collaborators"
/**
 * inherits:
 *
 * lastName,
 * firstName,
 * artistName
 *
 * and the computed "name" prop from
 *
 * Contributor model
 */
export default class CollaboratorModel extends ContributorModel {
	@observable email = new Field(this, "email", {
		label: "collaborators:email",
		required: true,
		validation: emailValidator,
		asyncValidation: emailUniqueValidator,
	})
}

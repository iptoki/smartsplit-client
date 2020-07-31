import React, { useState } from "react"
import { Platform } from "react-native"
import { DialogModal } from "../../widgets/modal"
import { useTranslation } from "react-i18next"
import { Group, Column, Row } from "../../layout"
import { Form, LabelText, TextField, CheckBox } from "../../forms"
import { Text } from "../../text"
import Button from "../../widgets/button"
import { SearchAndTag } from "../../forms/search-and-tag"

export default function InviteModal(props) {
	const [t] = useTranslation()

	const { firstName, lastName, artistName, email, groups } = props

	const [search, setSearch] = useState("")
	const [selected, setSelected] = useState([])

	return (
		<DialogModal
			visible={props.visible}
			onRequestClose={props.onRequestClose}
			title={t("newUserInvite:title")}
			buttons={
				<>
					<Button
						text={t("general:buttons.cancel")}
						tertiary
						onClick={props.onRequestClose}
					/>
					<Button text={t("general:buttons.save")} onClick={props.onSubmit} />
				</>
			}
		>
			<Form
				values={{ firstName } + { lastName }}
				onSubmit={(values) =>
					alert("Submit " + JSON.stringify(values, null, 4))
				}
			>
				<Group
					of="group"
					style={
						Platform.OS === "web" && { minWidth: 560, alignSelf: "center" }
					}
				>
					<TextField
						name="firstName"
						label={t("forms:labels.legalFirstName")}
					/>

					<TextField name="lastName" label={t("forms:labels.legalLastName")} />

					<TextField
						name="artistName"
						label={t("forms:labels.artistName")}
						label_hint={t("forms:labels.optional")}
						undertext={t("forms:undertexts.artistName")}
					/>

					<TextField email="email" label={t("forms:labels.email")} />

					<SearchAndTag
						label={t("forms:labels.groups")}
						searchResults={props.searchResults}
						searchInput={search}
						onSearchChange={setSearch}
						selectedItems={selected}
						onSelect={(selection) => setSelected([...selected, selection])}
						onUnselect={(selection) =>
							setSelected(selected.filter((i) => i !== selection))
						}
						placeholder={t("forms:placeholders.groupSearch")}
					/>
					<Column of="component">
						<LabelText>{t("newUserInvite:checkbox")} </LabelText>

						<CheckBox
							value="author"
							label={t("general:checkbox.author")}
							tooltip=""
						/>

						<CheckBox
							value="composer"
							label={t("general:checkbox.composer")}
							tooltip=""
						/>
						<CheckBox
							value="mixer"
							label={t("general:checkbox.mixer")}
							tooltip="exemple"
						/>
						<CheckBox
							value="performer"
							label={t("general:checkbox.performer")}
							tooltip=""
						/>
						<Text secondary small>
							{t("newUserInvite:checkboxUndertext")}
						</Text>
					</Column>
				</Group>
			</Form>
		</DialogModal>
	)
}
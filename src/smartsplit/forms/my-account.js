import React, { useState, useEffect } from "react"
//import { useStorePath } from "../../appstate/react"
import { useStores, useStorePath } from "../../mobX"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { Platform } from "../../platform"
import { Group, Hairline, Flex, Row, Column, NoSpacer } from "../../layout"
import { Heading, Paragraph, Text } from "../../text"
import { Colors } from "../../theme"
import { TextField, Select, CheckBox, PhoneNumberField } from "../../forms"
import Button from "../../widgets/button"
import ConfirmPhoneModal from "../../pages/dashboard/confirm-phone"
import { MailList } from "../components/mail-list"
import { Status } from "../../utils/enums"
import Label from "../../forms/label"
import { observer } from "mobx-react"

export default observer(function MyAccount({ title }) {
	const { t, i18n } = useTranslation()
	const emails = useStorePath("settings", "emails", "list")
	console.log(emails)
	function handleLanguageChange(language) {
		i18n.changeLanguage(language)
	}

	return (
		<Column of="group">
			{title && <Heading level="2">{title}</Heading>}
			<TextField label={t("forms:labels.civicAddress")} />
			{Platform.web && (
				<>
					<Row of="component">
						<Select
							name="locale"
							label={t("forms:labels.dropdowns.language")}
							options={[
								{ key: "fr", value: "Français" },
								{ key: "en", value: "English" },
							]}
							onChange={handleLanguageChange}
						/>
						<Flex />
					</Row>

					<MobilePhoneRow />
				</>
			)}

			{Platform.native && <PhoneNumberField label={t("forms:labels.phone")} />}
			<MailList
				label={t("forms:labels.myEmails")}
				emails={emails}
				description={t("forms:descriptions.myEmails")}
			/>
		</Column>
	)
})

export function MobilePhoneRow() {
	const { t, i18n } = useTranslation()
	const [confirmPhoneModal, setConfirmPhoneModal] = useState(false)

	const user = useStorePath("auth", "user")
	//const mobilePhone = (user.data && user.data.mobilePhone) || {}
	//	const [inputNumber, setInputNumber] = useState(mobilePhone.number || "")
	const [error, setError] = useState(null)

	//	const hasChanged = (mobilePhone.number || "") !== inputNumber
	const model = useStorePath("settings", "profile", "mobilePhone")
	function savePhoneNumber() {
		if (model.number.isDirty || model.status.value === "unverified") {
			user
				.update({ phoneNumber: model.number.value })
				.then(() => setConfirmPhoneModal(true))
				.catch((e) => setError(e.message))
		}
	}

	function onConfirmClose() {
		setConfirmPhoneModal(false)
		user.read()
	}

	return (
		<Label
			label={t("forms:labels.phone")}
			component={Row}
			of="component"
			error={error}
		>
			<PhoneNumberField
				status={model.number.isPristine && model.status.value}
				onChangeText={(v) => model.number.setValue(v)}
				value={model.number.value}
			/>

			<Row flex={1}>
				{(model.number.isDirty || model.status.value === "unverified") && (
					<Button
						secondary
						bold
						text={t("general:buttons.validNo")}
						onClick={savePhoneNumber}
					/>
				)}

				<ConfirmPhoneModal
					visible={confirmPhoneModal}
					onRequestClose={onConfirmClose}
				/>
			</Row>
		</Label>
	)
}

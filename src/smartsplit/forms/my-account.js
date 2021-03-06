import React, { useState, useEffect } from "react"
import MoreHorizontal from "../../../assets/svg/more-horizontal.svg"
import CheckMark from "../../svg/check-mark"
//import { useStorePath } from "../../appstate/react"
import { useStores, useStorePath } from "../../mobX"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { Platform } from "../../platform"
import { Group, Hairline, Flex, Row, Column, NoSpacer } from "../../layout"
import { Heading, Paragraph, Text } from "../../text"
import { Colors } from "../../theme"
import { TextField, Select, CheckBox } from "../../forms"
import { PhoneNumberField } from "../../forms/phone-number"
import Button from "../../widgets/button"
import ConfirmPhoneModal from "../../pages/dashboard/confirm-phone"
import { EmailManager } from "../components/EmailManager"
import { Status } from "../../utils/enums"
import Label from "../../forms/label"
import { observer } from "mobx-react"
import { toJS } from "mobx"

export default observer(function MyAccount({ title }) {
	const { t, i18n } = useTranslation()
	const model = useStorePath("settings", "profile")
	const emails = useStorePath("settings", "emails", "list")
	//console.log(emails)
	function handleLanguageChange(language) {
		try {
			i18n.changeLanguage(language)
		} catch (e) {
			console.error(e)
		}
	}

	return (
		<Column of="group">
			{title && <Heading level="2">{title}</Heading>}
			<TextField field={model.address} />
			{Platform.web && (
				<>
					<Row of="component">
						<Select
							initialValue={model.locale.value}
							value={model.locale.value}
							placeholder={model.locale.value === "en" ? "English" : "Français"}
							label={t(model.locale.label)}
							options={[
								{ key: "fr", value: "Français" },
								{ key: "en", value: "English" },
							]}
							onChange={(lang) => {
								model.locale.setValue(lang)
								handleLanguageChange(lang)
							}}
						/>
						<Flex />
					</Row>

					<MobilePhoneRow />
				</>
			)}

			{Platform.native && <PhoneNumberField label={t("forms:labels.phone")} />}
			<EmailManager />
		</Column>
	)
})

export const MobilePhoneRow = observer(() => {
	const { t, i18n } = useTranslation()
	const [confirmPhoneModal, setConfirmPhoneModal] = useState(false)

	const user = useStorePath("auth", "user")
	//const mobilePhone = (user.data && user.data.mobilePhone) || {}
	//	const [inputNumber, setInputNumber] = useState(mobilePhone.number || "")
	const [error, setError] = useState(null)

	//	const hasChanged = (mobilePhone.number || "") !== inputNumber
	const model = useStorePath("settings", "profile", "mobilePhone")
	//console.log(toJS(model))
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
			{/*<PhoneNumberField
				status={model.number.isPristine && model.status.value}
				onChangeText={(v) => model.number.setValue(v)}
				value={model.number.value}
			/>*/}
			<TextField
				field={model.number}
				onKeyPress={(e) => {
					if (e.key === "Escape") {
						model.number.reset()
						e.target.blur()
					}
				}}
				after={
					model.numberChanged ? (
						<MoreHorizontal />
					) : (
						<CheckMark color={Colors.action} />
					)
				}
			/>
			<Row flex={1}>
				{model.numberChanged && (
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
})

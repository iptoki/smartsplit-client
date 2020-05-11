import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { Platform } from "../../platform"
import { Group, Hairline, Flex, Row, Column } from "../../layout"
import { Heading, Paragraph, Text } from "../../text"
import { Colors } from "../../theme"
import { TextField, Dropdown, CheckBox } from "../../forms"
import Button from "../../widgets/button"
import ConfirmPhoneModal from "../../pages/dashboard/confirm-phone"
import { PhoneNumberField } from "../../forms/phone-number"
import { MailList } from "../components/mail-list"
import { Status } from "../../utils/enums"

export default function MyAccount() {
	const { t } = useTranslation()
	const emails = [
		{
			email: "main@iptoki.com",
			status: Status.main,
		},
		{
			email: "active@iptoki.com",
			status: Status.active,
		},
		{
			email: "pending@iptoki.com",
			status: Status.pending,
		},
	]

	return (
		<Column of="group">
			{Platform.web && <Heading level="2">{t("settings:settings")}</Heading>}
			<TextField label={t("forms:labels.civicAddress")} />
			{Platform.web && (
				<>
					<Dropdown
						label={t("forms:labels.dropdowns.language")}
						noFocusToggle
						style={{ width: "50%" }}
					/>
					<Row of="component" valign="bottom">
						<PhoneNumberField label={t("forms:labels.phone")} />
						<Button secondary bold text={t("general:buttons.validNo")} />
					</Row>
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
}
import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Platform } from "../../platform"
import { Group, Hairline, Flex, Row, Column, Spacer } from "../../layout"
import { Heading, Paragraph, Text } from "../../text"
import { Colors } from "../../theme"
import { TextField, Dropdown, CheckBox, DateField } from "../../forms"
import SearchAndTag from "../../forms/search-and-tag"
import { ProIdList } from "../components/pro-id-list"
import { useStorePath } from "../../mobX"
import companiesList from "../../data/companies"
export default function MyProIdentity() {
	const [t] = useTranslation()
	const model = useStorePath("settings", "profile")
	const [searchOrgs, setSearchOrgs] = useState("")
	return (
		<Column of="group" flex={1}>
			{Platform.web && <Heading level="2">{t("settings:identity")}</Heading>}
			<Row flex={1}>
				<SearchAndTag
					field={model.organisations}
					placeholder={t("forms:placeholders.organisations")}
					search={searchOrgs}
					onSearchChange={setSearchOrgs}
					searchResults={[...companiesList]
						.filter((c) => c.toLowerCase().indexOf(searchOrgs) > -1)
						.splice(0, 10)}
				/>
			</Row>
			<Row>
				<ProIdList />
			</Row>
			<TextField field={model.birthDate} placeholder={"YYYY-MM-DD"} />
			<TextField field={model.isni} placeholder="1234 1234 1234 1234" />
			<TextField
				field={model.uri}
				placeholder={t("forms:placeholders.myUri")}
			/>
		</Column>
	)
}

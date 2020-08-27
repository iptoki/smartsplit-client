import React, { useState } from "react"
import { StyleSheet } from "react-native"
import { useHistory } from "react-router"
import { useStorePath } from "../../../appstate/react"
import { useTranslation } from "react-i18next"
import { useCurrentWorkpiece } from "../context"
import Layout from "../layout"
import Button from "../../../widgets/button"
import { Column, Row, Flex, Hairline, Spacer } from "../../../layout"
import { Text, Heading, Paragraph } from "../../../text"
import { Colors, Metrics } from "../../../theme"
import ReleasetIcon from "../../../svg/release"

import {
	RadioGroupButton,
	RadioButton,
	RadioGroup,
	CheckBox,
	CheckBoxGroup,
	Dropdown,
	DateField,
	TextField,
} from "../../../forms"
import AddCollaboratorDropdown from "../../../smartsplit/components/add-collaborator-dropdown"

const styles = StyleSheet.create({
	dropdown: {
		marginLeft: Metrics.spacing.large,
	},
})

export default function Release() {
	const { t } = useTranslation()
	const history = useHistory()
	const workpiece = useCurrentWorkpiece()

	function saveAndQuit() {
		history.push("/dashboard/")
	}

	function navigateToSummary() {
		history.push(`/workpieces/${workpiece.id}`)
	}

	function navigateToInterpretation() {
		history.push(`/workpieces/${workpiece.id}/rights-splits/interpretation`)
	}

	return (
		<Layout
			workpiece={workpiece}
			title={workpiece}
			path={[t("document:navbar.document"), t("document:navbar.pages.release")]}
			progress={50}
			actions={
				<Button
					tertiary
					text={t("general:buttons.saveClose")}
					onClick={saveAndQuit}
				/>
			}
			formNav={
				<>
					<Row flex={1}>
						<Button
							secondary
							text={t("general:buttons.back")}
							onClick={navigateToSummary}
						/>
						<Flex />
						<Button
							primary
							text={t("general:buttons.pass")}
							onClick={navigateToInterpretation}
						/>
					</Row>
					<Row flex={1} />
				</>
			}
		>
			<ReleaseForm />
		</Layout>
	)
}

export function ReleaseForm(props) {
	const searchResults = ["Aut", "Chose", "Comme", "Resultat"]
	const [search, setSearch] = useState("")
	const [date, setDate] = useState("")
	const { t } = useTranslation()
	const { digital, physical } = props

	return (
		<>
			<Row>
				<Column of="group" flex={5}>
					<Text action bold valign="center">
						<ReleasetIcon />
						{t("document:release.category")}
						<Row padding="tiny" />
					</Text>
					<Heading level={1}>{t("document:release.title")}</Heading>
					<Paragraph>{t("document:release.paragraph")}</Paragraph>

					<Spacer of="group" />

					<DateField
						label={t("document:release.date")}
						undertext={t("document:release.dateHint")}
						value={date}
						onChangeText={setDate}
						placeholder={t("forms:placeholders.date")}
						tooltip=""
					/>
					<Dropdown
						label="Label"
						placeholder={t("document:release.addLabel")}
						noFocusToggle
						tooltip=""
					/>
					<Dropdown
						label={t("document:release.format")}
						placeholder=""
						noFocusToggle
						tooltip=""
					/>

					<EP />
					<CheckBoxGroup label={t("document:release.supports.support")}>
						<CheckBox
							value={digital}
							label={t("document:release.supports.digital")}
						/>
					</CheckBoxGroup>
					<DigitalOptions />
					<CheckBox
						value={physical}
						label={t("document:release.supports.physical")}
					/>
				</Column>
				<Flex />
				<Column of="group" flex={4}>
					<Column of="component" padding="component" layer="underground">
						<Column of="inside">
							<Text small bold tertiary>
								{t("document:help")}
							</Text>
							<Hairline />
						</Column>
						<Heading level={4}>{t("document:release.why")}</Heading>
						<Text secondary>
							Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum
							dolor sit amet.
						</Text>
					</Column>
				</Column>
			</Row>
		</>
	)
}

export function EP(props) {
	const { t } = useTranslation()

	return (
		<Column>
			<Row>
				<Column padding="component" layer="left_overground" />
				<Column of="group" flex={5}>
					<TextField label={t("document:release.ep")} name="ep" />
				</Column>
			</Row>
		</Column>
	)
}

export function DigitalOptions() {
	const { t } = useTranslation()
	return (
		<Column of="component" style={styles.dropdown}>
			<Dropdown
				label={t("document:release.supports.distribution")}
				placeholder={t("document:release.supports.addDistribution")}
				noFocusToggle
				tooltip=""
				style={{ flex: 1 }}
			/>
			<Dropdown
				label={t("document:release.supports.upc")}
				noFocusToggle
				tooltip=""
				style={{ flex: 1 }}
			/>
		</Column>
	)
}

import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import Label from "../../forms/label"
import { Paragraph, Text } from "../../text"
import { Column, Row, Spacer } from "../../layout"
import Button from "../../widgets/button"
import { Colors, Metrics } from "../../theme"
import { TextField } from "../../forms/"
import { Platform } from "../../platform"
import { CheckBox } from "../../forms"
import PlusCircle from "../../svg/plus-circle"
import { observer } from "mobx-react"
import { useStorePath } from "../../mobX"
import AddProIdModal from "../user/AddProIdModal"
import ProfessionalIdentityModel from "../../mobX/models/settings/ProfessionalIdentityModel"
import HelpCircleFull from "../../svg/help-circle-full"
import { TooltipIcon } from "../../widgets/tooltip"
import RelativeTooltip from "../../widgets/tooltip"
const IdFields = observer((props) => {
	const { model, ids } = props
	const { t } = useTranslation()
	const textFields = ids.map((entry, i) => (
		<TextField
			label={t(`copyrightOrgs:name.${entry.name}`)}
			tooltip={"test"}
			value={entry.value}
			onChange={(e) => {
				model.ids.setItem(i, { name: entry.name, value: e.target.value })
			}}
		/>
	))
	const rows = []
	for (let i = 0; i < textFields.length; i += 2)
		rows.push(
			<React.Fragment key={"tfcols" + i}>
				<Column flex={1}>{textFields[i]}</Column>
				<Column>
					<Spacer of="component" />
				</Column>
				<Column flex={1}>
					{textFields[i + 1] ? textFields[i + 1] : <Spacer />}
				</Column>
			</React.Fragment>
		)

	return (
		<Column
			padding="component"
			style={{
				borderLeftStyle: "solid",
				borderLeftColor: "#cccccc",
				borderLeftWidth: 2,
			}}
			flex={1}
		>
			{rows.map((columns, i) => (
				<React.Fragment key={"pidrow" + i}>
					<Spacer of={"component"} />
					<Row flex={1}>{columns}</Row>
				</React.Fragment>
			))}
			<Spacer of={"component"} />
		</Column>
	)
})
export const ProIdList = observer((props) => {
	const { t } = useTranslation()
	const { description } = props
	const model = useStorePath("settings", "profile", "professional_identity")
	const [modalVisible, setModalVisible] = useState(false)
	const ids = model.ids
	const proIds = ids.value
	console.log(toJS(proIds))

	return (
		<Label {...props}>
			<Column of="component">
				{description && <Paragraph>{description}</Paragraph>}

				{/*<Column padding="component" layer="left_overground" />*/}

				{proIds && (
					<Row>
						<IdFields model={model} ids={toJS(model.ids.value)} />
					</Row>
				)}
				<Row>
					<Button
						secondaryWithIcon
						bold
						icon={<PlusCircle color={Colors.action} />}
						text={t("general:buttons.addProId")}
						onClick={() => setModalVisible(true)}
					/>
				</Row>
				<Row>
					<CheckBox field={model.public} />
				</Row>
			</Column>
			<AddProIdModal
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
			/>
		</Label>
	)
})

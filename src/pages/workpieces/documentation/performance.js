import React, { useState } from "react"
import { TouchableWithoutFeedback, View } from "react-native"
import { useHistory } from "react-router"
import { useStorePath } from "../../../appstate/react"
import { useTranslation } from "react-i18next"
import { useCurrentWorkpiece } from "../context"
import Layout from "../layout"
import Button from "../../../widgets/button"
import { Column, Row, Flex, Hairline, Spacer } from "../../../layout"
import { Text, Heading, Paragraph } from "../../../text"
import TextField from "../../../forms/text"
import { Colors, Metrics } from "../../../theme"
import PerformanceIcon from "../../../svg/performance"
import {
	RadioGroupButton,
	RadioGroup,
	CheckBox,
	CheckBoxGroup,
	Dropdown,
	Select,
} from "../../../forms"
import AddCollaboratorDropdown from "../../../smartsplit/components/AddCollaboratorDropdown"
import AddInstrumentDropdown from "../../../smartsplit/components/add-instrument-dropdown"
import AddContributorDropdown from "../../../smartsplit/components/AddContributorDropdown"
import { observer } from "mobx-react"
import {
	useArtistAutocomplete,
	useAuthUser,
	useDocsModel,
	ResultsOrder,
} from "../../../mobX/hooks"
import { useStores } from "../../../mobX"
import { useRightSplits } from "../../../mobX/hooks"
import { useCurrentWorkpieceId } from "../context"
import ContributorsState from "../../../mobX/states/ContributorsState"
import ContributorModel from "../../../mobX/models/user/ContributorModel"
import DocPerformanceModel from "../../../mobX/models/workpieces/documentation/DocPerformanceModel"
import { PerformerTypeForDocs } from "../../../mobX/models/workpieces/documentation/PerformerModel"
import { Tag } from "../../../widgets/tag"
import { toJS } from "mobx"
import UserAvatar from "../../../smartsplit/user/avatar"
import HelpCircleFull from "../../../svg/help-circle-full"
import XIcon from "../../../svg/x"
import Field from "../../../mobX/BaseModel/Field"
import InstrumentTag from "../../../smartsplit/components/InstrumentTag"
import IconDescriptionSelect, {
	IconDescriptionItem,
} from "../../../forms/IconDescriptionSelect"
import { Group } from "../../../layout"
import { CardStyles } from "../../../widgets/card"
import { FormStyles } from "./FormStyles"

const frameStyle = [CardStyles.frame, FormStyles.frame]

const PerformanceForm = observer((props) => {
	const [search, setSearch] = useState("")
	const { t } = useTranslation()

	const workpiece = useCurrentWorkpiece()
	const workpieceId = workpiece.id
	const { contributors } = useStores()
	const model: DocPerformanceModel = useDocsModel(workpieceId, "performance")
	window.docModel = model
	const getResults = useArtistAutocomplete()
	const searchResults = getResults(search, 10, ResultsOrder.contributorsFirst)

	const fakeSearchResults = [
		{
			user_id: "09a082f1-41a7-4e09-8ee3-e5e0fdad8bbb",
			firstName: "Willy",
			lastName: "Nilly",
			artistName: "Willy the Poo",
			avatarUrl:
				"https://apiv2-dev.smartsplit.org/v1/users/09a082f1-41a7-4e09-8ee3-e5e0fdad8bbb/avatar",
		},
		{
			user_id: "09a082f1-41a7-4e09-8ee3-e5e0fdad8bbc",
			firstName: "Will",
			lastName: "Nill",
			artistName: "Chill Bill",
		},
		{
			user_id: "09a082f1-41a7-4e09-8ee3-e5e0fdad8bbd",
			firstName: "Lila",
			lastName: "Ait",
			artistName: "Lady Lila",
		},
		{
			user_id: "09a082f1-41a7-4e09-8ee3-e5e0fdad8bbc",
			firstName: "Wes",
			lastName: "Johnson",
			artistName: "Fat-Fuck Frank",
		},
		{
			user_id: "09a082f1-41a7-4e09-8ee3-e5e0fdad8bbd",
			firstName: "Harris Glen",
			lastName: "Milstead",
			artistName: "Divine",
		},
	]

	const results = searchResults.concat(fakeSearchResults).splice(0, 10)

	const searchFilter = (user) => {
		let name =
			user.firstName +
			" " +
			user.lastName +
			(user.artistName ? ` (${user.artistName})` : "")
		return name.indexOf(search) > -1
	}

	const searchFilteredResults = results.filter(searchFilter)

	const modelValueFilter = (
		v: {
			firstName: string,
			lastName: string,
			artistName: string,
			user_id: string,
		},
		field: Field
	) => {
		let exists = false
		field.array.forEach((selected) => {
			if (v.user_id === selected.uid) exists = true
		})
		return !exists
	}

	const performerSearchResults = searchFilteredResults.filter((result) =>
		modelValueFilter(result, model.performers)
	)

	return (
		<Row>
			<Column of="group" flex={5}>
				<Text action bold style={FormStyles.category}>
					<PerformanceIcon style={FormStyles.logo} />
					{t("document:performance.category")}
					<Row padding="tiny" />
				</Text>
				<Heading level={1}>{t("document:performance.title")}</Heading>
				<Paragraph>{t("document:performance.paragraph")}</Paragraph>

				<Spacer of="group" />

				{model.performers.array.map((performer, index) => (
					<Column
						style={FormStyles.dropdown}
						key={"u" + performer.user.user_id}
					>
						<PerformanceOptions
							model={performer}
							index={index}
							field={model.performers}
						/>
						<Spacer of="group" />
					</Column>
				))}
				<AddCollaboratorDropdown
					alwaysShowAdd
					onSelect={(selection) => {
						if (
							!model.performers.array.filter(
								(v) => v.user.user_id === selection.user_id
							).length
						)
							model.performers.add({ user: selection })
					}}
					placeholder={t("document:performance.roles.addPerformer")}
				/>
				{/*
					  ////////////////
					  j'ai commenté-out cette section maintenant tu peux choisir un user et faire apparaite
					  les options tu kes retrouvera à partir de la ligne #154
					  ///////////////
					  
					  {setSearch && (
						<Column style={Styles.dropdown}>
							<PerformanceOptions />
						</Column>
					)}*/}

				{/* 
					<AddCollaboratorDropdown
						searchResults={searchResults}
						searchInput={search}
						onSearchChange={setSearch}
						onSelect={(selection) => console.log(selection)}
						placeholder={t("document:performance.roles.addPerformer")}
					/> */}
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
					<Heading level={4}>{t("document:performance.what")}</Heading>
					<Text secondary>
						Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum
						dolor sit amet.
					</Text>
				</Column>
			</Column>
		</Row>
	)
})

export default PerformanceForm

export const PerformanceOptions = observer((props) => {
	/**
	 *
	 *  model passed to props looks like this :
	 *  each of these properties is a field
	 *
	 *
	 *  {
	 *    user:{user_id:"" ....},
	 *    type:"string" 'principle' | 'featured' | 'bandMember' | 'accompanying'
	 *    isSinger:boolean,
	 *    isMusician:boolean,
	 *    instruments : [{
	 *        instrument:{id:"",name:""}
	 *       role:{id:"",name:""}
	 *     }]
	 * }
	 */
	const { model, field, index } = props
	//console.log(field)
	const { t } = useTranslation()
	const [selected, setSelected] = useState()
	const splitState = useRightSplits(useCurrentWorkpieceId(), "performance")
	const domainState = splitState.domainState

	/* 	const artistTypes = ["mainArtist", "feature", "groupMember", "backupArtist"]

	function genSelectOptions() {
		return artistTypes.map((artist) => {
			return {
				key: artist,
				value: (
					<>
						<Text>{t(`forms:labels.dropdowns.artistTypes.${artist}`)}</Text>
						<Text secondary>
							{t(`forms:labels.dropdowns.artistTypesDescription.${artist}`)}
						</Text>
					</>
				),
				displayValue: t(`forms:labels.dropdowns.artistTypes.${artist}`),
			}
		})
	} */

	function genSelectOptions() {
		return Object.keys(PerformerTypeForDocs).map((artist) => {
			return {
				key: artist,
				value: (
					<>
						<Text>{t(`document:performance.artistTypes.${artist}`)}</Text>
						<Text secondary>
							{t(`document:performance.artistTypesDescription.${artist}`)}
						</Text>
					</>
				),
				displayValue: t(`document:performance.artistTypes.${artist}`),
			}
		})
	}

	return (
		<Column of="component">
			<Row
				of="component"
				padding="tiny"
				style={frameStyle}
				key={model.user.value.user_id}
			>
				<Column valign="spread" align="center" padding="tiny">
					<UserAvatar size="small" user={model.user.value} />
				</Column>
				<Column flex={1} padding="tiny">
					<Text bold size="tiny">
						{`${model.user.value.firstName} ${model.user.value.lastName} ${
							model.user.value.artistName
								? ` (${model.user.value.artistName})`
								: ""
						}`}
					</Text>
				</Column>
				<Column padding="tiny">
					<TouchableWithoutFeedback onPress={() => field.remove(index)}>
						<View>
							<XIcon />
						</View>
					</TouchableWithoutFeedback>
				</Column>
			</Row>
			<Row>
				<Column padding="component" layer="left_overground" />
				<Column of="component" flex={5}>
					{/**
					 * Below we filter options to exclude those already in our list
					 * model.ids.value is an array of {name:"org", value:"id"}
					 */}

					{/* ToFix: Longer text is not wrapper in dropdown */}

					<Select
						options={genSelectOptions()}
						/* 	options={artistTypes.map((artist) => ({
							name: t(`document:performance.dropdown.${artist}`),
							key: artist,
							description: t(`document:performance.description.${artist}`),
						}))} */
						value={model.type.value}
						placeholder={
							model.type.value ? (
								<IconDescriptionItem
									name={t(`document:performance.dropdown.${selected}`)}
									description={t(
										`document:performance.description.${selected}`
									)}
								/>
							) : (
								t("document:performance.whichPerformance")
							)
						}
						onChange={(v) => {
							model.type.setValue(v)
						}}
					/>

					<CheckBoxGroup label={t("document:performance.whichRole")}>
						<CheckBox field={model.isSinger} />
						<CheckBox field={model.isMusician} />
					</CheckBoxGroup>

					{model.isMusician.value && (
						<Column of="tiny">
							{model.instruments.array.map((entry, index) => (
								<InstrumentTag
									key={entry.instrument.value.entity_id}
									instrument={entry.instrument.value}
									index={index}
									field={model.instruments}
								/>
							))}
							{/* <AddInstrumentDropdown
									hideEmpty
									style={{ flex: 1 }}
									key={`instr-${index}`}
									placeholder={t("document:performance.addInstrument")}
									selection={entry.instrument.value}
									onSelect={(selection) =>
										model.instruments.setItem(index, { instrument: selection })
									}
									onUnselect={() => model.instruments.remove(index)}
								/> */}
							<AddInstrumentDropdown
								style={{ flex: 1 }}
								placeholder={t("document:performance.addInstrument")}
								onSelect={(selection) => {
									model.instruments.add({ instrument: selection })

									console.log(window.docModel.toJS())
								}}
							/>
						</Column>
					)}
				</Column>
			</Row>
			<Spacer of="section" />
			<Hairline />
		</Column>
	)
})

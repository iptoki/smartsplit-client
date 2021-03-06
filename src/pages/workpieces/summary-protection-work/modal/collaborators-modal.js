import React, { useEffect, useState } from "react"
import { Column, Flex, Group, Hairline, Row } from "../../../../layout"
import { useTranslation } from "react-i18next"
import { DialogModal } from "../../../../widgets/modal"
import Button from "../../../../widgets/button"
import { Heading, Text } from "../../../../text"
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native"
import moment from "moment"
import ModifierSVG from "../../../../svg/modify-svg"
import ItemVersionDetail from "./item-version-detail"
import SectionCollaborator from "./section-collaborators"
import Confidentiality from "./confidentiality"
import { useRightSplits } from "../../../../mobX/hooks"
import { useCurrentWorkpieceId } from "../../context"
import { observer } from "mobx-react"
import SplitChart, {
	DualSplitChart,
} from "../../../../smartsplit/components/split-chart"

const Styles = StyleSheet.create({
	highlightWord: {
		color: "#2DA84F",
		fontWeight: "bold",
	},
	modifyBtn: { borderWidth: 1, borderColor: "#DCDFE1", borderStyle: "solid" },
	section: {
		paddingTop: 56,
	},
	item: {
		paddingTop: 16,
	},
})

const roles = [
	{ id: 1, name: "Auteur" },
	{ id: 2, name: "Compositeur" },
	{ id: 3, name: "Arrangeur" },
]

const CollaboratorModal = observer((props) => {
	const rightSplits = useRightSplits(useCurrentWorkpieceId())
	const { t } = useTranslation()
	const { visible, onRequestClose, data } = props
	console.log("data", data)
	const copyright = Array.from(data.copyright ? data.copyright : [])
	const interpretation = Array.from(
		data.interpretation ? data.interpretation : []
	)
	const soundRecording = Array.from(
		data.soundRecording ? data.soundRecording : []
	)

	return (
		<DialogModal
			key="collaborator-modal"
			size="large"
			visible={visible}
			onRequestClose={onRequestClose}
			title={t("shareYourRights:tabBar.version", { num: data.version || "" })}
			titleLevel={3}
			underTitle={
				<Text
					secondary
					small
					dangerouslySetInnerHTML={{
						__html: t("shareYourRights:collaboratorModal.underTitle", {
							name: data.updateBy,
							time: moment(data.lastUpdate).startOf("minute").fromNow(),
						}),
					}}
				></Text>
			}
			buttons={
				<>
					<Button
						secondary
						text={t("shareYourRights:tabBar.dragDrop.createNewversion")}
						onClick={() => onRequestClose(false)}
					/>
					<Button
						text={t(
							"shareYourRights:tabBar.myCollaborators.sendToCollaborators"
						)}
						onClick={() => onRequestClose(true)}
					/>
				</>
			}
		>
			<Group>
				<Row>
					<Flex>
						{data && data.copyright && (
							<SectionCollaborator
								title={t("shareYourRights:collaboratorModal.copyright")}
								splitState={rightSplits.copyright}
								chart={
									rightSplits.copyright.domainState.mode === "roles" ? (
										<DualSplitChart
											{...rightSplits.copyright.genChartProps(
												rightSplits.copyright.domainState.mode
											)}
											size={300}
										/>
									) : (
										<SplitChart
											{...rightSplits.copyright.genChartProps(
												rightSplits.copyright.domainState.mode
											)}
											size={300}
										/>
									)
								}
								data={copyright}
								canModify
								isModal
							/>
						)}
						{data && data.interpretation && (
							<SectionCollaborator
								title={t("shareYourRights:collaboratorModal.interpretation")}
								splitState={rightSplits.performance}
								chart={
									<SplitChart
										{...rightSplits.performance.genChartProps()}
										startAngle={rightSplits.performance.startAngle}
										size={300}
									/>
								}
								style={Styles.section}
								data={interpretation}
								canModify
								isModal
							/>
						)}
						{data && data.soundRecording && (
							<SectionCollaborator
								title={t("shareYourRights:collaboratorModal.soundRecording")}
								splitState={rightSplits.recording}
								style={Styles.section}
								data={soundRecording}
								chart={
									<SplitChart
										{...rightSplits.recording.genChartProps()}
										size={300}
									/>
								}
								canModify
								isModal
							/>
						)}
						{data && data.confidentiality && (
							<Confidentiality
								isModal
								data={data.confidentiality}
								canModify
								style={Styles.section}
							/>
						)}
					</Flex>
				</Row>
			</Group>
		</DialogModal>
	)
})
export default CollaboratorModal

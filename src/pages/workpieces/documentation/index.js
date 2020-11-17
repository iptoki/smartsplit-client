import React, { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { Redirect, useHistory, useParams } from "react-router"
import { observer } from "mobx-react"
import { useStorePath, useStores } from "../../../mobX"
import { useCurrentWorkpiece } from "../context"
import Layout from "../layout"
import Button from "../../../widgets/button"
import { Flex, Row, Column } from "../../../layout"
import CreationForm from "./creation"
import { Text } from "../../../text"
import { PerformanceForm } from "./performance"
import { RecordingForm } from "./recording"
import { LyricsForm } from "./lyrics"
import { FilesForm } from "./files"
import { ReleaseForm } from "./release"
import Links from "./links"
import { GeneralInfosForm } from "./general-infos"

const DocumentationPage = observer(() => {
	const { t } = useTranslation()
	const [endModal, setEndModal] = useState(false)
	const history = useHistory()
	const { workpieces } = useStores()
	// Type représente le type de documentation : Création, Paroles, Sortie etc...
	const { workpiece_id, type } = useParams()
	if (!workpiece_id) navigateToSummary()
	else if (!type)
		return (
			<Redirect to={`/workpieces/${workpiece_id}/documentation/creation`} />
		)
	const workpiece = useStorePath("workpieces").fetch(workpiece_id)

	const documentations = {
		creation: {
			form: CreationForm,
			progress: 12.5,
			title: t("document:navbar.pages.creation"),
		},
		performance: {
			form: PerformanceForm,
			progress: 25,
			title: t("document:navbar.pages.performance"),
		},
		recording: {
			form: RecordingForm,
			progress: 37.5,
			title: t("document:navbar.pages.recording"),
		},
		release: {
			form: ReleaseForm,
			progress: 50,
			title: t("document:navbar.pages.release"),
		},
		files: {
			form: FilesForm,
			progress: 62.5,
			title: t("document:navbar.pages.files"),
		},
		infos: {
			form: GeneralInfosForm,
			progress: 75,
			title: t("document:navbar.pages.infos"),
		},
		lyrics: {
			form: LyricsForm,
			progress: 87.5,
			title: t("document:navbar.pages.lyrics"),
		},
		links: {
			form: Links,
			progress: 100,
			title: t("document:navbar.pages.links"),
		},
	}

	function navigateToSummary() {
		history.push(`/workpieces/${workpiece.id}`)
	}

	function toPreviousPage() {
		type === "creation" && navigateToSummary()
		type === "performance" &&
			history.push(`/workpieces/${workpiece.id}/documentation/creation`)
		type === "recording" &&
			history.push(`/workpieces/${workpiece.id}/documentation/performance`)
		type === "release" &&
			history.push(`/workpieces/${workpiece.id}/documentation/recording`)
		type === "files" &&
			history.push(`/workpieces/${workpiece.id}/documentation/release`)
		type === "infos" &&
			history.push(`/workpieces/${workpiece.id}/documentation/files`)
		type === "lyrics" &&
			history.push(`/workpieces/${workpiece.id}/documentation/release`)
		type === "links" &&
			history.push(`/workpieces/${workpiece.id}/documentation/lyrics`)
	}

	function toNextPage() {
		type === "creation" &&
			history.push(`/workpieces/${workpiece.id}/documentation/performance`)
		type === "performance" &&
			history.push(`/workpieces/${workpiece.id}/documentation/recording`)
		type === "recording" &&
			history.push(`/workpieces/${workpiece.id}/documentation/release`)
		type === "release" &&
			history.push(`/workpieces/${workpiece.id}/documentation/files`)
		type === "files" &&
			history.push(`/workpieces/${workpiece.id}/documentation/infos`)
		type === "infos" &&
			history.push(`/workpieces/${workpiece.id}/documentation/lyrics`)
		type === "lyrics" &&
			history.push(`/workpieces/${workpiece.id}/documentation/links`)
		if (type === "links") {
			setEndModal(true)
		}
	}

	return (
		<Layout
			workpiece={workpiece}
			progress={documentations[type].progress}
			path={[t("document:navbar.document"), documentations[type].title]}
			actions={
				<Button
					tertiary
					text={t("general:buttons.saveClose")}
					onClick={() => {}}
					// disabled={!rightsSplits.$hasChanged}
				/>
			}
			formNav={
				<Row style={{ maxWidth: 464 }} flex={1}>
					<Button
						secondary
						text={t("general:buttons.back")}
						onClick={toPreviousPage}
					/>
					<Flex />
					<Button
						//resultsRef={resultsRef}
						primary
						text={
							(type === "links"
								? t("general:buttons.end")
								: t("general:buttons.continue"),
							type === "files"
								? t("general:buttons.pass")
								: t("general:buttons.continue"))
						}
						onClick={toNextPage}
					/>
				</Row>
			}
		>
			{!workpieces.isLoading &&
				React.createElement(documentations[type].form, {
					modalVisible: endModal,
					closeModal: () => {
						setEndModal(false)
					},
				})}
		</Layout>
	)
})

export default DocumentationPage

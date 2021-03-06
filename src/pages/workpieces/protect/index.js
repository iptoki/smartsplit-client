import React, { useState } from "react"
import { Redirect, useHistory, useParams } from "react-router"
import { observer } from "mobx-react"
import { useTranslation } from "react-i18next"
import { useStorePath, useStores } from "../../../mobX"
import Layout from "../layout"
import { Row, Flex } from "../../../layout"
import Button from "../../../widgets/button"
import { useProtectModel } from "../../../mobX/hooks"
import SelectionPage from "./selection"
import Certificate from "./certificate"
import ProtectionModel from "../../../mobX/models/workpieces/protect/ProtectionModel"
import { PromoModal } from "./promo-modal"

const ProtectWork = observer(() => {
	const { workpieces } = useStores()
	const [endModal, setEndModal] = useState(false)
	const { t } = useTranslation()
	const history = useHistory()
	const { workpiece_id, type } = useParams()
	const model: ProtectionModel = useProtectModel(workpiece_id)
	const workpiece = useStorePath("workpieces").fetch(workpiece_id)
	const [showPromo, setShowPromo] = useState(true)
	const onPromoClosed = () => {
		setShowPromo(false)
	}

	if (!workpiece_id) navigateToSummary()
	else if (!type)
		return <Redirect to={`/workpieces/${workpiece_id}/protect/selection`} />

	const protectPage = {
		selection: {
			form: SelectionPage,
			progress: 50,
			title: t("protect:navbar.pages.selection"),
		},
		certificate: {
			form: Certificate,
			progress: 87.5,
			title: t("protect:navbar.pages.certificate"),
		},
	}

	const navigateToSummary = () => {
		history.push(`/workpieces/${workpiece.id}`)
	}

	const toPreviousPage = () => {
		model.save(type)
		type === "selection" && navigateToSummary()
		type === "certificate" &&
			history.push(`/workpieces/${workpiece.id}/protect/selection`)
	}

	const toNextPage = () => {
		model.save(type)
		type === "selection" &&
			history.push(`/workpieces/${workpiece.id}/protect/certificate`)
		if (type === "certificate") {
			setEndModal(true)
		}
	}

	async function saveAndClose() {
		try {
			model.save()
			navigateToSummary()
		} catch (err) {
			alert("Error saving protect")
		}
	}

	return (
		<>
			<PromoModal
				visible={showPromo}
				onRequestClose={onPromoClosed}
			></PromoModal>
			<Layout
				workpiece={workpiece}
				progress={protectPage[type].progress}
				path={[t("protect:navbar.protect"), protectPage[type].title]}
				actions={
					<Button
						tertiary
						bold
						text={t("general:buttons.saveClose")}
						onClick={saveAndClose}
						//disabled={!protect.$hasChanged}
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
							primary
							text={
								(type === "certificate"
									? t("general:buttons.end")
									: t("general:buttons.continue"),
								type === "certificate"
									? t("protect:publishOnBlockchain")
									: t("general:buttons.continue"))
							}
							onClick={toNextPage}
						/>
					</Row>
				}
			>
				{!workpieces.isLoading &&
					React.createElement(protectPage[type].form, {
						modalVisible: endModal,
						closeModal: () => {
							setEndModal(false)
						},
					})}
			</Layout>
		</>
	)
})

export default ProtectWork

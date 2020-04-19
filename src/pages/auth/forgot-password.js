import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useHistory } from "react-router-dom"
import { Group, Column, Row, Flex } from "../../layout"
import { Heading, Text, Paragraph, Link } from "../../text"
import TextField from "../../forms/text"
import Button from "../../widgets/button"
import { Metrics, Links, Colors } from "../../theme"
import AuthLayout from "./layout"
import { notEmptyValidator } from "../../../helpers/validators"
import { Platform } from "../../platform"

export default function GetPassword({ users, forgotPassword }) {
	const [t] = useTranslation()
	const history = useHistory()
	const state = users.forgotPassword

	const [email, setEmail] = useState("")
	const [hasSubmitted, setHasSubmitted] = useState(false)

	const validEmail = notEmptyValidator(email)
	const canSubmit = !hasSubmitted && !state.isLoading && validEmail

	const errorMessage =
		state.error &&
		(state.error.code === "user_not_found"
			? "errors:noUser"
			: state.error.message)

	const handleSubmit = () => {
		setHasSubmitted(true)
		forgotPassword({ email })
	}

	const navitateToRegister = () => history.push("/auth/register")

	// Réinitialiser le formulaire après envoi, et rediriger l'utilisateur
	useEffect(() => {
		if (!state.isLoading && state.data && hasSubmitted) {
			history.push("/auth/forgot-password-sent")
			setEmail("")
		}
	}, [state.isLoading, state.data, hasSubmitted])

	// Reset le `hasSubmitted` lorsque le chargement se termine
	useEffect(() => {
		if (!state.isLoading) setHasSubmitted(false)
	}, [state.isLoading])

	const buttonSize = Platform.web ? "medium" : "large"

	const submitButton = (
		<Button
			text={t("general:buttons.send")}
			onClick={handleSubmit}
			disabled={!canSubmit}
			size={buttonSize}
		/>
	)

	const noAccountLink = (
		<Link action onClick={navitateToRegister}>
			{t("general:noAccount")}
		</Link>
	)

	const noAccountButton = (
		<Button
			tertiary
			text={t("general:noAccount")}
			onClick={navitateToRegister}
			size={buttonSize}
		/>
	)

	const openSessionButton = (
		<Button
			tertiary
			text={t("publicNavbarWeb:openAccount")}
			onClick={() => history.push("/auth/login")}
			size={buttonSize}
		/>
	)

	const forgotPasswordAndSubmitButton = Platform.web ? (
		<Row style={{ alignItems: "center" }}>
			{noAccountLink}
			<Flex />
			{submitButton}
		</Row>
	) : (
		<Column of="group">
			{submitButton}
			{noAccountButton}
			{openSessionButton}
		</Column>
	)

	return (
		<AuthLayout>
			<Column of="group">
				<Heading level="1">{t("passwordIssues:reset")}</Heading>
				<Paragraph>{t("passwordIssues:enterEmail")}</Paragraph>

				<TextField
					label={t("forms:labels.email")}
					label_hint=""
					undertext=""
					onChangeText={setEmail}
					value={email}
				/>

				{errorMessage && <Text error>{errorMessage}</Text>}

				{forgotPasswordAndSubmitButton}
			</Column>
		</AuthLayout>
	)
}

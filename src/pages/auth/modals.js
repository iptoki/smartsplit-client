import React, { useState, useRef } from "react"
import { useTranslation } from "react-i18next"
import { Column, Row, Group, Flex, Hairline } from "../../layout"
import { Heading, Paragraph, Text } from "../../text"
import Button from "../../widgets/button"
import Modal, { DialogModal } from "../../widgets/modal"
import Scrollable from "../../widgets/scrollable"
import Pager from "../../widgets/pager"

import SmartsplitLogo from "../../svg/logo-smartsplit"
import XIcon from "../../svg/x"

import { LoginForm } from "./login"
import { RegisterForm } from "./register"
import { ForgotPasswordForm } from "./forgot-password"
import { Platform } from "react-native"
import { CheckBox } from "../../forms"

export const MODAL_WIDTH = 624

export default function AuthModal(props) {
	const [t] = useTranslation()

	const { visible, onCancel, onSuccess, onRequestClose } = props
	const [tab, setTab] = useState("register")

	const commonProps = {
		showForgotPassword: () => setTab("forgot-password"),
		showLogin: () => setTab("login"),
		showRegister: () => setTab("register"),
		showForgotPasswordSent: () => setTab("forgot-password-sent"),
	}

	const buttonsRegisterPage = (
		<>
			<Text small>{t("publicNavbarWeb:yesAccount")}</Text>
			<Button
				secondary
				small
				bold
				text={t("publicNavbarWeb:openAccount")}
				onClick={commonProps.showLogin}
			/>
			<Button
				tertiary
				small
				icon={<XIcon />}
				onClick={onRequestClose || onCancel}
			/>
		</>
	)

	const buttonsLoginPage = (
		<>
			<Text small>{t("publicNavbarWeb:noMember")}</Text>
			<Button
				secondary
				small
				bold
				text={t("publicNavbarWeb:createMyAccount")}
				onClick={commonProps.showRegister}
			/>
			<Button
				tertiary
				small
				icon={<XIcon />}
				onClick={onRequestClose || onCancel}
			/>
		</>
	)

	return (
		<Modal visible={visible}>
			<Column style={{ maxWidth: MODAL_WIDTH, flex: 1 }}>
				<Row of="component" padding="component" valign="center" size="xlarge">
					<SmartsplitLogo />
					<Flex />
					{tab === "register" ? buttonsRegisterPage : buttonsLoginPage}
				</Row>

				<Hairline />

				<Pager page={tab}>
					<LoginModal
						key="login"
						{...props}
						{...commonProps}
						onSuccess={() => alert(t("general:alerts.connected"))}
					/>
					<RegisterModal
						key="register"
						{...props}
						{...commonProps}
						onSuccess={() => alert(t("general:alerts.subscribed"))}
					/>
					<ForgotPasswordModal
						key="forgot-password"
						{...props}
						{...commonProps}
						onSuccess={() => commonProps.showForgotPasswordSent()}
					/>
					<ForgotPasswordSentModal
						key="forgot-password-sent"
						{...props}
						{...commonProps}
						onSuccess={() => commonProps.showLogin()}
					/>
				</Pager>
			</Column>
		</Modal>
	)
}

export function LoginModal(props) {
	const { artistName, onRequestClose, onCancel, onSuccess } = props
	const [formState, setFormState] = useState({})

	const [t] = useTranslation()

	return (
		<>
			<Scrollable>
				<Column of="group" padding="group">
					<Column of="component">
						<Heading level={2}>
							{artistName || "[artistName]"}, {t("login:toVote.title")}
						</Heading>
						<Paragraph>{t("login:toVote.subTitle")}</Paragraph>
					</Column>

					<LoginForm setFormState={setFormState} {...props} />
				</Column>
			</Scrollable>

			<Hairline />

			<Row of="component" padding="component" align="right">
				<Button
					tertiary
					text={t("general:buttons.cancel")}
					onClick={onCancel || onRequestClose}
				/>
				<Button
					primary
					text={t("general:buttons.connectVote")}
					disabled={!formState.canSubmit}
					onClick={formState.submit}
				/>
			</Row>
		</>
	)
}

export function RegisterModal(props) {
	const { artistName, onRequestClose, onCancel, onSuccess } = props
	const [t] = useTranslation()

	const form = useRef()
	const [canSubmit, setCanSubmit] = useState(false)

	function handleSubmit() {
		form.current.submit()
	}

	return (
		<>
			<Scrollable>
				<Column of="group" padding="group">
					<Column of="component">
						<Heading level={2}>
							{artistName || "[artistName]"}, {t("register:toVote.title")}
						</Heading>
						<Paragraph>{t("register:toVote.subTitle")}</Paragraph>
					</Column>

					<RegisterForm
						{...props}
						onSubmittable={setCanSubmit}
						formRef={form}
					/>
				</Column>
			</Scrollable>

			<Hairline />

			<Row of="component" padding="component" align="right">
				<Button
					tertiary
					text={t("general:buttons.cancel")}
					onClick={onCancel || onRequestClose}
				/>
				<Button
					primary
					text={t("general:buttons.registerVote")}
					disabled={!canSubmit}
					onClick={handleSubmit}
				/>
			</Row>
		</>
	)
}

export function ForgotPasswordModal(props) {
	const [t] = useTranslation()
	const [formState, setFormState] = useState({})

	return (
		<>
			<Scrollable>
				<Column of="group" padding="group">
					<Column of="component">
						<Heading level="3">{t("passwordIssues:reset")}</Heading>
						<Paragraph>{t("passwordIssues:enterEmail")}</Paragraph>
					</Column>

					<ForgotPasswordForm setFormState={setFormState} {...props} />
				</Column>
			</Scrollable>

			<Hairline />

			<Row of="component" padding="component" align="right">
				<Button
					tertiary
					text={t("general:buttons.cancel")}
					onClick={props.onCancel || props.onRequestClose}
				/>
				<Button
					primary
					text={t("general:buttons.send")}
					disabled={!formState.canSubmit}
					onClick={formState.submit}
				/>
			</Row>
		</>
	)
}

export function ForgotPasswordSentModal(props) {
	const [t] = useTranslation()

	return (
		<>
			<Scrollable>
				<Column of="component" padding="group">
					<Heading level="3">{t("passwordIssues:emailSent")}</Heading>
					<Paragraph>{t("passwordIssues:resetParagraph")}</Paragraph>
				</Column>
			</Scrollable>

			<Hairline />

			<Row of="component" padding="component" align="right">
				<Button
					tertiary
					text={t("general:buttons.cancel")}
					onClick={props.onCancel || props.onRequestClose}
				/>
				<Button
					primary
					text={t("general:buttons.comprendo")}
					onClick={props.showLogin}
				/>
			</Row>
		</>
	)
}

export function AuthModalTestPage() {
	return <AuthModal visible={true} />
}

export function DeclareIdentityModal(props) {
	const { t } = useTranslation()
	const [agreeTerms1, setAgreeTerms1] = useState(false)
	const [agreeTerms2, setAgreeTerms2] = useState(false)
	const canSubmit = agreeTerms1 && agreeTerms2

	return (
		<DialogModal
			visible={props.visible}
			onRequestClose={props.onRequestClose}
			title={t("identity:title")}
			buttons={
				<>
					<Button
						text={t("general:buttons.cancel")}
						tertiary
						onClick={props.onRequestClose}
					/>
					<Button
						text={t("general:buttons.toAccept")}
						disabled={!canSubmit}
						onClick={props.onSubmit}
					/>
				</>
			}
		>
			<Group of="component">
				<CheckBox onChange={setAgreeTerms1} checked={agreeTerms1}>
					<Text>{t("identity:Ideclare")(props.firstName, props.lastName)}</Text>
				</CheckBox>

				<CheckBox onChange={setAgreeTerms2} checked={agreeTerms2}>
					<Text>{t("identity:Iaccept")}</Text>
				</CheckBox>
			</Group>
		</DialogModal>
	)
}

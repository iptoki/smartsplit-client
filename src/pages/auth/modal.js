import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Column, Row, Group, Flex, Hairline } from "../../layout"
import { Heading, Paragraph, Text } from "../../text"
import Button from "../../widgets/button"
import Modal from "../../widgets/modal"
import Scrollable from "../../widgets/scrollable"
import Pager from "../../widgets/pager"

import SmartsplitLogo from "../../svg/logo-smartsplit"
import XIcon from "../../svg/x"

import { LoginForm } from "../auth/login"
import { RegisterForm } from "../auth/register"

export const MODAL_WIDTH = 624

export default function AuthModal(props) {
	const [t] = useTranslation()
	
	const { visible, onCancel, onSuccess, onRequestClose } = props
	const [tab, setTab] = useState("register")

	const commonProps = {
		showForgotPassword: () => setTab("forgot-password"),
		showLogin: () => setTab("login"),
		showRegister: () => setTab("register"),
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
				<Button tertiary text={t("general:buttons.cancel")} onClick={onCancel || onRequestClose} />
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
	const [formState, setFormState] = useState({})

	const [t] = useTranslation()

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

					<RegisterForm setFormState={setFormState} {...props} />
				</Column>
			</Scrollable>

			<Hairline />

			<Row of="component" padding="component" align="right">
				<Button tertiary text={t("general:buttons.cancel")} onClick={onCancel || onRequestClose} />
				<Button
					primary
					text={t("general:buttons.registerVote")}
					disabled={!formState.canSubmit}
					onClick={formState.submit}
				/>
			</Row>
		</>
	)
}

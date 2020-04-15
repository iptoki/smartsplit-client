import React, { useState } from "react"
import { TouchableWithoutFeedback } from "react-native"
import { useHistory, useRouteMatch } from "react-router"

import { Group, Hairline, Flex, Row, Column } from "../../layout"
import { Heading, Text } from "../../text"
import { Metrics, Colors } from "../../theme"

import PenIcon from "../../svg/pen"
import UserCardIcon from "../../svg/user-card"
import SettingsIcon from "../../svg/settings"
import LogoutIcon from "../../svg/logout"

export default function MyAccountPage(props) {
	return (
		<Group of="group">
			<Row of="component">
				<Flex>
					<Heading level="2">ArtistName</Heading>
				</Flex>
				<PenIcon />
			</Row>
			<Hairline />

			<AccountItem
				icon={UserCardIcon}
				to="/dashboard/my-profile"
				text="Profil public"
			/>

			<AccountItem
				icon={SettingsIcon}
				// to="/dashboard/settings"
				text="Préférences"
			/>

			<AccountItem icon={LogoutIcon} to="/auth/logout" text="Se déconnecter" />
		</Group>
	)
}

export function AccountItem(props) {
	//pour éviter répétition
	const Icon = props.icon
	const history = useHistory()

	function activate() {
		history.push(props.to)
	}

	return (
		<TouchableWithoutFeedback onPress={activate} accessibilityRole="button">
			<Row of="component">
				<Icon />
				<Text>{props.text}</Text>
			</Row>
		</TouchableWithoutFeedback>
	)
}

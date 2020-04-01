import React from "react"
import { Route, Redirect, Switch } from "react-router"

import { Overlay as GlobalOverlay } from "./portals"
import { Overlay as ScrollOverlay, Scrollable } from "./widgets/scrollable"

import Register       from "./pages/auth/register"
import Login          from "./pages/auth/login"
import Welcome        from "./pages/auth/welcome"
import DashboardPage  from "./pages/dashboard"
import FormsTest      from "./pages/test/forms"
import CopyrightShare from "./pages/document/copyright"

export default function Main(props) {
	return <ScrollOverlay.ProviderContainer>
		<GlobalOverlay.ProviderContainer>
			<MainRouter {...props} />
		</GlobalOverlay.ProviderContainer>
	</ScrollOverlay.ProviderContainer>
}

export function MainRouter(props) {
	return <Switch>
		<Route path="/" exact>
			{/* <Redirect to="/dashboard/" /> */}
			<Redirect to="/auth/login" />
		</Route>
		
		<Route path="/auth/welcome" exact>
			<Welcome />
		</Route>
		
		<Route path="/auth/register" exact>
			<Register />
		</Route>

		<Route path="/auth/login" exact>
			<Login />
		</Route>

		<Route path="/document/copyright" exact>
			<CopyrightShare />
		</Route>

		<Route path="/dashboard/">
			<DashboardPage />
		</Route>

		<Route path="/test/forms" exact>
			<Scrollable>
				<FormsTest />
			</Scrollable>
		</Route>
	</Switch>
}

import * as AuthAPI from "../../api/Auth"
import { saveAuth, clearAuth } from "../../helpers/storageAuth"

export function loginUser_request() {
	return {
		type: "LOGIN_USER_REQUEST",
	}
}

export function loginUser_success(data) {
	return {
		type: "LOGIN_USER_SUCCESS",
		payload: data,
	}
}

export function loginUser_error(err) {
	return {
		type: "LOGIN_USER_ERROR",
		payload: err,
	}
}

export function loginUser(details) {
	return async function (dispatch) {
		dispatch(loginUser_request())

		try {
			const response = await AuthAPI.loginUser(details)

			if (response.data && response.data.accessToken) {
				saveAuth(response.data)
				dispatch(loginUser_success(response.data))
			} else {
				dispatch(loginUser_error(response.data))
			}
		} catch (error) {
			dispatch(loginUser_error(error))
		}
	}
}

export function logoutUser_request() {
	return {
		type: "LOGOUT_USER",
	}
}

export function logoutUser() {
	return function (dispatch) {
		clearAuth().then(() => dispatch(logoutUser_request()))
	}
}
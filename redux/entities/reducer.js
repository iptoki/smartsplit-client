import { entityReducer } from "../api"
const INITIAL_STATE = {
	entityList: {
		data: null,
		type: null,
		error: null,
		isLoading: null
	}

}

export default function (state = INITIAL_STATE, action) {
	let newState = {}
	switch (action.type) {
		case "ENTITY_SETSTATE":
			entityReducer(state, newState, action)
			break

		case "ENTITY_LIST_REQUEST":
			newState.entityList = {
				...state.entityList,
				data: null,
				type: action.payload,
				isLoading: true,
				error: null,
			}
			break

		case "ENTITY_LIST_SUCCESS":
			newState.entityList = {
				...state.entityList,
				data: action.payload,
				error: null,
				isLoading: false,
			}
			action.payload.forEach(entity => {
				newState[entity["_id"]] = {...entity}
			})
			break

		case "ENTITY_LIST_ERROR":
			newState.registerUser = {
				...state.registerUser,
				isLoading: false,
				error: action.payload,
			}
			break

		case "ENTITY_LIST_RESET": {
			newState.entityList = INITIAL_STATE.entityList
			break
		}

		default:
			break
	}
	return { ...state, ...newState }
}
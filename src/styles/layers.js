import { Platform, StyleSheet } from "react-native"
import { Colors, Metrics } from "../theme"

export default StyleSheet.create({
	ground: {
		backgroundColor: Colors.background.ground,
	},

	overground_strong: {
		backgroundColor: Colors.background.ground,
		...Platform.select({
			web: {
				boxShadow: "0px 8px 32px 0px rgba(0, 0, 0, 0.25)",
			},
		}),
	},

	overground_moderate: {
		backgroundColor: Colors.background.ground,
		...Platform.select({
			web: {
				boxShadow: "0px 1px 8px 0px rgba(0, 0, 0, 0.1)",
			},
		}),
	},

	overground_light: {
		backgroundColor: Colors.background.ground,
		...Platform.select({
			web: {
				boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.05)",
			},
		}),
	},

	left_overground: {
		...Platform.select({
			web: {
				boxShadow: `inset 2px 0px 0px ${Colors.stroke}`,
			},
		}),
	},

	underground: {
		backgroundColor: Colors.background.underground,
	},

	hell: {
		backgroundColor: Colors.background.hell,
	},

	underground_reversed: {
		backgroundColor: Colors.background.underground_reversed,
	},

	underground_reversed2: {
		backgroundColor: Colors.background.underground_reversed2,
	},

	modal_background: {
		backgroundColor: "rgba(0, 0, 0, 0.35)",
	},

	modal: {
		backgroundColor: Colors.background.ground,
		borderRadius: Metrics.borderRadius.modals,
		...Platform.select({
			web: {
				boxShadow: "0px 8px 32px 0px rgba(0, 0, 0, 0.25)",
			},
		}),
	},
})

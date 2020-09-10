import React from "react"
import { Svg, Path } from "react-native-svg"
import { Colors } from "../theme"

export default function ReleaseIcon(props) {
	const color = props.color || Colors.action
	const { ...nextProps } = props

	return (
		<Svg
			{...nextProps}
			width="22"
			height="22"
			viewBox="0 0 22 22"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<Path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M11 0C4.92487 0 0 4.92487 0 11C0 17.0751 4.92487 22 11 22C17.0751 22 22 17.0751 22 11C22 4.92487 17.0751 0 11 0ZM15 11C15 13.2091 13.2091 15 11 15C8.79086 15 7 13.2091 7 11C7 8.79086 8.79086 7 11 7C13.2091 7 15 8.79086 15 11ZM15.9581 4.64256C16.3491 4.25254 16.9823 4.25337 17.3723 4.6444C18.995 6.27133 20 8.51925 20 11C20 11.5523 19.5523 12 19 12C18.4477 12 18 11.5523 18 11C18 9.07002 17.2203 7.32409 15.9563 6.05677C15.5662 5.66573 15.5671 5.03257 15.9581 4.64256ZM3 9.99999C3.55228 9.99999 4 10.4477 4 11C4 12.9328 4.78205 14.6811 6.04937 15.9489C6.43983 16.3395 6.43972 16.9726 6.04912 17.3631C5.65853 17.7535 5.02537 17.7534 4.63491 17.3628C3.00799 15.7353 2 13.4844 2 11C2 10.4477 2.44772 9.99999 3 9.99999ZM12 11C12 11.5523 11.5523 12 11 12C10.4477 12 10 11.5523 10 11C10 10.4477 10.4477 10 11 10C11.5523 10 12 10.4477 12 11Z"
				fill={color}
			/>
		</Svg>
	)
}

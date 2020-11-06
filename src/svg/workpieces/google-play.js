import React from "react"
import { Svg, Path } from "react-native-svg"
import { Colors } from "../../theme"

export default function GooglePlayIcon(props) {
	const color = props.color || Colors.tertiary
	const { ...nextProps } = props

	return (
		<Svg
			{...nextProps}
			width="21"
			height="24"
			viewBox="0 0 21 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<Path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M19.6756 10.7354L18.2939 9.95034C18.4441 10.5696 18.5237 11.2162 18.5237 11.8812C18.5237 12.6386 18.4239 13.3839 18.2241 14.0796L19.6756 13.2549C20.9036 12.5643 20.9036 11.439 19.6756 10.7354ZM2.6148 1.0414L7.92515 4.05878C4.58543 5.0906 2.15332 8.20619 2.15332 11.8812C2.15332 15.6588 4.71332 18.8379 8.19362 19.7791L2.6148 22.949C1.88589 23.3713 1.24647 23.3329 0.837203 22.9364C0.568563 22.668 0.402344 22.2331 0.402344 21.6701V2.32039C0.402344 1.7576 0.556 1.3227 0.837203 1.05406C1.23377 0.670338 1.88589 0.631995 2.6148 1.0414ZM15.6142 12.0017C15.6142 14.8269 13.324 17.1174 10.4985 17.1174C7.67308 17.1174 5.38281 14.8269 5.38281 12.0017C5.38281 9.17626 7.67308 6.88599 10.4985 6.88599C13.324 6.88594 15.6142 9.17621 15.6142 12.0017ZM10.4995 9.31597V12.4617C10.3204 12.3597 10.1158 12.2956 9.89835 12.2956C9.23342 12.2956 8.70898 12.8331 8.70898 13.4849C8.70898 14.1503 9.24603 14.6745 9.89835 14.6745C10.5636 14.6745 11.139 14.1371 11.139 13.4849V10.5948H12.2899V9.31592H10.4995V9.31597Z"
				fill={color}
			/>
		</Svg>
	)
}

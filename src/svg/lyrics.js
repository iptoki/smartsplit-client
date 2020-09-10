import React from "react"
import { Svg, Path } from "react-native-svg"
import { Colors } from "../theme"

export default function LyricsIcon(props) {
	const color = props.color || Colors.tertiary

	return (
		<Svg
			width="22"
			height="23"
			viewBox="0 0 22 23"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<Path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M10.0429 3.04293C11.3563 1.72955 13.1376 0.991699 14.995 0.991699C16.8524 0.991699 18.6337 1.72955 19.9471 3.04293C21.2605 4.35631 21.9983 6.13764 21.9983 7.99504C21.9983 9.85208 21.2608 11.6331 19.9479 12.9464L19.9471 12.9471L17.2936 15.6085C17.2409 15.6772 17.1794 15.7388 17.1109 15.7918L13.2082 19.7061C13.0205 19.8943 12.7657 20 12.5 20H4.41418L1.70711 22.7071C1.31658 23.0976 0.683417 23.0976 0.292893 22.7071C-0.0976311 22.3166 -0.0976311 21.6834 0.292893 21.2929L3 18.5858V10.5C3 10.2348 3.10536 9.98047 3.29289 9.79293L10.0429 3.04293ZM16.0731 14L18.5318 11.534L18.5329 11.5329C19.4712 10.5946 19.9983 9.322 19.9983 7.99504C19.9983 6.66807 19.4712 5.39545 18.5329 4.45714C17.5946 3.51884 16.322 2.9917 14.995 2.9917C13.668 2.9917 12.3954 3.51884 11.4571 4.45714L5 10.9142V16.5858L14.2929 7.29289C14.6834 6.90237 15.3166 6.90237 15.7071 7.29289C16.0976 7.68342 16.0976 8.31658 15.7071 8.70711L10.4142 14H16.0731ZM8.41421 16H14.079L12.0849 18H6.41418L8.41421 16Z"
				fill="#2DA84F"
			/>
		</Svg>
	)
}

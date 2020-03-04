import React from "react"
import {Svg, Path} from "react-native-svg"

export default function EyeIcon(props) {
	const { blocked, ...nextProps } = props

	if(blocked)	return <Svg
		width="24" height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...nextProps}
	>
		<Path d="M9.9 4.24002C10.5883 4.0789 11.2931 3.99836 12 4.00003C19 4.00003 23 12 23 12C22.393 13.1356 21.6691 14.2048 20.84 15.19M14.12 14.12C13.8454 14.4148 13.5141 14.6512 13.1462 14.8151C12.7782 14.9791 12.3809 15.0673 11.9781 15.0744C11.5753 15.0815 11.1752 15.0074 10.8016 14.8565C10.4281 14.7056 10.0887 14.4811 9.80385 14.1962C9.51897 13.9113 9.29439 13.572 9.14351 13.1984C8.99262 12.8249 8.91853 12.4247 8.92563 12.0219C8.93274 11.6191 9.02091 11.2219 9.18488 10.8539C9.34884 10.4859 9.58525 10.1547 9.88 9.88003M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 1 12 1 12C2.24389 9.68192 3.96914 7.65663 6.06 6.06003L17.94 17.94Z" stroke="#8DA0B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		<Path d="M1 1L23 23" stroke="#8DA0B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
	</Svg>

	else return <Svg
		width="24" height="24"
		fill="none"
		{...nextProps}
	>
		<Path
			d="M12 15a3 3 0 100-6 3 3 0 000 6z"
			stroke="#8DA0B3"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<Path
			d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
			stroke="#8DA0B3"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</Svg>
}

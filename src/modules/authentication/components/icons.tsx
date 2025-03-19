type TProps = {
	className?: string
}
export function GitHubIcon({ className }: TProps) {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<path
				d="M8 0.5C3.85775 0.5 0.5 3.85775 0.5 8C0.5 11.315 2.64875 14.1275 5.62925 15.1175C6.00425 15.1865 6.14075 14.9547 6.14075 14.756C6.14075 14.5782 6.13475 14.1065 6.131 13.481C4.0445 13.9333 3.60425 12.476 3.60425 12.476C3.26375 11.609 2.77175 11.3795 2.77175 11.3795C2.09075 10.9145 2.8235 10.9235 2.8235 10.9235C3.57575 10.976 3.97175 11.696 3.97175 11.696C4.64075 12.8427 5.7275 12.5113 6.15425 12.32C6.22325 11.8348 6.41675 11.504 6.63125 11.3165C4.96625 11.1268 3.215 10.484 3.215 7.60925C3.215 6.791 3.5075 6.12125 3.98675 5.597C3.9095 5.40725 3.65225 4.6445 4.06025 3.61175C4.06025 3.61175 4.69025 3.41 6.12275 4.3805C6.73457 4.2135 7.3658 4.12826 8 4.127C8.6375 4.13 9.27875 4.2125 9.878 4.379C11.3097 3.4085 11.9382 3.61025 11.9382 3.61025C12.3477 4.643 12.0905 5.40575 12.0132 5.5955C12.4932 6.11975 12.7842 6.7895 12.7842 7.60775C12.7842 10.4893 11.03 11.123 9.35975 11.309C9.629 11.5408 9.86825 11.9982 9.86825 12.698C9.86825 13.7 9.85925 14.5092 9.85925 14.7552C9.85925 14.9555 9.99425 15.1887 10.3752 15.1152C13.3535 14.1252 15.5 11.3135 15.5 8C15.5 3.85775 12.1422 0.5 8 0.5Z"
				fill="white"
			/>
		</svg>
	)
}

export function DiscordIcon({ className }: TProps) {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<path
				d="M8 15.5C3.85775 15.5 0.5 12.1422 0.5 8C0.5 3.85775 3.85775 0.5 8 0.5C12.1422 0.5 15.5 3.85775 15.5 8C15.5 12.1422 12.1422 15.5 8 15.5ZM5 9.5V11H11V9.5H5ZM5 6.5V8H11V6.5H5ZM5 3.5V5H11V3.5H5Z"
				fill="white"
			/>
		</svg>
	)
}

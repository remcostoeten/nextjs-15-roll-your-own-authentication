import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Html,
	Preview,
	Section,
	Tailwind,
	Text
} from '@react-email/components'

type VerifyEmailProps = {
	verificationLink: string
	userName?: string
}

export default function VerifyEmail({
	verificationLink,
	userName
}: VerifyEmailProps) {
	return (
		<Html>
			<Head />
			<Preview>Verify your email address</Preview>
			<Tailwind>
				<Body className="bg-gray-100 my-auto mx-auto font-sans">
					<Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px] bg-white">
						<Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
							<strong>Welcome to Auth System</strong>
						</Heading>
						<Text className="text-black text-[14px] leading-[24px]">
							Hello {userName},
						</Text>
						<Text className="text-black text-[14px] leading-[24px]">
							Please verify your email address by clicking the
							button below:
						</Text>
						<Section className="text-center mt-[32px] mb-[32px]">
							<Button
								className="bg-[#000000] rounded text-white px-5 py-3 font-medium no-underline text-center"
								href={verificationLink}
							>
								Verify Email Address
							</Button>
						</Section>
						<Text className="text-black text-[14px] leading-[24px]">
							or copy and paste this URL into your browser:{' '}
							<a
								href={verificationLink}
								className="text-blue-600 no-underline"
							>
								{verificationLink}
							</a>
						</Text>
						<Text className="text-gray-500 text-[12px] leading-[24px]">
							If you didn't request this email, you can safely
							ignore it.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}

'use client'

import { motion } from 'framer-motion'
import * as React from 'react'
import { containerAnimation } from './animations'

type AuthShellProps = {
	title: string
	subtitle: string
	backgroundImage: string
	children: React.ReactNode
}

function AuthShell({
	title,
	subtitle,
	backgroundImage,
	children
}: AuthShellProps) {
	return (
		<div className="flex flex-wrap  rounded-none min-h-screen">
			<motion.div
				variants={containerAnimation}
				initial="hidden"
				animate="visible"
				className="flex overflow-hidden gap-2.5 justify-center items-center py-36 h-full min-w-[240px] w-[628px] max-md:px-5 max-md:py-24 max-md:max-w-full"
			>
				<div className="flex flex-col flex-1 shrink self-stretch my-auto w-full basis-0 min-w-[240px] max-md:max-w-full">
					<div className="flex flex-col w-full text-center max-md:max-w-full">
						<motion.h1
							variants={containerAnimation}
							className="text-3xl font-medium leading-none text-white max-md:max-w-full"
						>
							{title}
						</motion.h1>
						<motion.p
							variants={containerAnimation}
							className="mt-2 text-base leading-normal text-white text-opacity-80 max-md:max-w-full"
						>
							{subtitle}
						</motion.p>
					</div>
					{children}
				</div>
			</motion.div>
		</div>
	)
}

export default AuthShell

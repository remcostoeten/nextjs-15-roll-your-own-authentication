import { Metadata } from 'next'
import { siteMetadata } from './base-metadata'

export const forumLayoutMetadata: Metadata = {
	...siteMetadata,
	title: {
		template: '%s | RAIOA Forum',
		default: 'RAIOA Forum',
	},
	description: 'Join the RAIOA community discussion',
}

export const forumMetadata: Metadata = {
	...siteMetadata,
	title: 'Forum | RAIOA',
	description: 'Join the RAIOA community discussion',
}

export const createPostMetadata: Metadata = {
	...siteMetadata,
	title: 'Create Post | Forum | RAIOA',
	description: 'Share your thoughts with the RAIOA community',
}

export const editPostMetadata: Metadata = {
	...siteMetadata,
	title: 'Edit Post | Forum | RAIOA',
	description: 'Edit your post in the RAIOA community',
}

export const viewPostMetadata: Metadata = {
	...siteMetadata,
	title: 'View Post | Forum | RAIOA',
	description: 'Join the RAIOA community discussion',
}

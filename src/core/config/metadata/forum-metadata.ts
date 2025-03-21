import { Metadata } from 'next'
import { siteMetadata } from './base-metadata'

export const forumLayoutMetadata: Metadata = {
	...siteMetadata,
	title: {
		template: '%s | RYOA Forum',
		default: 'RYOA Forum',
	},
	description: 'Join the RYOA community discussion',
}

export const forumMetadata: Metadata = {
	...siteMetadata,
	title: 'Forum | RYOA',
	description: 'Join the RYOA community discussion',
}

export const createPostMetadata: Metadata = {
	...siteMetadata,
	title: 'Create Post | Forum | RYOA',
	description: 'Share your thoughts with the RYOA community',
}

export const editPostMetadata: Metadata = {
	...siteMetadata,
	title: 'Edit Post | Forum | RYOA',
	description: 'Edit your post in the RYOA community',
}

export const viewPostMetadata: Metadata = {
	...siteMetadata,
	title: 'View Post | Forum | RYOA',
	description: 'Join the RYOA community discussion',
}

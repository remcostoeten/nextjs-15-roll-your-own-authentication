export type RoadmapStatus = 'planned' | 'in-progress' | 'completed' | 'cancelled'
export type RoadmapPriority = 'low' | 'medium' | 'high' | 'critical'
export type RoadmapCategory = 'feature' | 'improvement' | 'bugfix' | 'security' | 'performance' | 'documentation'
export type UserRole = 'user' | 'admin' | 'contributor'

export interface RoadmapItem {
	id: string
	title: string
	description: string
	status: RoadmapStatus
	priority: RoadmapPriority
	category: RoadmapCategory
	createdAt: string
	updatedAt: string
	createdBy: string
	assignedTo?: string
	dueDate?: string
	votes: number
	comments: RoadmapComment[]
	tags: string[]
}

export interface RoadmapComment {
	id: string
	content: string
	createdAt: string
	createdBy: string
	updatedAt?: string
}

export interface RoadmapLane {
	id: RoadmapStatus
	title: string
	items: RoadmapItem[]
}

export interface RoadmapBoard {
	lanes: RoadmapLane[]
}

export interface RoadmapUser {
	id: string
	name: string
	email: string
	role: UserRole
	avatarUrl?: string
}

import type { Workspace } from '../db/schema'
import type { WorkspaceFormData } from '../validations/models/workspace.z'

export type { Workspace, WorkspaceFormData }

export type WorkspaceFormState = {
	error?: {
		name?: string[]
		description?: string[]
		emoji?: string[]
		_form?: string[]
	}
}

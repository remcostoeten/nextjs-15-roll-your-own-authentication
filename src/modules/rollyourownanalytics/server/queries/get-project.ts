import { desc, eq } from 'drizzle-orm';
import { analyticsDb } from '../db/connection';
import { analyticsProjects } from '../schemas/schema-analytics';

export async function getProject(projectId: string) {
	const project = await analyticsDb
		.select()
		.from(analyticsProjects)
		.where(eq(analyticsProjects.id, projectId))
		.get();

	return project;
}

export async function getProjectByPublicKey(publicKey: string) {
	const project = await analyticsDb
		.select()
		.from(analyticsProjects)
		.where(eq(analyticsProjects.publicKey, publicKey))
		.get();

	return project;
}

export async function getAllProjects() {
	const projects = await analyticsDb
		.select()
		.from(analyticsProjects)
		.orderBy(desc(analyticsProjects.createdAt));

	return projects;
}

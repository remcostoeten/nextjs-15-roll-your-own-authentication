import type { TAnalyticsMetrics, TAnalyticsFilter, TAnalyticsProject } from '../types';

/**
 * Client-side repository for analytics data
 * All methods use API calls to fetch data from the server
 */
export class AnalyticsRepository {
	/**
	 * Get analytics metrics for a project
	 */
	static async getMetrics(
		projectId: string,
		filter: TAnalyticsFilter = {}
	): Promise<TAnalyticsMetrics> {
		const searchParams = new URLSearchParams({
			projectId,
			...Object.fromEntries(
				Object.entries(filter).map(([key, value]) => [key, String(value)])
			),
		});

		const response = await fetch(`/api/analytics/metrics?${searchParams}`);

		if (!response.ok) {
			throw new Error(`Failed to fetch metrics: ${response.status}`);
		}

		return response.json();
	}

	/**
	 * Get project information
	 */
	static async getProject(projectId: string): Promise<TAnalyticsProject | null> {
		const response = await fetch(`/api/analytics/project?projectId=${projectId}`);

		if (!response.ok) {
			if (response.status === 404) {
				return null;
			}
			throw new Error(`Failed to fetch project: ${response.status}`);
		}

		return response.json();
	}

	/**
	 * Get realtime visitor count
	 */
	static async getRealtimeVisitors(projectId: string): Promise<number> {
		const response = await fetch(`/api/analytics/realtime?projectId=${projectId}`);

		if (!response.ok) {
			throw new Error(`Failed to fetch realtime data: ${response.status}`);
		}

		const data = await response.json();
		return data.realtimeVisitors || 0;
	}

	/**
	 * Create a new analytics project
	 */
	static async createProject(data: {
		name: string;
		domain: string;
		settings?: Record<string, any>;
	}): Promise<TAnalyticsProject> {
		const response = await fetch('/api/analytics/project', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			throw new Error(`Failed to create project: ${response.status}`);
		}

		return response.json();
	}

	/**
	 * Update project settings
	 */
	static async updateProject(
		projectId: string,
		data: Partial<TAnalyticsProject>
	): Promise<TAnalyticsProject> {
		const response = await fetch('/api/analytics/project', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ projectId, ...data }),
		});

		if (!response.ok) {
			throw new Error(`Failed to update project: ${response.status}`);
		}

		return response.json();
	}

	/**
	 * Delete a project
	 */
	static async deleteProject(projectId: string): Promise<void> {
		const response = await fetch(`/api/analytics/project?projectId=${projectId}`, {
			method: 'DELETE',
		});

		if (!response.ok) {
			throw new Error(`Failed to delete project: ${response.status}`);
		}
	}
}

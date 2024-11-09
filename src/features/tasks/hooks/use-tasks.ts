'use client'

import { useEffect, useState } from 'react'
import type { Task } from '../db/schema'

export function useTasks() {
	const [tasks, setTasks] = useState<Task[]>([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		async function fetchTasks() {
			try {
				const response = await fetch('/api/tasks', {
					next: { revalidate: 0 } // Opt out of caching
				})
				if (!response.ok) throw new Error('Failed to fetch tasks')
				const data = await response.json()
				setTasks(data)
			} catch (error) {
				console.error('Error fetching tasks:', error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchTasks()
	}, [])

	return { data: tasks, isLoading }
}

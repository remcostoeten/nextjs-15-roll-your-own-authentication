'use client'

import { CodeBlock } from '@/shared/_docs/code-block/code-block'
import { useAdmin } from '@/shared/hooks/use-admin'
import { useLoading } from '@/shared/hooks/use-loading'
import { useUser } from '@/shared/hooks/use-user'
import { AlertCircle, Shield } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

const useUserCode = `
import { useEffect, useState } from 'react'
import { getSession } from '@/features/auth/session'
import { SessionUser } from '@/features/auth/types'

export function useUser() {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSession() {
      const session = await getSession()
      setUser(session)
      setLoading(false)
    }
    fetchSession()
  }, [])

  return { user, loading }
}
`

const useAdminCode = `
import { useUser } from './use-user'

export function useAdmin() {
  const { user, loading } = useUser()
  
  return {
    isAdmin: user?.role === 'admin',
    loading,
    user
  }
}
`

const useLoadingCode = `
import { useState, useCallback } from 'react';

export function useLoading<T>(asyncFunction: () => Promise<T>) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    try {
      const result = await asyncFunction();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [asyncFunction]);

  return { loading, data, error, execute };
}
`

function AdminOnlyContent() {
	const { isAdmin, loading } = useAdmin()

	if (loading) {
		return (
			<div className="h-[200px] w-full animate-pulse bg-neutral-800 rounded-lg" />
		)
	}

	if (!isAdmin) {
		return (
			<div className="border border-red-500/20 rounded-lg overflow-hidden">
				<div className="p-6">
					<h2 className="text-xl font-semibold text-red-500">
						Access Denied
					</h2>
					<p className="text-neutral-400">
						You need administrator privileges to view this content
					</p>
				</div>
			</div>
		)
	}

	return (
		<div className="border border-purple-500/20 bg-purple-500/10 rounded-lg overflow-hidden">
			<div className="p-6">
				<h2 className="text-xl font-semibold flex items-center gap-2">
					<Shield className="h-5 w-5" />
					Admin Dashboard
				</h2>
				<p className="text-neutral-400">
					This content is only visible to administrators
				</p>
			</div>
		</div>
	)
}

type LoadingData = {
	message: string
}

export default function ClientAuthDemo() {
	const { user, loading: userLoading } = useUser()
	const { isAdmin, loading: adminLoading } = useAdmin()

	const fetchDataAsync = async (): Promise<LoadingData> => {
		return new Promise((resolve) => {
			setTimeout(
				() => resolve({ message: 'Data fetched successfully!' }),
				1000
			)
		})
	}

	const {
		loading: dataLoading,
		data,
		error: dataError,
		execute: fetchData
	} = useLoading(fetchDataAsync)

	useEffect(() => {
		fetchData()
	}, [fetchData])

	return (
		<div className="max-w-4xl mx-auto p-6 space-y-8">
			<h1 className="text-3xl font-bold">
				Client-side Authentication Demo
			</h1>

			{/* User Data Section */}
			<div className="border border-neutral-800 rounded-lg p-6 space-y-4">
				<h2 className="text-xl font-semibold">User Data</h2>
				{userLoading ? (
					<p className="text-neutral-400">Loading user data...</p>
				) : user ? (
					<div className="space-y-2">
						<p>
							<span className="font-medium">Email:</span>{' '}
							{user.email}
						</p>
						<p>
							<span className="font-medium">Role:</span>{' '}
							{user.role}
						</p>
						<p>
							<span className="font-medium">User ID:</span>{' '}
							{user.userId}
						</p>
					</div>
				) : (
					<p className="text-neutral-400">Not signed in</p>
				)}
			</div>

			<div
				className={`p-4 rounded-lg border ${
					isAdmin
						? 'bg-neutral-900 border-neutral-800'
						: 'bg-red-500/10 border-red-500/20'
				}`}
			>
				<div className="flex items-center gap-2">
					<AlertCircle className="h-4 w-4" />
					<h3 className="font-medium">Admin Status</h3>
				</div>
				<p className="mt-1 text-neutral-400">
					{adminLoading
						? 'Checking admin status...'
						: isAdmin
							? 'You have admin privileges'
							: 'You do not have admin privileges'}
				</p>
			</div>

			{/* Protected Admin Content */}
			<AdminOnlyContent />

			{/* Example Data Loading */}
			<div className="border border-neutral-800 rounded-lg p-6 space-y-4">
				<h2 className="text-xl font-semibold">Example Data Loading</h2>
				{dataLoading ? (
					<p className="text-neutral-400">Loading data...</p>
				) : dataError ? (
					<p className="text-red-500">Error: {dataError.message}</p>
				) : data ? (
					<p className="text-neutral-300">{data.message}</p>
				) : (
					<p className="text-neutral-400">No data available</p>
				)}
			</div>

			{/* Hook Implementations */}
			<div className="space-y-6">
				<h2 className="text-2xl font-semibold">Hook Implementations</h2>
				<div>
					<h3 className="text-lg font-medium mb-2">useUser Hook</h3>
					<CodeBlock
						code={useUserCode}
						language="typescript"
						fileName="useUser.ts"
						showLineNumbers
						enableLineHighlight
						showMetaInfo
					/>
				</div>
				<div>
					<h3 className="text-lg font-medium mb-2">useAdmin Hook</h3>
					<CodeBlock
						code={useAdminCode}
						language="typescript"
						fileName="useAdmin.ts"
						showLineNumbers
						enableLineHighlight
						showMetaInfo
					/>
				</div>
				<div>
					<h3 className="text-lg font-medium mb-2">
						useLoading Hook
					</h3>
					<CodeBlock
						code={useLoadingCode}
						language="typescript"
						fileName="useLoading.ts"
						showLineNumbers
						enableLineHighlight
						showMetaInfo
					/>
				</div>
			</div>

			<div className="text-center">
				<Link
					href="/dashboard/server"
					className="text-blue-500 hover:underline"
				>
					View Server-side Example
				</Link>
			</div>
		</div>
	)
}

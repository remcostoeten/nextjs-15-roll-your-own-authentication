'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'

type FormData = {
    title: string
    description: string
    status: 'planned' | 'in-progress' | 'completed'
    priority: number
    quarter: string
}

const initialFormData: FormData = {
    title: '',
    description: '',
    status: 'planned',
    priority: 0,
    quarter: ''
}

export default function AdminRoadmapPage() {
    const router = useRouter()
    const [formData, setFormData] = useState<FormData>(initialFormData)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)

        try {
            const response = await fetch('/api/admin/roadmap', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                const error = await response.text()
                throw new Error(error)
            }

            setSuccess('Roadmap item added successfully!')
            setFormData(initialFormData)
            router.refresh()
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to add roadmap item')
        }
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Add Roadmap Item</h1>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            
            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
                <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <Select
                        value={formData.status}
                        onValueChange={(value: 'planned' | 'in-progress' | 'completed') => 
                            setFormData({ ...formData, status: value })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="planned">Planned</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Priority</label>
                    <Input
                        type="number"
                        min="0"
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Quarter</label>
                    <Input
                        placeholder="e.g., Q2 2024"
                        value={formData.quarter}
                        onChange={(e) => setFormData({ ...formData, quarter: e.target.value })}
                        required
                    />
                </div>

                <Button type="submit">Add Roadmap Item</Button>
            </form>
        </div>
    )
} 
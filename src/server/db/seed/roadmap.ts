import { db } from '@/server/db'
import { roadmapItems } from '@/server/db/schemas/roadmap.schema'

type RoadmapStatus = 'planned' | 'in-progress' | 'completed'

interface RoadmapItem {
  title: string
  description: string
  status: RoadmapStatus
  priority: number
  quarter: string
  votes: number
  createdAt: string
  updatedAt: string
}

export async function seedRoadmap() {
  const items: RoadmapItem[] = [
    {
      title: 'OAuth Integration',
      description: 'Add support for major OAuth providers (Google, GitHub, Discord)',
      status: 'in-progress',
      priority: 1,
      quarter: 'Q2 2024',
      votes: 25,
      createdAt: '2024-03-01T00:00:00.000Z',
      updatedAt: '2024-03-01T00:00:00.000Z',
    },
    {
      title: 'Advanced Rate Limiting',
      description: 'Implement adaptive rate limiting with Redis and custom algorithms',
      status: 'planned',
      priority: 2,
      quarter: 'Q2 2024',
      votes: 18,
      createdAt: '2024-03-01T00:00:00.000Z',
      updatedAt: '2024-03-01T00:00:00.000Z',
    },
    {
      title: 'WebAuthn Support',
      description: 'Add support for passwordless authentication using WebAuthn',
      status: 'planned',
      priority: 3,
      quarter: 'Q3 2024',
      votes: 15,
      createdAt: '2024-03-01T00:00:00.000Z',
      updatedAt: '2024-03-01T00:00:00.000Z',
    },
    {
      title: 'Enhanced Session Management',
      description: 'Implement advanced session tracking and device management',
      status: 'planned',
      priority: 4,
      quarter: 'Q3 2024',
      votes: 12,
      createdAt: '2024-03-01T00:00:00.000Z',
      updatedAt: '2024-03-01T00:00:00.000Z',
    },
    {
      title: 'Security Dashboard',
      description: 'Add a comprehensive security dashboard for monitoring auth events',
      status: 'planned',
      priority: 5,
      quarter: 'Q4 2024',
      votes: 20,
      createdAt: '2024-03-01T00:00:00.000Z',
      updatedAt: '2024-03-01T00:00:00.000Z',
    },
  ]

  for (const item of items) {
    try {
      await db.insert(roadmapItems).values(item)
    } catch (error) {
      console.error(`❌ Error seeding roadmap item:`, error)
    }
  }
  
  console.log('✅ Roadmap items seeded successfully')
} 
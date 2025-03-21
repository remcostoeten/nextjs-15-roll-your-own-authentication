import { db } from './index'
import { changelogItems } from './schemas/changelog.schema'
import { roadmapItems } from './schemas/roadmap.schema'

async function seed() {
    try {
        // Seed Changelog Items
        await db.insert(changelogItems).values([
            {
                version: "1.0.0",
                title: "Initial Release",
                description: "First stable release of Roll Your Own Auth",
                date: new Date("2024-03-01"),
                features: JSON.stringify([
                    "Custom JWT implementation with jose",
                    "Session management system",
                    "Role-based access control",
                    "Password hashing with Argon2"
                ]),
                improvements: JSON.stringify([]),
                bugfixes: JSON.stringify([]),
                votes: 15
            },
            {
                version: "1.1.0",
                title: "Enhanced Security Features",
                description: "Major security enhancements and performance improvements",
                date: new Date("2024-03-15"),
                features: JSON.stringify([
                    "Two-factor authentication",
                    "Rate limiting implementation",
                    "Custom caching layer"
                ]),
                improvements: JSON.stringify([
                    "Optimized database queries",
                    "Reduced JWT token size",
                    "Improved error handling"
                ]),
                bugfixes: JSON.stringify([
                    "Fixed session persistence issue",
                    "Resolved token refresh bug"
                ]),
                votes: 8
            },
            {
                version: "1.1.1",
                title: "Bug Fixes & Performance",
                description: "Critical bug fixes and performance optimizations",
                date: new Date("2024-03-20"),
                features: JSON.stringify([]),
                improvements: JSON.stringify([
                    "Improved login response time",
                    "Better error messages"
                ]),
                bugfixes: JSON.stringify([
                    "Fixed memory leak in session store",
                    "Resolved race condition in token refresh",
                    "Fixed CORS configuration issues"
                ]),
                votes: 5
            }
        ])

        // Seed Roadmap Items
        await db.insert(roadmapItems).values([
            {
                title: "OAuth Integration",
                description: "Add support for major OAuth providers (Google, GitHub, Discord)",
                status: "in-progress",
                priority: 1,
                quarter: "Q2 2024",
                votes: 25,
                createdAt: new Date("2024-03-01"),
                updatedAt: new Date("2024-03-01")
            },
            {
                title: "Advanced Rate Limiting",
                description: "Implement adaptive rate limiting with Redis and custom algorithms",
                status: "planned",
                priority: 2,
                quarter: "Q2 2024",
                votes: 18,
                createdAt: new Date("2024-03-01"),
                updatedAt: new Date("2024-03-01")
            },
            {
                title: "WebAuthn Support",
                description: "Add support for passwordless authentication using WebAuthn",
                status: "planned",
                priority: 3,
                quarter: "Q3 2024",
                votes: 15,
                createdAt: new Date("2024-03-01"),
                updatedAt: new Date("2024-03-01")
            },
            {
                title: "Enhanced Session Management",
                description: "Implement advanced session tracking and device management",
                status: "planned",
                priority: 4,
                quarter: "Q3 2024",
                votes: 12,
                createdAt: new Date("2024-03-01"),
                updatedAt: new Date("2024-03-01")
            },
            {
                title: "Security Dashboard",
                description: "Add a comprehensive security dashboard for monitoring auth events",
                status: "planned",
                priority: 5,
                quarter: "Q4 2024",
                votes: 20,
                createdAt: new Date("2024-03-01"),
                updatedAt: new Date("2024-03-01")
            }
        ])

        console.log("✅ Seed data inserted successfully")
    } catch (error) {
        console.error("❌ Error seeding data:", error)
        throw error
    }
}

seed().catch((error) => {
    console.error("Failed to seed database:", error)
    process.exit(1)
}) 
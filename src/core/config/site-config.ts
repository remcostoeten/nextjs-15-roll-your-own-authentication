interface SocialMedia {
    platform: string
    url: string
    handle?: string
}

interface Navigation {
    name: string
    path: string
    children?: Omit<Navigation, 'children'>[]
}

export const siteConfig = {
    name: 'RYOA',
    description: 'Next.js application with custom-rolled architecture',

    // URLs
    url: {
        base: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
        production: 'https://ryoa.remcostoeten.com',
    },

    // Social media
    socialMedia: [
        {
            platform: 'GitHub',
            url: 'https://github.com/remcostoeten/ryoa',
            handle: '@remcostoeten',
        },
        {
            platform: 'Twitter',
            url: 'https://twitter.com/yowremco',
            handle: '@yowremco',
        },
    ] as SocialMedia[],
} 
interface Tool {
  title: string
  description: string
  href: string
  tag?: {
    text: string
    type: "new" | "soon"
  }
  isLarge?: boolean
}

interface MatrixGridContent {
  header: {
    title: string
    subtitle: string
  }
  tools: Tool[]
}

export const matrixGridContent: MatrixGridContent = {
  header: {
    title: "Build secure authentication without dependencies.",
    subtitle: "Because real developers don't need training wheels. Or the weekly breaking changes from auth libraries.",
  },
  tools: [
    {
      title: "RollYourOwnAuth",
      description:
        "Imagine telling others you roll your own auth while everyone else debugs their Clerk webhooks. You'd be the talk of the evening. Just wait until you mention vim and Arch Linux.",
      href: "/rollyourownauth",
      tag: { text: "New", type: "new" },
      isLarge: true,
    },
    {
      title: "Session Management",
      description:
        "Implement secure session handling with SQLite/Postgres. No dependencies needed. No more 'Sorry we changed our API again' blog posts.",
      href: "/sessions",
    },
    {
      title: "OAuth2 Implementation",
      description:
        "Build your own OAuth2 flow from scratch. Because you can. And because you're tired of NextAuth's cryptic error messages.",
      href: "/oauth2",
    },
    {
      title: "JWT Tokens",
      description:
        "Create and validate JWTs without external libraries. Pure crypto. No more 'This package is 3 years out of date but we still depend on it'.",
      href: "/jwt",
      // Removed the "soon" tag
    },
    {
      title: "User Management",
      description:
        "Complete CRUD operations for user administration. Zero dependencies. Zero 'Please upgrade to our premium plan for basic features'.",
      href: "/user-management",
    },
    {
      title: "Role-Based Access",
      description:
        "Implement RBAC with protected routes and content. Pure Next.js. No more 'Sorry, we changed our pricing model again' emails.",
      href: "/rbac",
      tag: { text: "Soon", type: "soon" },
    },
    {
      title: "Feature Flags",
      description:
        "Build a feature flag system from scratch. Because why not? It's probably more reliable than waiting for Clerk's dashboard to load.",
      href: "/feature-flags",
      tag: { text: "Soon", type: "soon" },
    },
  ],
}


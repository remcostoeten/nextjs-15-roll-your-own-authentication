export interface IOAuthProvider {
  id: string
  name: string
  icon: string
  color: string
}

export function getOAuthProviders() {
  // Main providers (always shown)
  const mainProviders: IOAuthProvider[] = [
    {
      id: "github",
      name: "GitHub",
      icon: "github",
      color: "#24292e",
    },
    {
      id: "google",
      name: "Google",
      icon: "google",
      color: "#4285F4",
    },
  ]

  // Additional providers (shown in dropdown)
  const additionalProviders: IOAuthProvider[] = [
    {
      id: "discord",
      name: "Discord",
      icon: "discord",
      color: "#5865F2",
    },
  ]

  // In client components, we can't check environment variables directly
  // So we'll just return all providers and let the server handle availability
  return {
    mainProviders,
    additionalProviders,
  }
}


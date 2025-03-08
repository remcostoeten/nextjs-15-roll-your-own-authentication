---
title: Core Configuration
description: Central configuration for fonts, metadata, and site-wide settings
---

# Core Configuration

This directory contains core configuration settings for the application, making these values reusable and centrally managed.

## Available Configurations

### Fonts (`fonts.ts`)

Defines and exports the font configurations used throughout the application:

```typescript
import { fontVariables, geistSans, geistMono } from '@/core/config'
```

- `geistSans`: The Geist Sans font configuration
- `geistMono`: The Geist Mono font configuration
- `fontVariables`: A ready-to-use string containing all font variables for the className prop

### Metadata (`metadata.ts`)

Contains the application's metadata configuration for SEO and sharing:

```typescript
import { siteMetadata } from '@/core/config'
```

The `siteMetadata` object conforms to Next.js's Metadata type and can be directly used in your layout files.

### Site Configuration (`site-config.ts`)

Contains global application settings and content:

```typescript
import { siteConfig } from '@/core/config'
```

The `siteConfig` object includes:

- Site name and description
- URLs (base, production)
- Contact information
- Social media links
- Analytics configuration
- Feature flags
- Navigation structure

## Usage

Import configurations from the index file:

```typescript
import { fontVariables, siteMetadata, siteConfig } from '@/core/config'
```

### In layout files:

```typescript
export const metadata = siteMetadata

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body className={fontVariables}>
        {children}
      </body>
    </html>
  )
}
```

### Using site configuration:

```typescript
import { siteConfig } from '@/core/config'

export function Footer() {
  return (
    <footer>
      <p>© {new Date().getFullYear()} {siteConfig.name}</p>
      <div>
        {siteConfig.socialMedia.map(social => (
          <a key={social.platform} href={social.url}>
            {social.platform}
          </a>
        ))}
      </div>
    </footer>
  )
}
```

## Extending

To add more configuration categories:

1. Create a new file in this directory (e.g., `theme.ts`)
2. Export your configuration
3. Update the `index.ts` file to re-export your new configuration 
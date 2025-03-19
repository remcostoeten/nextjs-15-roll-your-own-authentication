## Case Sensitivity and Component Exports

When using barrel files, it's important to ensure the correct casing of exports:

### Case Sensitivity

TypeScript is case-sensitive, which means these are different:

```typescript
// Component file exports:
export const JSONViewer = () => {
	/* ... */
}

// In barrel file:
export { JsonViewer } from './json-viewer' // Wrong! Notice the casing difference
export { JSONViewer } from './json-viewer' // Correct
```

### Multiple Exports

UI components often export multiple items:

```typescript
// dropdown-menu.tsx
export {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	// ... many more exports
}

// Barrel file needs to include ALL exports
export { DropdownMenu, DropdownMenuTrigger /* etc */ } from './dropdown-menu'
```

### Fixing Case Sensitivity Issues

1. **Use the Advanced Barrel Generator**: Our custom generator tries to extract actual exports from components
2. **Manual Overrides**: For special cases, modify `tools/advanced-barrel-generator.js` to handle specific components
3. **ESLint Help**: The `import/named` rule will catch incorrect export names

For example, if you see an error like:

```
export { JsonViewer } from './json-viewer';
       ^^^^^^^^^^^ '"./json-viewer"' has no exported member named 'JsonViewer'. Did you mean 'JSONViewer'?
```

This indicates a case mismatch between the barrel export and the component's actual export.

## Export Exclusions

Our barrel generator automatically excludes certain types of exports:

1. **Props interfaces** - Types ending with `Props` (e.g., `ButtonProps`, `InputProps`)
2. **Variant utilities** - Utility functions with names ending in `Variants` (e.g., `buttonVariants`, `badgeVariants`)

These exclusions help keep barrel files focused on component exports rather than implementation details. If you need to import these types or utilities, import them directly from the component file:

```typescript
// Don't import Props from barrel files
import { Button } from '@/shared/components/ui'
import { ButtonProps } from '@/shared/components/ui/button'
```

### Customizing Exclusions

You can customize which exports are excluded by modifying the `EXCLUDE_PATTERNS` array in `tools/advanced-barrel-generator.js`:

```javascript
const EXCLUDE_PATTERNS = [
	/Props$/, // Skip component props interfaces
	/[a-z]Variants$/, // Skip variant utilities like badgeVariants
	// Add your own patterns here
]
```

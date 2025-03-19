# Demo Modules - Performance-Optimized Barrel Files

This folder structure demonstrates how to create barrel files (index.ts) without the typical performance drawbacks.

## The Problem with Barrel Files

Traditional barrel files often lead to performance issues because:

1. **Tree-shaking breaks**: When using `export * from './module'`, bundlers may include the entire module even if you only need one component.
2. **Circular dependencies**: Complex barrel files can create circular dependencies.
3. **Poor code-splitting**: Bundlers may struggle to effectively split code when using wildcard exports.

## Our Solution: Explicit Named Exports

This project uses explicit named exports in barrel files:

```typescript
// GOOD - Explicit exports (used in this project)
export { ComponentA } from './components/component-a';
export { ComponentB } from './components/component-b';
export type { TypeA } from './types';

// BAD - Avoid wildcard exports
export * from './components';
export * from './helpers';
```

## Benefits of This Approach

1. **Effective tree-shaking**: Bundlers can properly analyze which exports are actually used.
2. **Better code-splitting**: Bundlers can create smaller, more optimized chunks.
3. **Clear dependencies**: Explicit imports make it easier to understand what's being used.
4. **Improved performance**: Reduced bundle sizes for pages that only use specific components.

## Usage Example

```typescript
// Import specific components - bundler will only include what you use
import { ColorCard, ColorsGrid } from '@/modules/(demos)';

// Component-level imports still work if you prefer
import { ColorCard } from '@/modules/(demos)/colors/components/color-card';
```

## Structure

- `src/modules/(demos)/index.ts`: Main barrel file with all named exports
- `src/modules/(demos)/colors/index.ts`: Module-specific barrel file with named exports

## Performance Recommendations

1. Always use named exports in barrel files
2. Avoid wildcard exports (`export * from...`)
3. Keep barrel files flat and avoid nesting them
4. When importing, only import what you need
5. For very large modules, consider direct imports instead of going through barrel files 
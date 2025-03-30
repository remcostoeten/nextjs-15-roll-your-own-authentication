# Optimized Barrel Files Tooling

This directory contains tools for managing optimized barrel files in the project.

## Available Tools

### 1. Advanced Barrel Generator (`advanced-barrel-generator.js`)

Automatically generates optimized barrel files by extracting actual exports from components:

```bash
# Generate barrel files for the entire project
npm run barrels

# Generate barrel files for a specific directory
npm run barrels:src

# Watch for changes and automatically generate barrel files
npm run barrels:watch
```

#### Export Exclusions

The barrel generator automatically excludes certain types of exports:

- **Props interfaces** - Types ending with `Props` (e.g., `ButtonProps`)
- **Variant utilities** - Functions ending with `Variants` (e.g., `buttonVariants`)

This keeps barrel files focused on component exports rather than implementation details.

### 2. Barrel File Fixer (`fix-barrel.js`)

Fixes specific barrel files with known case sensitivity issues:

```bash
# Fix a specific barrel file
npm run fix-barrel src/path/to/index.ts
```

## Configuration

### ESLint Rules

The project includes ESLint rules to enforce good barrel file practices:

```javascript
// In .eslintrc.js
rules: {
  'import/no-namespace': 'error', // Prevents wildcard imports/exports
  'import/named': 'error', // Verifies named imports correspond to named exports
  'import/no-cycle': ['error', { maxDepth: 1 }], // Prevents circular dependencies
  'import/no-self-import': 'error', // Prevents module from importing itself
}
```

### VS Code Tasks

VS Code tasks are available for barrel file generation:

- **Generate Barrel Files**: Run manually to generate all barrel files
- **Watch & Generate Barrel Files**: Start the watch process for ongoing development

## Documentation

For more information, see:

- [Barrel Files Guide](../docs/barrel-files.md) - General information about barrel files and best practices
- [Barrel Files Setup](../docs/barrel-files-setup.md) - Step-by-step setup guide

## Contributing

When adding new tools or enhancing existing ones:

1. Keep tools focused on specific tasks
2. Maintain backward compatibility
3. Update documentation and package.json scripts
4. Add special cases to `fix-barrel.js` as needed

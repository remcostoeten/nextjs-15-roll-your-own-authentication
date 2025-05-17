# CLI Commands

This directory contains all CLI commands for the application. Each command is organized in its own directory with its related files and dependencies.

## Available Commands

### `scaffold`
Creates new features with a standardized structure.

```bash
npm run scaffold
```
- Creates views in `src/views/`
- Optionally creates module structure with selected folders:
  - components
  - hooks
  - api (queries, mutations, schemas, models)
  - types.ts
- Optionally creates a page with proper metadata

### `create-metadata`
Generates metadata files for views, layouts, or pages.

```bash
npm run create-metadata
```
- Creates metadata files in `src/core/config/metadata/`
- Supports different types (view, layout, page)
- Uses the base metadata configuration
- Automatically generates title and description

### `generate-docs`
Generates documentation using JSDoc.

```bash
npm run generate-docs
```
- Generates documentation for TypeScript/TSX files
- Excludes test files
- Uses better-docs template
- Output directory: `docs/`

## Directory Structure
```
commands/
├── scaffold/              # Feature scaffolding
│   ├── index.ts          # Main implementation
│   └── package.json      # Dependencies
├── create-metadata/      # Metadata generation
│   ├── index.ts
│   └── package.json
└── generate-docs/        # Documentation generation
    ├── index.ts
    └── package.json
```

## Adding New Commands

1. Create a new directory for your command
2. Create an `index.ts` with the command implementation
3. Add a `package.json` with necessary dependencies
4. Update the root `package.json` scripts section
5. Document the command in this README

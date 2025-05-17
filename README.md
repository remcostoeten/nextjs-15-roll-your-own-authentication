# Next.js Custom Authentication with Enterprise Architecture

A Next.js 15 project with custom authentication, following enterprise-level architecture patterns.

## Project Structure

```
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── core/               # Core application logic
│   │   ├── config/         # Configuration files
│   │   │   └── metadata/   # Metadata configurations
│   │   ├── types/         # Global TypeScript types
│   │   └── utils/         # Shared utilities
│   ├── modules/           # Feature-specific modules
│   │   └── [module]/      # Each module can contain:
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── api/
│   │       │   ├── queries/
│   │       │   ├── mutations/
│   │       │   ├── schemas/
│   │       │   └── models/
│   │       └── types.ts
│   └── views/             # Page-specific view components
│       └── [feature]-view/
├── commands/             # CLI commands for development
│   ├── scaffold/         # Feature scaffolding
│   ├── create-metadata/  # Metadata file generation
│   └── generate-docs/    # Documentation generation
├── __tests__/           # Test files matching src/ structure
│   └── core/
│       └── utils/
└── public/              # Static files
```

## Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run linter
npm run lint:fix     # Fix linting issues
npm run format       # Format code

# Testing
npm run test         # Run tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report

# Development Tools
npm run scaffold         # Scaffold new features
npm run create-metadata # Create metadata files
npm run generate-docs   # Generate documentation
```

## Architecture Decisions

- **Modular Structure**: Features are organized in modules with their own components, hooks, and API logic
- **View Pattern**: Pages delegate to view components for better separation of concerns
- **Metadata Management**: Centralized metadata configuration with per-view overrides
- **Testing**: Tests are colocated with source files in a parallel `__tests__` structure
- **CLI Tools**: Custom commands for scaffolding and development tasks

## Learn More

- [Commands Documentation](./commands/README.md)
- [API Documentation](./docs/index.html)

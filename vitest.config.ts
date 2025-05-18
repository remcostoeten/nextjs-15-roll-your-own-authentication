import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
  },
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      '@': '/src',
      'core': '/src/core',
      'components': '/src/components',
      'views': '/src/views',
      'shared': '/src/shared',
      'ui': '/src/shared/components/ui/index.ts',
      'utilities': '/src/shared/utilities/index.ts',
      'env': '/src/api/env.ts',
      'schema': '/src/api/db/schema.ts',
      'db': '/src/api/db/connection.ts',
      'modules': '/src/modules'
    }
  }
})

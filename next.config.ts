/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // ... other Next.js configurations
  // Example: Using an env var in the build config (ensure it's available!)
  // env: {
  //   NEXT_PUBLIC_SOME_VAR: env.SOME_PUBLIC_VAR, // Only use vars intended for client
  // },
  experimental: {
    reactCompiler: true,   
    viewTransition: true,
  },

  // Add other configurations specific to your project below
  // For example:
  // images: {
  //   domains: ['example.com'],
  // },
  // experimental: {
  //   appDir: true, // If using the App Router
  // },
};

module.exports = nextConfig;

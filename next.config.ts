import type { NextConfig } from 'next';

// Static export for GitHub Pages. NEXT_BASE_PATH is set in CI to "/<repo-name>".
const basePath = process.env.NEXT_BASE_PATH || '';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  // Exposed so full-page navigations (location.href) can include the base path.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};
export default nextConfig;

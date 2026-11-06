import type { NextConfig } from 'next';

// Static export for GitHub Pages. NEXT_BASE_PATH is set in CI to "/<repo-name>".
const basePath = process.env.NEXT_BASE_PATH || '';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
};
export default nextConfig;

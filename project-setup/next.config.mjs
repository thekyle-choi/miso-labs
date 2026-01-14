/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 정적 파일 최적화
  images: {
    unoptimized: true,
  },
  // 빌드 최적화
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-dialog'],
  },
};

export default nextConfig;

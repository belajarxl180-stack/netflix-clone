/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
      },
    ],
  },
  productionBrowserSourceMaps: false,
  turbopack: {},
  webpack: (config: any, { dev }: any) => {
    if (dev) {
      config.devtool = 'cheap-module-source-map';
    }
    return config;
  },
};

export default nextConfig;

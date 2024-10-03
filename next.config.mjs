/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3005",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "api.explore.ebslonserver3.com",
        pathname: "/uploads/**",
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;

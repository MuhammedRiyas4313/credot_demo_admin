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
        hostname: "credot-demo-backend.onrender.com",
        pathname: "/uploads/**",
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "https://wegood4u.com/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

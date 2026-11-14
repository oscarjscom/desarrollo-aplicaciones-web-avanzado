import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  devIndicators: false,
  images: {
    // Foto de perfil de Google
    remotePatterns: [{ protocol: "https", hostname: "lh3.googleusercontent.com" }],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

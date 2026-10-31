import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No generar AGENTS.md automáticamente al correr `next dev`
  agentRules: false,
};

export default nextConfig;

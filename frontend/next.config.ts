import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // next dev blocks its own dev assets for unknown hosts, which silently kills hydration.
  // shortcut: the LAN IP is hardcoded; update it when DHCP hands out a different one.
  allowedDevOrigins: ["127.0.0.1", "192.168.15.46"],
  cacheComponents: true,
  partialPrefetching: true,
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

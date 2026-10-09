import type { NextConfig } from "next";

const config: NextConfig = {
  transpilePackages: ["@travel/types", "@travel/utils", "@travel/validation"],
  images: { remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }] },
};
export default config;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product photos uploaded through the Stripe dashboard are served from files.stripe.com
    remotePatterns: [{ protocol: "https", hostname: "files.stripe.com" }],
  },
  async redirects() {
    return [{ source: "/sold", destination: "/archive", permanent: true }];
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

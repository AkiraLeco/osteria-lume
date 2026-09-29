import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // O layout raiz fica em app/[lang], então a página 404 precisa ser global (app/global-not-found.tsx).
    globalNotFound: true,
  },
};

export default nextConfig;

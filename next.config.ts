import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next.js gera formatos modernos quando o navegador os aceita.
    // GIFs animados continuam no formato original e precisam de tratamento separado.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;

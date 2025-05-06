import { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // output: "export", // Removido para permitir rotas de API dinâmicas
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // A otimização de imagens pode ser mantida ou removida dependendo da preferência.
  // Se o objetivo é deploy em Vercel/Netlify, a otimização padrão do Next.js é geralmente boa.
  // images: {
  //   unoptimized: true,
  // }
};

export default nextConfig;


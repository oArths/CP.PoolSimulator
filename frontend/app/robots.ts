import type { MetadataRoute } from "next";

// Tudo aberto, incluindo os rastreadores de IA (busca e resposta em chat).
const CRAWLERS_IA = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "PerplexityBot",
  "Google-Extended",
  "Bingbot",
  "Applebot-Extended",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: CRAWLERS_IA, allow: "/" },
    ],
  };
}

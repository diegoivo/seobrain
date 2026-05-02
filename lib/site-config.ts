export const siteConfig = {
  name: "Agentic SEO Kit",
  description:
    "Site exemplo do agentic-seo-kit — SEO Agêntico em PT-BR, PageSpeed 100, conteúdo opinionado.",
  url: "https://example.com",
  author: {
    name: "Seu Nome",
    url: "https://example.com",
  },
  ogImage: "/og-default.png",
  social: {
    linkedin: "",
    github: "",
  },
} as const;

export type SiteConfig = typeof siteConfig;

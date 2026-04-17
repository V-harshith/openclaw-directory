import { useEffect } from "react";

interface SEOOptions {
  title: string;
  description?: string;
  canonical?: string;
  image?: string;
}

const DEFAULT_OG_IMAGE = "https://openclaw.io/og-image.jpg";

function setMeta(selector: string, attr: string, value: string, create?: { name?: string; property?: string }) {
  let el = document.querySelector(selector);
  if (!el && create) {
    el = document.createElement("meta");
    if (create.name) el.setAttribute("name", create.name);
    if (create.property) el.setAttribute("property", create.property);
    document.head.appendChild(el);
  }
  el?.setAttribute(attr, value);
}

export function useSEO({ title, description, canonical, image }: SEOOptions) {
  useEffect(() => {
    document.title = title;

    if (description) {
      setMeta('meta[name="description"]', "content", description, { name: "description" });
      setMeta('meta[property="og:description"]', "content", description, { property: "og:description" });
      setMeta('meta[name="twitter:description"]', "content", description, { name: "twitter:description" });
    }

    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonical);
      setMeta('meta[property="og:url"]', "content", canonical, { property: "og:url" });
    }

    setMeta('meta[property="og:title"]', "content", title, { property: "og:title" });
    setMeta('meta[name="twitter:title"]', "content", title, { name: "twitter:title" });

    const ogImage = image || DEFAULT_OG_IMAGE;
    setMeta('meta[property="og:image"]', "content", ogImage, { property: "og:image" });
    setMeta('meta[name="twitter:image"]', "content", ogImage, { name: "twitter:image" });

    return () => {
      document.title = "OpenClaw — AI MCP Servers, Skills, Plugins & Jobs Directory";
    };
  }, [title, description, canonical, image]);
}

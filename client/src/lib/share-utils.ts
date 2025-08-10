import { SOCIAL_PLATFORMS } from "./constants";
import type { Product } from "@shared/schema";

export function shareProduct(product: Product, platform: keyof typeof SOCIAL_PLATFORMS) {
  const baseUrl = window.location.origin;
  const productUrl = `${baseUrl}/?product=${product.id}`;
  const text = `¡Mira este increíble diseño! ${product.name} - ${product.description}`;
  
  const platformConfig = SOCIAL_PLATFORMS[platform];
  let shareUrl = "";

  switch (platform) {
    case "whatsapp":
      shareUrl = `${platformConfig.baseUrl}${encodeURIComponent(`${text} ${productUrl}`)}`;
      break;
    case "facebook":
      shareUrl = `${platformConfig.baseUrl}${encodeURIComponent(productUrl)}`;
      break;
    case "telegram":
      shareUrl = `${platformConfig.baseUrl}${encodeURIComponent(productUrl)}&text=${encodeURIComponent(text)}`;
      break;
    case "email":
      shareUrl = `${platformConfig.baseUrl}${encodeURIComponent(`${text}\n\nVer diseño: ${productUrl}`)}`;
      break;
  }

  window.open(shareUrl, "_blank", "noopener,noreferrer");
}

export function shareMultipleProducts(products: Product[], platform: keyof typeof SOCIAL_PLATFORMS) {
  const baseUrl = window.location.origin;
  const text = `¡Mira esta selección de ${products.length} diseños increíbles!\n\n${products.map(p => `• ${p.name}`).join('\n')}`;
  
  const platformConfig = SOCIAL_PLATFORMS[platform];
  let shareUrl = "";

  switch (platform) {
    case "whatsapp":
      shareUrl = `${platformConfig.baseUrl}${encodeURIComponent(`${text}\n\nVer catálogo: ${baseUrl}`)}`;
      break;
    case "facebook":
      shareUrl = `${platformConfig.baseUrl}${encodeURIComponent(baseUrl)}`;
      break;
    case "telegram":
      shareUrl = `${platformConfig.baseUrl}${encodeURIComponent(baseUrl)}&text=${encodeURIComponent(text)}`;
      break;
    case "email":
      shareUrl = `${platformConfig.baseUrl}${encodeURIComponent(`${text}\n\nVer catálogo completo: ${baseUrl}`)}`;
      break;
  }

  window.open(shareUrl, "_blank", "noopener,noreferrer");
}

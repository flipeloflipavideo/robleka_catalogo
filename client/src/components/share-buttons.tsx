import { Button } from "@/components/ui/button";
import { SOCIAL_PLATFORMS } from "@/lib/constants";
import { shareProduct, shareMultipleProducts } from "@/lib/share-utils";
import type { Product } from "@shared/schema";

interface ShareButtonsProps {
  product?: Product;
  products?: Product[];
  size?: "sm" | "md" | "lg";
  layout?: "horizontal" | "vertical";
}

export default function ShareButtons({ 
  product, 
  products, 
  size = "sm", 
  layout = "horizontal" 
}: ShareButtonsProps) {
  const handleShare = (platform: keyof typeof SOCIAL_PLATFORMS) => {
    if (product) {
      shareProduct(product, platform);
    } else if (products && products.length > 0) {
      shareMultipleProducts(products, platform);
    }
  };

  const buttonSize = size === "sm" ? "w-8 h-8" : size === "md" ? "w-10 h-10" : "w-12 h-12";
  const iconSize = size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base";
  const containerClass = layout === "horizontal" ? "flex space-x-1" : "flex flex-col space-y-1";

  if (size === "lg") {
    return (
      <div className={layout === "horizontal" ? "flex space-x-3" : "flex flex-col space-y-3"}>
        {Object.entries(SOCIAL_PLATFORMS).map(([key, platform]) => (
          <Button
            key={key}
            onClick={() => handleShare(key as keyof typeof SOCIAL_PLATFORMS)}
            className={`flex-1 ${platform.color} text-white font-medium transition-colors flex items-center justify-center space-x-2 py-3`}
          >
            <i className={platform.icon}></i>
            <span>{platform.name}</span>
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className={containerClass}>
      {Object.entries(SOCIAL_PLATFORMS).map(([key, platform]) => (
        <button
          key={key}
          onClick={() => handleShare(key as keyof typeof SOCIAL_PLATFORMS)}
          className={`${buttonSize} ${platform.color} text-white rounded-full flex items-center justify-center transition-colors`}
          title={`Compartir en ${platform.name}`}
        >
          <i className={`${platform.icon} ${iconSize}`}></i>
        </button>
      ))}
    </div>
  );
}

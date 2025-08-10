import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Check, Eye } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import ShareButtons from "./share-buttons";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onSelect: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export default function ProductCard({ 
  product, 
  isSelected, 
  onSelect, 
  onViewDetails 
}: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  
  const category = CATEGORIES[product.category as keyof typeof CATEGORIES];
  const mainImage = product.images[0] || "https://via.placeholder.com/400x300?text=No+Image";

  return (
    <div className="masonry-item">
      <Card className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover cursor-pointer group">
        <div className="relative" onClick={() => onViewDetails(product)}>
          <img 
            src={mainImage} 
            alt={product.name}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
          
          {/* Overlay buttons */}
          <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="outline"
              className={`w-8 h-8 bg-white rounded-full shadow-md transition-colors ${
                isLiked ? "bg-deep-blue text-white border-deep-blue" : "hover:bg-deep-blue hover:text-white"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setIsLiked(!isLiked);
              }}
            >
              <Heart size={12} className={isLiked ? "fill-current" : ""} />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className={`w-8 h-8 bg-white rounded-full shadow-md transition-colors ${
                isSelected ? "bg-indigo text-white border-indigo" : "hover:bg-indigo hover:text-white"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(product);
              }}
            >
              <Check size={12} />
            </Button>
          </div>
          
          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <Badge className={`bg-${category?.color} text-white`}>
              {category?.label}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-poppins font-semibold text-dark-navy mb-2 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {product.tags.slice(0, 3).map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary"
                className="bg-deep-blue/10 text-deep-blue text-xs"
              >
                {tag}
              </Badge>
            ))}
            {product.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{product.tags.length - 3}
              </Badge>
            )}
          </div>
          
          {/* Footer */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Eye size={14} className="text-gray-400" />
              <span className="text-gray-600 text-sm">{product.views}</span>
            </div>
            
            <ShareButtons product={product} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import ShareButtons from "./share-buttons";
import type { Product } from "@shared/schema";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  if (!product) return null;

  const mainImage = product.images[0] || "https://via.placeholder.com/600x400?text=No+Image";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden p-0">
        <div className="relative">
          <img 
            src={mainImage} 
            alt={product.name}
            className="w-full h-64 object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>
        
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-poppins font-bold text-dark-blue mb-3">
              {product.name}
            </DialogTitle>
          </DialogHeader>
          
          <p className="text-gray-600 mb-4">
            {product.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {product.tags.map((tag) => (
              <Badge 
                key={tag}
                className="bg-coral/10 text-coral px-3 py-1 text-sm"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-poppins font-semibold text-dark-blue mb-4">
              Compartir este diseño
            </h3>
            <ShareButtons product={product} size="lg" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

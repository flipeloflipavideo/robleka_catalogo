import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Share2 } from "lucide-react";
import { CATEGORIES, STYLES, COLORS } from "@/lib/constants";
import ShareButtons from "./share-buttons";
import type { Product } from "@shared/schema";

interface SearchFiltersProps {
  onFiltersChange: (filters: {
    search: string;
    category: string;
    style: string;
    colors: string[];
  }) => void;
  selectedProducts: Product[];
  onClearSelection: () => void;
}

export default function SearchFilters({ 
  onFiltersChange, 
  selectedProducts, 
  onClearSelection 
}: SearchFiltersProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [activeStyle, setActiveStyle] = useState("");
  const [activeColors, setActiveColors] = useState<string[]>([]);

  const updateFilters = (newFilters: Partial<{
    search: string;
    category: string;
    style: string;
    colors: string[];
  }>) => {
    const filters = {
      search,
      category: activeCategory,
      style: activeStyle,
      colors: activeColors,
      ...newFilters,
    };
    onFiltersChange(filters);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    updateFilters({ search: value });
  };

  const handleCategoryClick = (category: string) => {
    const newCategory = activeCategory === category ? "" : category;
    setActiveCategory(newCategory);
    updateFilters({ category: newCategory });
  };

  const handleStyleClick = (style: string) => {
    const newStyle = activeStyle === style ? "" : style;
    setActiveStyle(newStyle);
    updateFilters({ style: newStyle });
  };

  const handleColorClick = (color: string) => {
    const newColors = activeColors.includes(color)
      ? activeColors.filter(c => c !== color)
      : [...activeColors, color];
    setActiveColors(newColors);
    updateFilters({ colors: newColors });
  };

  return (
    <section className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-6">
        {/* Search Bar and Selection */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Buscar diseños..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-12 pr-4 py-3 border-gray-300 rounded-full focus:ring-2 focus:ring-deep-blue focus:border-transparent"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          
          <div className="flex items-center space-x-3">
            {selectedProducts.length > 0 && (
              <>
                <ShareButtons products={selectedProducts} />
                <Button
                  onClick={onClearSelection}
                  variant="outline"
                  className="text-deep-blue border-deep-blue hover:bg-deep-blue hover:text-white"
                >
                  Limpiar ({selectedProducts.length})
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap gap-3">
          <span className="text-gray-600 font-medium mr-3">Filtros:</span>
          
          {/* Category Filters */}
          {Object.entries(CATEGORIES).map(([key, category]) => (
            <Button
              key={key}
              onClick={() => handleCategoryClick(key)}
              variant={activeCategory === key ? "default" : "outline"}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === key
                  ? `bg-${category.color} text-white hover:bg-${category.color}/80`
                  : `border-${category.color} text-${category.color} hover:bg-${category.color} hover:text-white`
              }`}
            >
              <i className={`${category.icon} mr-2`}></i>
              {category.label}
            </Button>
          ))}
          
          {/* Style Filters */}
          {Object.entries(STYLES).map(([key, style]) => (
            <Button
              key={key}
              onClick={() => handleStyleClick(key)}
              variant={activeStyle === key ? "default" : "outline"}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeStyle === key
                  ? `bg-${style.color} text-white hover:bg-${style.color}/80`
                  : `border-${style.color} text-${style.color} hover:bg-${style.color} hover:text-white`
              }`}
            >
              {style.label}
            </Button>
          ))}
          
          {/* Color Filters */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-500 text-sm">Colores:</span>
            {COLORS.map((color) => (
              <button
                key={color.name}
                onClick={() => handleColorClick(color.name)}
                className={`w-8 h-8 ${color.class} rounded-full border-2 shadow-md hover:scale-110 transition-transform ${
                  activeColors.includes(color.name) ? "border-gray-800" : "border-white"
                }`}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Active Filters Display */}
        {(activeCategory || activeStyle || activeColors.length > 0) && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-gray-500 text-sm">Filtros activos:</span>
            {activeCategory && (
              <Badge
                variant="secondary"
                className="cursor-pointer"
                onClick={() => handleCategoryClick(activeCategory)}
              >
                {CATEGORIES[activeCategory as keyof typeof CATEGORIES]?.label} ×
              </Badge>
            )}
            {activeStyle && (
              <Badge
                variant="secondary"
                className="cursor-pointer"
                onClick={() => handleStyleClick(activeStyle)}
              >
                {STYLES[activeStyle as keyof typeof STYLES]?.label} ×
              </Badge>
            )}
            {activeColors.map((color) => (
              <Badge
                key={color}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => handleColorClick(color)}
              >
                {color} ×
              </Badge>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

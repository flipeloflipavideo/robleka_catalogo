import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Layout from "@/components/layout";
import SearchFilters from "@/components/search-filters";
import ProductCard from "@/components/product-card";
import ProductModal from "@/components/product-modal";
import type { Product } from "@shared/schema";

export default function Catalog() {
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    style: "",
    colors: [] as string[],
  });
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Build query params
  const queryParams = new URLSearchParams();
  if (filters.search) queryParams.append("search", filters.search);
  if (filters.category) queryParams.append("category", filters.category);
  if (filters.style) queryParams.append("style", filters.style);
  if (filters.colors.length > 0) queryParams.append("colors", filters.colors.join(","));

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ["/api/products", queryParams.toString()],
  });

  const handleProductSelect = (product: Product) => {
    setSelectedProducts(prev => {
      const isSelected = prev.some(p => p.id === product.id);
      if (isSelected) {
        return prev.filter(p => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const clearSelection = () => {
    setSelectedProducts([]);
  };

  // Check for product parameter in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("product");
    if (productId && products.length > 0) {
      const product = (products as Product[]).find((p: Product) => p.id === productId);
      if (product) {
        handleViewDetails(product);
      }
    }
  }, [products]);

  return (
    <Layout>
      <SearchFilters
        onFiltersChange={setFilters}
        selectedProducts={selectedProducts}
        onClearSelection={clearSelection}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-poppins font-bold text-dark-navy">
            Catálogo de Diseños
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              {isLoading ? "Cargando..." : `${(products as Product[]).length} productos encontrados`}
            </span>
          </div>
        </div>

        {error && (
          <div className="text-center py-8">
            <p className="text-red-500">Error al cargar los productos</p>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-deep-blue"></div>
            <p className="mt-4 text-gray-600">Cargando productos...</p>
          </div>
        ) : (products as Product[]).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No se encontraron productos con los filtros aplicados</p>
            <Button onClick={() => setFilters({ search: "", category: "", style: "", colors: [] })}>
              Limpiar filtros
            </Button>
          </div>
        ) : (
          <div className="masonry-grid">
            {(products as Product[]).map((product: Product) => (
              <ProductCard
                key={product.id}
                product={product}
                isSelected={selectedProducts.some(p => p.id === product.id)}
                onSelect={handleProductSelect}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </main>

      <ProductModal
        product={selectedProduct}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedProduct(null);
        }}
      />

      {/* Floating Action Button */}
      <Button
        className="fixed bottom-6 right-6 w-14 h-14 gradient-bg text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 z-40"
        onClick={() => window.location.href = "/admin"}
        title="Ir al panel de administración"
      >
        <Plus size={24} />
      </Button>
    </Layout>
  );
}

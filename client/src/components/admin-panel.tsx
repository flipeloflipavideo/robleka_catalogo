import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Edit, Copy, Plus } from "lucide-react";
import { insertProductSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Product, InsertProduct } from "@shared/schema";

export default function AdminPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  const form = useForm<InsertProduct>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "agenda",
      tags: [],
      images: [],
      colors: [],
      style: "moderno",
      featured: "false",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertProduct) => apiRequest("POST", "/api/products", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      form.reset();
      toast({ title: "Producto creado exitosamente" });
    },
    onError: () => {
      toast({ title: "Error al crear producto", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertProduct> }) =>
      apiRequest("PUT", `/api/products/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setEditingProduct(null);
      form.reset();
      toast({ title: "Producto actualizado exitosamente" });
    },
    onError: () => {
      toast({ title: "Error al actualizar producto", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Producto eliminado exitosamente" });
    },
    onError: () => {
      toast({ title: "Error al eliminar producto", variant: "destructive" });
    },
  });

  const onSubmit = (data: InsertProduct) => {
    // Convert comma-separated strings to arrays
    const processedData = {
      ...data,
      tags: typeof data.tags === 'string' ? (data.tags as string).split(',').map(s => s.trim()) : data.tags,
      colors: typeof data.colors === 'string' ? (data.colors as string).split(',').map(s => s.trim()) : data.colors,
      images: typeof data.images === 'string' ? (data.images as string).split(',').map(s => s.trim()) : data.images,
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: processedData });
    } else {
      createMutation.mutate(processedData);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      description: product.description,
      category: product.category,
      tags: product.tags,
      images: product.images,
      colors: product.colors,
      style: product.style,
      featured: product.featured,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleDuplicate = (product: Product) => {
    form.reset({
      name: `${product.name} (Copia)`,
      description: product.description,
      category: product.category,
      tags: product.tags,
      images: product.images,
      colors: product.colors,
      style: product.style,
      featured: "false",
    });
    setEditingProduct(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-poppins font-bold text-dark-navy mb-2">
          Panel de Administración
        </h1>
        <p className="text-gray-600">Gestiona tu catálogo de productos</p>
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="add">Agregar/Editar</TabsTrigger>
          <TabsTrigger value="stats">Estadísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>
                {editingProduct ? "Editar Producto" : "Agregar Nuevo Producto"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre del Producto</Label>
                    <Input
                      id="name"
                      {...form.register("name")}
                      placeholder="Ej: Agenda Floral Premium"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Categoría</Label>
                    <Select
                      value={form.watch("category")}
                      onValueChange={(value) => form.setValue("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="agenda">Agenda</SelectItem>
                        <SelectItem value="libreta">Libreta</SelectItem>
                        <SelectItem value="etiquetas">Etiquetas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    {...form.register("description")}
                    placeholder="Descripción del producto..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="style">Estilo</Label>
                    <Select
                      value={form.watch("style")}
                      onValueChange={(value) => form.setValue("style", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un estilo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minimalista">Minimalista</SelectItem>
                        <SelectItem value="vintage">Vintage</SelectItem>
                        <SelectItem value="moderno">Moderno</SelectItem>
                        <SelectItem value="elegante">Elegante</SelectItem>
                        <SelectItem value="profesional">Profesional</SelectItem>
                        <SelectItem value="creativo">Creativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="featured">Destacado</Label>
                    <Select
                      value={form.watch("featured")}
                      onValueChange={(value) => form.setValue("featured", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="false">No</SelectItem>
                        <SelectItem value="true">Sí</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tags">Etiquetas (separadas por comas)</Label>
                    <Input
                      id="tags"
                      {...form.register("tags")}
                      placeholder="floral, elegante, premium"
                    />
                  </div>
                  <div>
                    <Label htmlFor="colors">Colores (separados por comas)</Label>
                    <Input
                      id="colors"
                      {...form.register("colors")}
                      placeholder="coral, verde, rosa"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="images">URLs de Imágenes (separadas por comas)</Label>
                  <Textarea
                    id="images"
                    {...form.register("images")}
                    placeholder="https://ejemplo.com/imagen1.jpg, https://ejemplo.com/imagen2.jpg"
                    rows={2}
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  {editingProduct && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingProduct(null);
                        form.reset();
                      }}
                    >
                      Cancelar
                    </Button>
                  )}
                  <Button
                    type="submit"
                    className="bg-deep-blue hover:bg-deep-blue/80 text-white"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    <Plus className="mr-2" size={16} />
                    {editingProduct ? "Actualizar" : "Agregar"} Producto
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Productos Existentes</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Cargando productos...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Producto</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Categoría</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Vistas</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(products as Product[]).map((product: Product) => (
                        <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={product.images[0] || "https://via.placeholder.com/60x60"}
                                alt={product.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <div>
                                <p className="font-medium text-dark-blue">{product.name}</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {product.tags.slice(0, 2).map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className="bg-coral/10 text-coral">
                              {product.category}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{product.views}</td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => handleEdit(product)}
                                className="text-sky hover:text-blue-600"
                              >
                                <Edit size={16} />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => handleDelete(product.id)}
                                className="text-coral hover:text-red-600"
                              >
                                <Trash2 size={16} />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => handleDuplicate(product)}
                                className="text-mint hover:text-green-600"
                              >
                                <Copy size={16} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Productos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-deep-blue">
                  {(products as Product[]).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Vistas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-indigo">
                  {(products as Product[]).reduce((sum: number, product: Product) => sum + product.views, 0)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Productos Destacados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-lavender">
                  {(products as Product[]).filter((product: Product) => product.featured === "true").length}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

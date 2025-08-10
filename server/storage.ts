import { type Product, type InsertProduct, type UpdateProduct, type User, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Product methods
  getProducts(filters?: {
    category?: string;
    style?: string;
    colors?: string[];
    tags?: string[];
    search?: string;
  }): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: UpdateProduct): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  incrementProductViews(id: string): Promise<void>;
  
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private users: Map<string, User>;

  constructor() {
    this.products = new Map();
    this.users = new Map();
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample products based on the design
    const sampleProducts: Product[] = [
      {
        id: "1",
        name: "Agenda Floral Premium",
        description: "Diseño elegante con patrones florales coloridos",
        category: "agenda",
        tags: ["floral", "elegante", "premium"],
        images: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"],
        colors: ["coral", "verde", "rosa"],
        style: "elegante",
        views: 234,
        featured: "true"
      },
      {
        id: "2",
        name: "Libreta Minimalista",
        description: "Diseño limpio y moderno para el día a día",
        category: "libreta",
        tags: ["minimalista", "moderno"],
        images: ["https://images.unsplash.com/photo-1531346878377-a5be20888e57?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        colors: ["blanco", "gris", "negro"],
        style: "minimalista",
        views: 156,
        featured: "false"
      },
      {
        id: "3",
        name: "Pack Etiquetas Vintage",
        description: "Colección de 50 etiquetas con estilo retro",
        category: "etiquetas",
        tags: ["vintage", "retro", "pack"],
        images: ["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600"],
        colors: ["sepia", "dorado", "marrón"],
        style: "vintage",
        views: 89,
        featured: "true"
      },
      {
        id: "4",
        name: "Agenda Workspace Pro",
        description: "Perfecta para organizar tu espacio de trabajo",
        category: "agenda",
        tags: ["profesional", "organización"],
        images: ["https://images.unsplash.com/photo-1484704849700-f032a568e944?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=350"],
        colors: ["azul", "gris", "blanco"],
        style: "profesional",
        views: 198,
        featured: "false"
      },
      {
        id: "5",
        name: "Libreta Arcoíris",
        description: "Explosión de colores para creativos",
        category: "libreta",
        tags: ["colorido", "creativo"],
        images: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"],
        colors: ["rojo", "azul", "verde", "amarillo", "violeta"],
        style: "creativo",
        views: 145,
        featured: "true"
      },
      {
        id: "6",
        name: "Etiquetas Geométricas",
        description: "Diseños modernos con formas geométricas",
        category: "etiquetas",
        tags: ["moderno", "geométrico"],
        images: ["https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"],
        colors: ["azul", "verde", "naranja"],
        style: "moderno",
        views: 112,
        featured: "false"
      }
    ];

    sampleProducts.forEach(product => {
      this.products.set(product.id, product);
    });

    // Create default admin user
    const adminUser: User = {
      id: "admin-1",
      username: "admin",
      password: "admin123" // In real app, this would be hashed
    };
    this.users.set(adminUser.id, adminUser);
  }

  async getProducts(filters?: {
    category?: string;
    style?: string;
    colors?: string[];
    tags?: string[];
    search?: string;
  }): Promise<Product[]> {
    let products = Array.from(this.products.values());

    if (filters) {
      if (filters.category) {
        products = products.filter(p => p.category === filters.category);
      }
      if (filters.style) {
        products = products.filter(p => p.style === filters.style);
      }
      if (filters.colors && filters.colors.length > 0) {
        products = products.filter(p => 
          filters.colors!.some(color => p.colors.includes(color))
        );
      }
      if (filters.tags && filters.tags.length > 0) {
        products = products.filter(p => 
          filters.tags!.some(tag => p.tags.includes(tag))
        );
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        products = products.filter(p => 
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
    }

    return products.sort((a, b) => b.views - a.views);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = {
      id,
      views: 0,
      ...insertProduct,
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updateProduct: UpdateProduct): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...updateProduct };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  async incrementProductViews(id: string): Promise<void> {
    const product = this.products.get(id);
    if (product) {
      product.views += 1;
      this.products.set(id, product);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();

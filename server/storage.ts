import { db } from "./db";
import { products, users, type Product, type InsertProduct, type UpdateProduct, type User, type InsertUser } from "@shared/schema";
import { eq, and, or, ilike, sql } from "drizzle-orm";

// This is the interface that our storage classes will implement
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

// DbStorage is the implementation of IStorage that uses a Drizzle for PostgreSQL
export class DbStorage implements IStorage {
  async getProducts(filters?: {
    category?: string;
    style?: string;
    colors?: string[];
    tags?: string[];
    search?: string;
  }): Promise<Product[]> {
    const conditions = [];
    if (filters) {
      if (filters.category) {
        conditions.push(eq(products.category, filters.category));
      }
      if (filters.style) {
        conditions.push(eq(products.style, filters.style));
      }
      // Note: Filtering by JSON array contents (colors, tags) is complex and database-specific.
      // The current implementation will filter by category, style, and search term.
      // A more advanced implementation might require raw SQL or specific Drizzle operators for JSON.
      if (filters.search) {
        const searchPattern = `%${filters.search}%`;
        conditions.push(
          or(
            ilike(products.name, searchPattern),
            ilike(products.description, searchPattern)
          )
        );
      }
    }

    // Start query builder
    let query = db.select().from(products);

    // Conditionally apply where clause
    if (conditions.length > 0) {
      // Re-assign the query builder instance after applying the where clause
      query = query.where(and(...conditions));
    }

    // Return the final query with ordering
    return await query.orderBy(sql`${products.views} desc`);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return await db.query.products.findFirst({ where: eq(products.id, id) });
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async updateProduct(id: string, updateProduct: UpdateProduct): Promise<Product | undefined> {
    const [product] = await db.update(products).set(updateProduct).where(eq(products.id, id)).returning();
    return product;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.rowCount > 0;
  }

  async incrementProductViews(id: string): Promise<void> {
    await db.update(products).set({ views: sql`${products.views} + 1` }).where(eq(products.id, id));
  }

  async getUser(id: string): Promise<User | undefined> {
    return await db.query.users.findFirst({ where: eq(users.id, id) });
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return await db.query.users.findFirst({ where: eq(users.username, username) });
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
}

// Export a single instance of the DbStorage
export const storage = new DbStorage();

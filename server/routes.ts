import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, updateProductSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all products with optional filters
  app.get("/api/products", async (req, res) => {
    try {
      const { category, style, colors, tags, search } = req.query;
      
      const filters = {
        category: category as string,
        style: style as string,
        colors: colors ? (colors as string).split(',') : undefined,
        tags: tags ? (tags as string).split(',') : undefined,
        search: search as string,
      };

      const products = await storage.getProducts(filters);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching products" });
    }
  });

  // Get single product
  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Increment view count
      await storage.incrementProductViews(req.params.id);
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Error fetching product" });
    }
  });

  // Create new product
  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating product" });
    }
  });

  // Update product
  app.put("/api/products/:id", async (req, res) => {
    try {
      const validatedData = updateProductSchema.parse(req.body);
      const product = await storage.updateProduct(req.params.id, validatedData);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating product" });
    }
  });

  // Delete product
  app.delete("/api/products/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteProduct(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting product" });
    }
  });

  // Get product categories
  app.get("/api/categories", async (req, res) => {
    try {
      const products = await storage.getProducts();
      const categories = Array.from(new Set(products.map(p => p.category)));
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Error fetching categories" });
    }
  });

  // Get product styles
  app.get("/api/styles", async (req, res) => {
    try {
      const products = await storage.getProducts();
      const styles = Array.from(new Set(products.map(p => p.style)));
      res.json(styles);
    } catch (error) {
      res.status(500).json({ message: "Error fetching styles" });
    }
  });

  // Get all colors
  app.get("/api/colors", async (req, res) => {
    try {
      const products = await storage.getProducts();
      const colors = Array.from(new Set(products.flatMap(p => p.colors)));
      res.json(colors);
    } catch (error) {
      res.status(500).json({ message: "Error fetching colors" });
    }
  });

  // Basic admin authentication
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // In a real app, you'd generate a JWT token here
      res.json({ message: "Login successful", user: { id: user.id, username: user.username } });
    } catch (error) {
      res.status(500).json({ message: "Error during authentication" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

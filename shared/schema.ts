import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // 'agenda', 'libreta', 'etiquetas'
  tags: json("tags").$type<string[]>().notNull().default([]),
  images: json("images").$type<string[]>().notNull().default([]),
  colors: json("colors").$type<string[]>().notNull().default([]),
  style: text("style").notNull(), // 'minimalista', 'vintage', 'moderno', etc.
  views: integer("views").notNull().default(0),
  featured: text("featured").notNull().default('false'), // 'true' or 'false'
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  views: true,
});

export const updateProductSchema = insertProductSchema.partial();

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;
export type Product = typeof products.$inferSelect;

// User schema for basic admin auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

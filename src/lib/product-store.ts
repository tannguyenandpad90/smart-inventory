import { Product } from "@/types/inventory";
import { products as seedData } from "@/lib/mock-data";

// In-memory store (resets on server restart)
const store: Product[] = [...seedData];
let nextId = seedData.length + 1;

export function getAll(): Product[] {
  return store;
}

export function getById(id: string): Product | undefined {
  return store.find((p) => p.id === id);
}

export function create(product: Omit<Product, "id">): Product {
  const newProduct: Product = { ...product, id: String(nextId++) };
  store.push(newProduct);
  return newProduct;
}

export function update(
  id: string,
  data: Partial<Omit<Product, "id">>
): Product | null {
  const index = store.findIndex((p) => p.id === id);
  if (index === -1) return null;
  store[index] = { ...store[index], ...data };
  return store[index];
}

export function remove(id: string): boolean {
  const index = store.findIndex((p) => p.id === id);
  if (index === -1) return false;
  store.splice(index, 1);
  return true;
}

import Database from "better-sqlite3";
import { randomBytes } from "crypto";
import path from "path";

function cuid(): string {
  const timestamp = Date.now().toString(36);
  const random = randomBytes(8).toString("hex");
  return `c${timestamp}${random}`;
}

const dbPath = path.join(__dirname, "..", "dev.db");
const db = new Database(dbPath);

const products = [
  { name: "Sony WH-1000XM5 Headphones", stock: 45, price: 349.99, category: "Audio" },
  { name: 'Samsung 65" OLED 4K Smart TV', stock: 12, price: 1799.99, category: "Televisions" },
  { name: "Apple MacBook Pro 14-inch M3", stock: 28, price: 1999.99, category: "Laptops" },
  { name: "Logitech MX Master 3S Mouse", stock: 120, price: 99.99, category: "Peripherals" },
  { name: "Apple iPhone 15 Pro 256GB", stock: 64, price: 1199.99, category: "Smartphones" },
  { name: "Corsair K95 RGB Mechanical Keyboard", stock: 73, price: 179.99, category: "Peripherals" },
  { name: "Dell UltraSharp 27 4K Monitor", stock: 34, price: 619.99, category: "Monitors" },
  { name: "NVIDIA GeForce RTX 4080 GPU", stock: 8, price: 1199.99, category: "Components" },
  { name: "Samsung 990 Pro 2TB NVMe SSD", stock: 95, price: 159.99, category: "Storage" },
  { name: "Anker 737 Power Bank 24000mAh", stock: 52, price: 109.99, category: "Accessories" },
];

console.log("Seeding database...");

const now = new Date().toISOString();
const insert = db.prepare(`
  INSERT OR REPLACE INTO Product (id, name, category, price, stock, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const insertMany = db.transaction(() => {
  for (const p of products) {
    insert.run(cuid(), p.name, p.category, p.price, p.stock, now, now);
  }
});

// Clear existing data first
db.exec("DELETE FROM Product");
insertMany();

const count = db.prepare("SELECT COUNT(*) as count FROM Product").get() as { count: number };
console.log(`Seeded ${count.count} products.`);
db.close();

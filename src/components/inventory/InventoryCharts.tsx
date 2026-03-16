"use client";

import { useEffect, useMemo, useState } from "react";
import { Product } from "@/types/inventory";
import { BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = [
  "#6366f1",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#64748b",
];

export default function InventoryCharts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => {});
  }, []);

  const { stockByCategory, valueByCategory } = useMemo(() => {
    const categoryMap = new Map<string, { stock: number; value: number }>();

    for (const p of products) {
      const existing = categoryMap.get(p.category) ?? { stock: 0, value: 0 };
      categoryMap.set(p.category, {
        stock: existing.stock + p.stock,
        value: existing.value + p.price * p.stock,
      });
    }

    const stockByCategory = Array.from(categoryMap.entries())
      .map(([name, data]) => ({ name, stock: data.stock }))
      .sort((a, b) => b.stock - a.stock);

    const valueByCategory = Array.from(categoryMap.entries())
      .map(([name, data]) => ({
        name,
        value: Math.round(data.value),
      }))
      .sort((a, b) => b.value - a.value);

    return { stockByCategory, valueByCategory };
  }, [products]);

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-slate-700 dark:text-slate-300" />
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Inventory Analytics
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Stock by Category - Bar Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h3 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
            Stock by Category
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stockByCategory} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11 }}
                className="fill-slate-500 dark:fill-slate-400"
              />
              <YAxis
                tick={{ fontSize: 11 }}
                className="fill-slate-500 dark:fill-slate-400"
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  fontSize: "13px",
                }}
              />
              <Bar dataKey="stock" radius={[6, 6, 0, 0]}>
                {stockByCategory.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Value by Category - Pie Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h3 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
            Inventory Value by Category
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={valueByCategory}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {valueByCategory.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) =>
                  `$${Number(value).toLocaleString()}`
                }
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  fontSize: "13px",
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { Product } from "@/types/inventory";
import { Package, DollarSign, AlertTriangle, TrendingUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  accent: string;
}

function StatCard({ title, value, subtitle, icon, accent }: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {value}
          </p>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{subtitle}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${accent}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => {});
  }, []);

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
    const lowStockItems = products.filter((p) => p.stock <= 20);
    const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);
    const avgPrice = totalProducts > 0 ? products.reduce((sum, p) => sum + p.price, 0) / totalProducts : 0;

    return { totalProducts, totalValue, lowStockItems, totalUnits, avgPrice };
  }, [products]);

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Products"
        value={String(stats.totalProducts)}
        subtitle={`${stats.totalUnits} total units in stock`}
        icon={<Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
        accent="bg-blue-50 dark:bg-blue-950"
      />
      <StatCard
        title="Inventory Value"
        value={formatCurrency(stats.totalValue)}
        subtitle={`Avg ${formatCurrency(stats.avgPrice)} per product`}
        icon={<DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
        accent="bg-emerald-50 dark:bg-emerald-950"
      />
      <StatCard
        title="Low Stock Alert"
        value={String(stats.lowStockItems.length)}
        subtitle={
          stats.lowStockItems.length > 0
            ? stats.lowStockItems.map((p) => p.name.split(" ")[0]).join(", ")
            : "All products well stocked"
        }
        icon={<AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
        accent="bg-amber-50 dark:bg-amber-950"
      />
      <StatCard
        title="Categories"
        value={String(new Set(products.map((p) => p.category)).size)}
        subtitle="Active product categories"
        icon={<TrendingUp className="h-5 w-5 text-violet-600 dark:text-violet-400" />}
        accent="bg-violet-50 dark:bg-violet-950"
      />
    </div>
  );
}

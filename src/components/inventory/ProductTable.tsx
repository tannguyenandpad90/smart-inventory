"use client";

import { Product } from "@/types/inventory";
import { products } from "@/lib/mock-data";
import { Pencil, Trash2, Package } from "lucide-react";

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
        Out of stock
      </span>
    );
  }
  if (stock <= 20) {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
        Low: {stock}
      </span>
    );
  }
  if (stock <= 50) {
    return (
      <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
        Medium: {stock}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
      In stock: {stock}
    </span>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export default function ProductTable() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900">
            <Package className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Products</h2>
            <p className="text-sm text-slate-500">
              {products.length} items in inventory
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Product Name
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Category
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Price
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Stock
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product: Product) => (
              <tr
                key={product.id}
                className="transition-colors hover:bg-slate-50/60"
              >
                <td className="px-6 py-4">
                  <span className="font-medium text-slate-900">
                    {product.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium tabular-nums text-slate-700">
                  {formatCurrency(product.price)}
                </td>
                <td className="px-6 py-4">
                  <StockBadge stock={product.stock} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

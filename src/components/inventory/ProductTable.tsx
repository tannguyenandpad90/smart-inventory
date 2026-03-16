"use client";

import { useMemo, useState } from "react";
import { Product } from "@/types/inventory";
import { products as initialProducts } from "@/lib/mock-data";
import { Pencil, Trash2, Package, Search, Plus, ArrowUp, ArrowDown, ArrowUpDown, ChevronLeft, ChevronRight, Download } from "lucide-react";

const PAGE_SIZE = 5;
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { useToast } from "@/components/ui/Toast";

type SortField = "price" | "stock";
type SortDirection = "asc" | "desc";

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20 dark:bg-red-950 dark:text-red-400 dark:ring-red-500/30">
        Out of stock
      </span>
    );
  }
  if (stock <= 20) {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-950 dark:text-amber-400 dark:ring-amber-500/30">
        Low: {stock}
      </span>
    );
  }
  if (stock <= 50) {
    return (
      <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-950 dark:text-blue-400 dark:ring-blue-500/30">
        Medium: {stock}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950 dark:text-emerald-400 dark:ring-emerald-500/30">
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
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [page, setPage] = useState(1);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products]
  );

  function handleSort(field: SortField) {
    if (sortField === field) {
      if (sortDirection === "desc") {
        setSortField(null);
        setSortDirection("asc");
      } else {
        setSortDirection("desc");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5 text-slate-700 dark:text-slate-200" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-slate-700 dark:text-slate-200" />
    );
  }

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    const result = products.filter((p) => {
      const matchesSearch = !query || p.name.toLowerCase().includes(query);
      const matchesCategory =
        !selectedCategory || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (sortField) {
      result.sort((a, b) => {
        const diff = a[sortField] - b[sortField];
        return sortDirection === "asc" ? diff : -diff;
      });
    }

    setPage(1);
    return result;
  }, [products, search, selectedCategory, sortField, sortDirection]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleAddProduct(product: Product) {
    setProducts((prev) => [...prev, product]);
    toast(`"${product.name}" added successfully`);
  }

  function handleUpdateProduct(updated: Product) {
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
    toast(`"${updated.name}" updated successfully`);
  }

  function handleDeleteProduct(id: string) {
    const deleted = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast(`"${deleted?.name}" deleted successfully`);
  }

  function handleExportCSV() {
    const headers = ["ID", "Name", "Category", "Price", "Stock"];
    const rows = filtered.map((p) => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      p.category,
      p.price.toFixed(2),
      String(p.stock),
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `inventory-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast(`Exported ${filtered.length} products to CSV`, "info");
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 dark:bg-slate-100">
            <Package className="h-5 w-5 text-white dark:text-slate-900" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Products</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {filtered.length} of {products.length} items
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-600 dark:focus:ring-slate-700"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:focus:border-slate-600 dark:focus:ring-slate-700"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-800/80">
              <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Product Name
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Category
              </th>
              <th
                className="cursor-pointer select-none px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                onClick={() => handleSort("price")}
              >
                <span className="inline-flex items-center gap-1">
                  Price <SortIcon field="price" />
                </span>
              </th>
              <th
                className="cursor-pointer select-none px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                onClick={() => handleSort("stock")}
              >
                <span className="inline-flex items-center gap-1">
                  Stock <SortIcon field="stock" />
                </span>
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-sm text-slate-400"
                >
                  No products found
                </td>
              </tr>
            ) : (
              paginated.map((product: Product) => (
                <tr
                  key={product.id}
                  className="transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/60"
                >
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {product.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium tabular-nums text-slate-700 dark:text-slate-300">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-6 py-4">
                    <StockBadge stock={product.stock} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeletingProduct(product)}
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing{" "}
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {(page - 1) * PAGE_SIZE + 1}
            </span>
            {" - "}
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {Math.min(page * PAGE_SIZE, filtered.length)}
            </span>
            {" of "}
            <span className="font-medium text-slate-700 dark:text-slate-300">{filtered.length}</span>
            {" results"}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`min-w-[2rem] rounded-lg px-2 py-1.5 text-sm font-medium transition-colors ${
                  p === page
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddProductModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddProduct}
      />
      <EditProductModal
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
        onUpdate={handleUpdateProduct}
      />
      <DeleteConfirmModal
        product={deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onDeleted={handleDeleteProduct}
      />
    </div>
  );
}

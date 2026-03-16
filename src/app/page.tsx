import ProductTable from "@/components/inventory/ProductTable";
import AIAnalysisButton from "@/components/inventory/AIAnalysisButton";
import Dashboard from "@/components/inventory/Dashboard";
import InventoryCharts from "@/components/inventory/InventoryCharts";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 transition-colors dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Hệ thống Quản lý Kho thông minh
          </h1>
          <ThemeToggle />
        </div>
        <Dashboard />
        <InventoryCharts />
        <ProductTable />
        <div className="mt-6">
          <AIAnalysisButton />
        </div>
      </div>
    </div>
  );
}

import ProductTable from "@/components/inventory/ProductTable";
import AIAnalysisButton from "@/components/inventory/AIAnalysisButton";
import Dashboard from "@/components/inventory/Dashboard";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-2xl font-bold tracking-tight text-slate-900">
          Hệ thống Quản lý Kho thông minh
        </h1>
        <Dashboard />
        <ProductTable />
        <div className="mt-6">
          <AIAnalysisButton />
        </div>
      </div>
    </div>
  );
}

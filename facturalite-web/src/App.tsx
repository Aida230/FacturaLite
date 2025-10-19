import { useState } from "react";
import Layout from "./components/layout/Layout";
import ClientesPage from "./pages/ClientesPage";
import FacturasPage from "./pages/FacturasPage";
import ProductosPage from "./pages/ProductosPage";

export default function App() {
  const [tab, setTab] = useState<"clientes" | "facturas" | "productos">("productos");

  return (
    <Layout>
      <div className="mb-4 flex gap-2">
        <button
          className={`px-3 h-9 rounded-lg border ${tab === "clientes" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white"}`}
          onClick={() => setTab("clientes")}
        >
          Clientes
        </button>
        <button
          className={`px-3 h-9 rounded-lg border ${tab === "facturas" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white"}`}
          onClick={() => setTab("facturas")}
        >
          Facturas
        </button>
        <button
          className={`px-3 h-9 rounded-lg border ${tab === "productos" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white"}`}
          onClick={() => setTab("productos")}
        >
          Productos
        </button>
      </div>

      {tab === "productos" ? <ProductosPage /> : tab === "facturas" ? <FacturasPage /> : <ClientesPage />}
    </Layout>
  );
}

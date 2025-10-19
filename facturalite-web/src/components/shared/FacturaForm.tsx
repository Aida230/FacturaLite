import { useState } from "react";
import Button from "../../components/shared/Button";
import type { Producto } from "../../types/producto";

type LineaDraft = { productoId: number | ""; cantidad: number | "" };

type Props = {
  clientes: { id: number; nombre: string }[];
  productos: Producto[];
  onCreate: (dto: { clienteId: number; lineas: Array<{ productoId: number; cantidad: number }> }) => Promise<void>;
};

export default function FacturaForm({ clientes, productos, onCreate }: Props) {
  const [clienteId, setClienteId] = useState<number | "">("");
  const [lineas, setLineas] = useState<LineaDraft[]>([{ productoId: "", cantidad: "" }]);
  const [creando, setCreando] = useState(false);

  const valido =
    clienteId !== "" &&
    lineas.length > 0 &&
    lineas.every(l => l.productoId !== "" && l.cantidad !== "");

  async function handleCrear() {
    if (!valido) return;
    try {
      setCreando(true);
      await onCreate({
        clienteId: Number(clienteId),
        lineas: lineas.map(l => ({ productoId: Number(l.productoId), cantidad: Number(l.cantidad) })),
      });
      // reset
      setClienteId("");
      setLineas([{ productoId: "", cantidad: "" }]);
    } finally {
      setCreando(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-3">Nueva factura</h2>
      <div className="grid gap-3 md:grid-cols-4">
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Cliente</label>
          <select
            className="w-full h-10 rounded-lg border px-3"
            value={clienteId}
            onChange={e => setClienteId(e.target.value ? Number(e.target.value) : "")}
          >
            <option value="">Selecciona…</option>
            {clientes.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-4">
          <label className="block text-sm mb-2">Líneas</label>
          <div className="space-y-2">
            {lineas.map((l, idx) => {
              const prod = productos.find(p => p.id === l.productoId);
              const precio = prod?.precioUnitario ?? 0;
              const iva = prod?.ivaPorcentaje ?? 0;
              const cant = Number(l.cantidad) || 0;
              const base = cant * precio;
              const total = base * (1 + iva / 100);

              return (
                <div key={idx} className="flex flex-col gap-2 md:flex-row md:items-center md:gap-2 p-2 border rounded-lg">
                  {/* SELECT DE PRODUCTO */}
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 mb-1">Producto</label>
                    <select
                      className="w-full h-10 rounded-lg border px-3"
                      value={l.productoId}
                      onChange={e => {
                        const v = e.target.value ? Number(e.target.value) : "";
                        setLineas(prev => prev.map((x, i) => i === idx ? { ...x, productoId: v } : x));
                      }}
                    >
                      <option value="">Selecciona un producto…</option>
                      {productos.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.nombre}{p.sku ? ` — ${p.sku}` : ""} · {p.precioUnitario.toFixed(2)}€ (+{p.ivaPorcentaje}%)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* CANTIDAD */}
                  <div className="md:w-40">
                    <label className="block text-xs text-gray-600 mb-1">Cantidad</label>
                    <input
                      className="w-full h-10 rounded-lg border px-3"
                      placeholder="Cantidad"
                      type="number"
                      min={1}
                      value={l.cantidad}
                      onChange={e => {
                        const v = e.target.value ? Number(e.target.value) : "";
                        setLineas(prev => prev.map((x, i) => i === idx ? { ...x, cantidad: v } : x));
                      }}
                    />
                  </div>

                  {/* PREVIEW IMPORTE (visual) */}
                  <div className="grow text-sm text-gray-600 md:text-right">
                    {prod && cant > 0 ? (
                      <div className="md:min-w-60">
                        <div>Base: {base.toFixed(2)} €</div>
                        <div>IVA: {(base * iva / 100).toFixed(2)} €</div>
                        <div className="font-medium">Total línea: {total.toFixed(2)} €</div>
                      </div>
                    ) : (
                      <span className="text-xs">Selecciona producto y cantidad</span>
                    )}
                  </div>

                  {/* QUITAR LÍNEA */}
                  <div className="md:w-28">
                    <Button
                      variant="ghost"
                      onClick={() => setLineas(prev => prev.filter((_, i) => i !== idx))}
                      disabled={lineas.length === 1}
                    >
                      Quitar
                    </Button>
                  </div>
                </div>
              );
            })}
            <Button variant="ghost" onClick={() => setLineas(prev => [...prev, { productoId: "", cantidad: "" }])}>
              + Añadir línea
            </Button>
          </div>
        </div>

        <div className="md:col-span-4">
          <Button onClick={handleCrear} disabled={!valido || creando}>
            {creando ? "Creando…" : "Crear factura"}
          </Button>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import Button from "../components/shared/Button";
import { listarFacturas, obtenerFactura, crearFactura, type CrearFacturaDto } from "../services/facturas.service";
import type { Factura } from "../types/factura";
import { listarClientes } from "../services/clientes.service";
import { listarProductos } from "../services/productos.service";
import type { Producto } from "../types/producto";

export default function FacturasPage() {
  // listado
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandidaId, setExpandidaId] = useState<number | null>(null);

  // filtros
  const [fClienteId, setFClienteId] = useState<number | "">("");
  const [fDesde, setFDesde] = useState("");
  const [fHasta, setFHasta] = useState("");

  // crear
  const [clienteId, setClienteId] = useState<number | "">("");
  const [lineas, setLineas] = useState<Array<{ productoId: number | ""; cantidad: number | "" }>>([
    { productoId: "", cantidad: "" },
  ]);
  const [creando, setCreando] = useState(false);

  // selects de clientes y productos
  const [clientes, setClientes] = useState<{ id: number; nombre: string }[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);

  // carga inicial de productos (para el selector) y clientes+facturas con filtros
  useEffect(() => {
    (async () => {
      try {
        setError(null);
        const [fs, cs] = await Promise.all([
          listarFacturas({
            clienteId: fClienteId === "" ? undefined : Number(fClienteId),
            fechaDesde: fDesde || undefined,
            fechaHasta: fHasta || undefined,
          }),
          listarClientes(),
        ]);
        setFacturas(fs);
        setClientes(cs.map(c => ({ id: c.id, nombre: c.nombre })));
      } catch (e: any) {
        setError(e?.message ?? "Error al cargar facturas");
      } finally {
        setCargando(false);
      }
    })();
  }, [fClienteId, fDesde, fHasta]);

  useEffect(() => {
    (async () => {
      try {
        const list = await listarProductos(); // sin filtros
        setProductos(list);
      } catch {
        setProductos([]);
      }
    })();
  }, []);

  async function toggleDetalle(id: number) {
    try {
      setError(null);
      if (expandidaId === id) {
        setExpandidaId(null);
        return;
      }
      // si no tenemos líneas, pedimos la factura concreta con detalle
      const ya = facturas.find(f => f.id === id);
      if (!ya?.lineas?.length) {
        const full = await obtenerFactura(id);
        setFacturas(prev => prev.map(f => (f.id === id ? full : f)));
      }
      setExpandidaId(id);
    } catch (e: any) {
      setError(e?.message ?? "Error al cargar detalle");
    }
  }

  async function onCrear() {
    try {
      setCreando(true);
      setError(null);
      if (clienteId === "" || lineas.length === 0) return;
      const dto: CrearFacturaDto = {
        clienteId: Number(clienteId),
        lineas: lineas
          .filter(l => l.productoId !== "" && l.cantidad !== "")
          .map(l => ({ productoId: Number(l.productoId), cantidad: Number(l.cantidad) })),
      };
      const nueva = await crearFactura(dto);
      setFacturas(prev => [nueva, ...prev]);
      // reset
      setClienteId("");
      setLineas([{ productoId: "", cantidad: "" }]);
    } catch (e: any) {
      setError(e?.message ?? "Error al crear factura");
    } finally {
      setCreando(false);
    }
  }

  const hayFiltros = useMemo(() => fClienteId !== "" || fDesde || fHasta, [fClienteId, fDesde, fHasta]);

  if (cargando) return <p className="p-4">Cargando…</p>;
  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 p-3">{error}</div>
      )}

      {/* FILTROS */}
      <div className="bg-white rounded-xl border p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm mb-1">Cliente</label>
            <select
              className="w-full h-10 rounded-lg border px-3"
              value={fClienteId}
              onChange={e => setFClienteId(e.target.value ? Number(e.target.value) : "")}
            >
              <option value="">Todos</option>
              {clientes.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Desde</label>
            <input type="date" className="h-10 rounded-lg border px-3" value={fDesde} onChange={e => setFDesde(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Hasta</label>
            <input type="date" className="h-10 rounded-lg border px-3" value={fHasta} onChange={e => setFHasta(e.target.value)} />
          </div>
          {hayFiltros && (
            <Button variant="ghost" onClick={() => { setFClienteId(""); setFDesde(""); setFHasta(""); }}>
              Limpiar filtros
            </Button>
          )}
        </div>
      </div>

      {/* CREAR FACTURA */}
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
            <Button
              onClick={onCrear}
              disabled={
                clienteId === "" ||
                lineas.length === 0 ||
                lineas.some(l => !l.productoId || !l.cantidad) ||
                creando
              }
            >
              {creando ? "Creando…" : "Crear factura"}
            </Button>
          </div>
        </div>
      </div>

      {/* LISTADO */}
      <div className="bg-white rounded-xl border p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Facturas ({facturas.length})</h2>
        {facturas.length === 0 ? (
          <p className="text-sm text-gray-500">No hay facturas.</p>
        ) : (
          <ul className="divide-y">
            {facturas.map(f => (
              <li key={f.id} className="py-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium">#{f.numero} — {f.cliente?.nombre ?? `Cliente ${f.clienteId}`}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(f.fecha).toLocaleString()} — Activa: <span className={f.activa ? "text-green-600" : "text-red-600"}>{f.activa ? "Sí" : "No"}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">Base: {f.totalBase.toFixed(2)} €</div>
                    <div className="text-sm">IVA: {f.totalIva.toFixed(2)} €</div>
                    <div className="font-semibold">Total: {f.total.toFixed(2)} €</div>
                  </div>
                </div>

                <div className="mt-2">
                  <Button variant="ghost" onClick={() => toggleDetalle(f.id)}>
                    {expandidaId === f.id ? "Ocultar detalle" : "Ver detalle"}
                  </Button>
                </div>

                {expandidaId === f.id && (
                  <div className="mt-3 rounded-lg border p-3 bg-gray-50">
                    {f.lineas?.length ? (
                      <table className="w-full text-sm">
                        <thead className="text-left text-gray-600">
                          <tr>
                            <th className="py-1">Producto</th>
                            <th className="py-1">Cant.</th>
                            <th className="py-1">Precio</th>
                            <th className="py-1">IVA %</th>
                            <th className="py-1 text-right">Importe</th>
                          </tr>
                        </thead>
                        <tbody>
                          {f.lineas.map(l => {
                            const precio = l.precioUnitario ?? l.producto?.precioUnitario ?? 0;
                            const iva = l.ivaPorcentaje ?? l.producto?.ivaPorcentaje ?? 0;
                            const base = Number(l.cantidad) * precio;
                            const total = base * (1 + iva / 100);
                            return (
                              <tr key={l.id}>
                                <td className="py-1">{l.producto?.nombre ?? `#${l.productoId}`}</td>
                                <td className="py-1">{l.cantidad}</td>
                                <td className="py-1">{precio.toFixed(2)} €</td>
                                <td className="py-1">{iva}%</td>
                                <td className="py-1 text-right">{total.toFixed(2)} €</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-sm text-gray-600">Sin líneas en memoria. (Se cargarán al abrir el detalle)</div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

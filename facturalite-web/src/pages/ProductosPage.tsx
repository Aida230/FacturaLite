import { useEffect, useMemo, useState } from "react";
import Button from "../components/shared/Button";
import type { Producto } from "../types/producto";
import {
  listarProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "../services/productos.service";

type Draft = {
  nombre: string;
  sku: string;
  precioUnitario: string;    // como texto para inputs
  ivaPorcentaje: string;     // texto
  activo: boolean;
};

const vacio: Draft = { nombre: "", sku: "", precioUnitario: "", ivaPorcentaje: "21", activo: true };

export default function ProductosPage() {
  const [items, setItems] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // filtros
  const [q, setQ] = useState("");
  const [fActivo, setFActivo] = useState<"" | "true" | "false">("");

  // creación
  const [draft, setDraft] = useState<Draft>(vacio);
  const [creando, setCreando] = useState(false);

  // edición inline
  const [editId, setEditId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<Draft>(vacio);
  const [guardando, setGuardando] = useState(false);
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);

  async function cargar() {
    try {
      setCargando(true);
      setError(null);
      const activo = fActivo === "" ? undefined : fActivo === "true";
      const list = await listarProductos({ q: q || undefined, activo });
      setItems(list);
    } catch (e: any) {
      setError(e?.message ?? "Error al cargar productos");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(); }, [q, fActivo]);

  const hayFiltros = useMemo(() => !!q || fActivo !== "", [q, fActivo]);

  // crear
  async function onCrear() {
    try {
      setCreando(true);
      setError(null);
      if (!draft.nombre || !draft.precioUnitario || !draft.ivaPorcentaje) return;

      const nuevo = await crearProducto({
        nombre: draft.nombre.trim(),
        sku: draft.sku.trim() || undefined,
        precioUnitario: Number(draft.precioUnitario),
        ivaPorcentaje: Number(draft.ivaPorcentaje),
        activo: draft.activo,
      });
      setItems(prev => [nuevo, ...prev]);
      setDraft(vacio);
    } catch (e: any) {
      setError(e?.message ?? "Error al crear producto");
    } finally {
      setCreando(false);
    }
  }

  // editar
  function startEdit(p: Producto) {
    setEditId(p.id);
    setEditDraft({
      nombre: p.nombre,
      sku: p.sku ?? "",
      precioUnitario: String(p.precioUnitario),
      ivaPorcentaje: String(p.ivaPorcentaje),
      activo: p.activo,
    });
  }

  async function saveEdit(id: number) {
    try {
      setGuardando(true);
      setError(null);
      const actualizado = await actualizarProducto(id, {
        nombre: editDraft.nombre.trim(),
        sku: editDraft.sku.trim() || undefined,
        precioUnitario: Number(editDraft.precioUnitario),
        ivaPorcentaje: Number(editDraft.ivaPorcentaje),
        activo: editDraft.activo,
      });
      setItems(prev => prev.map(x => (x.id === id ? actualizado : x)));
      setEditId(null);
    } catch (e: any) {
      setError(e?.message ?? "Error al guardar cambios");
    } finally {
      setGuardando(false);
    }
  }

  async function onEliminar(id: number) {
    try {
      setEliminandoId(id);
      setError(null);
      await eliminarProducto(id);
      setItems(prev => prev.filter(x => x.id !== id));
    } catch (e: any) {
      setError(e?.message ?? "No se pudo eliminar el producto");
    } finally {
      setEliminandoId(null);
    }
  }

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
            <label className="block text-sm mb-1">Buscar</label>
            <input
              className="w-full h-10 rounded-lg border px-3"
              placeholder="Nombre o SKU…"
              value={q}
              onChange={e => setQ(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Estado</label>
            <select
              className="h-10 rounded-lg border px-3"
              value={fActivo}
              onChange={e => setFActivo(e.target.value as any)}
            >
              <option value="">Todos</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          </div>
          {hayFiltros && (
            <Button variant="ghost" onClick={() => { setQ(""); setFActivo(""); }}>
              Limpiar filtros
            </Button>
          )}
        </div>
      </div>

      {/* CREAR */}
      <div className="bg-white rounded-xl border p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Nuevo producto</h2>
        <div className="grid gap-3 md:grid-cols-5">
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Nombre</label>
            <input
              className="w-full h-10 rounded-lg border px-3"
              value={draft.nombre}
              onChange={e => setDraft(d => ({ ...d, nombre: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">SKU</label>
            <input
              className="w-full h-10 rounded-lg border px-3"
              value={draft.sku}
              onChange={e => setDraft(d => ({ ...d, sku: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Precio (€)</label>
            <input
              type="number" step="0.01" min="0"
              className="w-full h-10 rounded-lg border px-3"
              value={draft.precioUnitario}
              onChange={e => setDraft(d => ({ ...d, precioUnitario: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">IVA (%)</label>
            <input
              type="number" step="1" min="0"
              className="w-full h-10 rounded-lg border px-3"
              value={draft.ivaPorcentaje}
              onChange={e => setDraft(d => ({ ...d, ivaPorcentaje: e.target.value }))}
            />
          </div>
          <div className="md:col-span-5 flex items-center gap-3">
            <label className="text-sm">
              <input
                type="checkbox"
                className="mr-2"
                checked={draft.activo}
                onChange={e => setDraft(d => ({ ...d, activo: e.target.checked }))}
              />
              Activo
            </label>
            <Button
              onClick={onCrear}
              disabled={!draft.nombre || !draft.precioUnitario || !draft.ivaPorcentaje || creando}
            >
              {creando ? "Creando…" : "Crear producto"}
            </Button>
          </div>
        </div>
      </div>

      {/* LISTADO */}
      <div className="bg-white rounded-xl border p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Productos ({items.length})</h2>

        {items.length === 0 ? (
          <p className="text-sm text-gray-500">No hay productos.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-gray-600 border-b">
              <tr>
                <th className="py-2">Nombre</th>
                <th className="py-2">SKU</th>
                <th className="py-2">Precio</th>
                <th className="py-2">IVA</th>
                <th className="py-2">Estado</th>
                <th className="py-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map(p => {
                const enEdicion = editId === p.id;
                return (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="py-2">
                      {enEdicion ? (
                        <input
                          className="h-9 rounded-lg border px-2 w-full"
                          value={editDraft.nombre}
                          onChange={e => setEditDraft(d => ({ ...d, nombre: e.target.value }))}
                        />
                      ) : p.nombre}
                    </td>
                    <td className="py-2">
                      {enEdicion ? (
                        <input
                          className="h-9 rounded-lg border px-2 w-40"
                          value={editDraft.sku}
                          onChange={e => setEditDraft(d => ({ ...d, sku: e.target.value }))}
                        />
                      ) : (p.sku ?? "—")}
                    </td>
                    <td className="py-2">
                      {enEdicion ? (
                        <input
                          type="number" step="0.01" min="0"
                          className="h-9 rounded-lg border px-2 w-28"
                          value={editDraft.precioUnitario}
                          onChange={e => setEditDraft(d => ({ ...d, precioUnitario: e.target.value }))}
                        />
                      ) : `${p.precioUnitario.toFixed(2)} €`}
                    </td>
                    <td className="py-2">
                      {enEdicion ? (
                        <input
                          type="number" step="1" min="0"
                          className="h-9 rounded-lg border px-2 w-20"
                          value={editDraft.ivaPorcentaje}
                          onChange={e => setEditDraft(d => ({ ...d, ivaPorcentaje: e.target.value }))}
                        />
                      ) : `${p.ivaPorcentaje}%`}
                    </td>
                    <td className="py-2">
                      {enEdicion ? (
                        <label className="text-sm">
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={editDraft.activo}
                            onChange={e => setEditDraft(d => ({ ...d, activo: e.target.checked }))}
                          />
                          Activo
                        </label>
                      ) : (
                        <span className={p.activo ? "text-green-600" : "text-gray-500"}>
                          {p.activo ? "Activo" : "Inactivo"}
                        </span>
                      )}
                    </td>
                    <td className="py-2">
                      <div className="flex gap-2 justify-end">
                        {enEdicion ? (
                          <>
                            <Button variant="ghost" onClick={() => setEditId(null)}>Cancelar</Button>
                            <Button onClick={() => saveEdit(p.id)} disabled={guardando}>
                              {guardando ? "Guardando…" : "Guardar"}
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button variant="ghost" onClick={() => startEdit(p)}>Editar</Button>
                            <Button
                              variant="ghost"
                              onClick={() => onEliminar(p.id)}
                              disabled={eliminandoId === p.id}
                            >
                              {eliminandoId === p.id ? "Eliminando…" : "Eliminar"}
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

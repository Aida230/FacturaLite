// src/components/productos/ProductTable.tsx
import { useState } from "react";
import Button from "../../components/shared/Button";
import type { Producto } from "../../types/producto";

type Props = {
  items: Producto[];
  onUpdate: (id: number, dto: Partial<Producto>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

export default function ProductTable({ items, onUpdate, onDelete }: Props) {
  const [editId, setEditId] = useState<number | null>(null);
  const [draft, setDraft] = useState({
    nombre: "",
    sku: "",
    precioUnitario: "",
    ivaPorcentaje: "",
    activo: true,
  });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  function startEdit(p: Producto) {
    setEditId(p.id);
    setDraft({
      nombre: p.nombre,
      sku: p.sku ?? "",
      precioUnitario: String(p.precioUnitario),
      ivaPorcentaje: String(p.ivaPorcentaje),
      activo: p.activo,
    });
  }

  async function saveEdit(id: number) {
    try {
      setSaving(true);
      await onUpdate(id, {
        nombre: draft.nombre.trim(),
        sku: draft.sku.trim() || undefined,
        precioUnitario: Number(draft.precioUnitario),
        ivaPorcentaje: Number(draft.ivaPorcentaje),
        activo: draft.activo,
      });
      setEditId(null);
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    try {
      setDeletingId(id);
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  }

  return (
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
              const editing = editId === p.id;
              return (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="py-2">
                    {editing ? (
                      <input
                        className="h-9 rounded-lg border px-2 w-full"
                        value={draft.nombre}
                        onChange={e => setDraft(d => ({ ...d, nombre: e.target.value }))}
                      />
                    ) : p.nombre}
                  </td>
                  <td className="py-2">
                    {editing ? (
                      <input
                        className="h-9 rounded-lg border px-2 w-40"
                        value={draft.sku}
                        onChange={e => setDraft(d => ({ ...d, sku: e.target.value }))}
                      />
                    ) : (p.sku ?? "—")}
                  </td>
                  <td className="py-2">
                    {editing ? (
                      <input
                        type="number" step="0.01" min="0"
                        className="h-9 rounded-lg border px-2 w-28"
                        value={draft.precioUnitario}
                        onChange={e => setDraft(d => ({ ...d, precioUnitario: e.target.value }))}
                      />
                    ) : `${p.precioUnitario.toFixed(2)} €`}
                  </td>
                  <td className="py-2">
                    {editing ? (
                      <input
                        type="number" step="1" min="0"
                        className="h-9 rounded-lg border px-2 w-20"
                        value={draft.ivaPorcentaje}
                        onChange={e => setDraft(d => ({ ...d, ivaPorcentaje: e.target.value }))}
                      />
                    ) : `${p.ivaPorcentaje}%`}
                  </td>
                  <td className="py-2">
                    {editing ? (
                      <label className="text-sm">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={draft.activo}
                          onChange={e => setDraft(d => ({ ...d, activo: e.target.checked }))}
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
                      {editing ? (
                        <>
                          <Button variant="ghost" onClick={() => setEditId(null)}>Cancelar</Button>
                          <Button onClick={() => saveEdit(p.id)} disabled={saving}>
                            {saving ? "Guardando…" : "Guardar"}
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="ghost" onClick={() => startEdit(p)}>Editar</Button>
                          <Button
                            variant="ghost"
                            onClick={() => remove(p.id)}
                            disabled={deletingId === p.id}
                          >
                            {deletingId === p.id ? "Eliminando…" : "Eliminar"}
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
  );
}

// src/components/productos/ProductForm.tsx
import { useState } from "react";
import Button from "../../components/shared/Button";

type Draft = {
  nombre: string;
  sku: string;
  precioUnitario: string; // texto para input
  ivaPorcentaje: string;  // texto para input
  activo: boolean;
};

const inicial: Draft = { nombre: "", sku: "", precioUnitario: "", ivaPorcentaje: "", activo: true };

type Props = {
  onCreate: (dto: {
    nombre: string;
    sku?: string;
    precioUnitario: number;
    ivaPorcentaje: number;
    activo: boolean;
  }) => Promise<void>;
};

export default function ProductForm({ onCreate }: Props) {
  const [draft, setDraft] = useState<Draft>(inicial);
  const [creando, setCreando] = useState(false);
  const puedeCrear =
    !!draft.nombre && !!draft.precioUnitario && !!draft.ivaPorcentaje && !creando;

  async function handleCreate() {
    if (!puedeCrear) return;
    try {
      setCreando(true);
      await onCreate({
        nombre: draft.nombre.trim(),
        sku: draft.sku.trim() || undefined,
        precioUnitario: Number(draft.precioUnitario),
        ivaPorcentaje: Number(draft.ivaPorcentaje),
        activo: draft.activo,
      });
      setDraft(inicial);
    } finally {
      setCreando(false);
    }
  }

  return (
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
            placeholder="Ej: 21"
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
          <Button onClick={handleCreate} disabled={!puedeCrear}>
            {creando ? "Creando…" : "Crear producto"}
          </Button>
        </div>
      </div>
    </div>
  );
}

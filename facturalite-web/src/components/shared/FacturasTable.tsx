import Button from "../../components/shared/Button";
import type { Factura } from "../../types/factura";

type Props = {
  facturas: Factura[];
  expandidaId: number | null;
  onToggleDetalle: (id: number) => void;
};

export default function FacturasTable({ facturas, expandidaId, onToggleDetalle }: Props) {
  return (
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
                <Button variant="ghost" onClick={() => onToggleDetalle(f.id)}>
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
  );
}

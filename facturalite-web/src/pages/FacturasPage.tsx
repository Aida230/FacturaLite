import { useFacturas } from "../hooks/useFacturas";
import FacturaForm from "../components/shared/FacturaForm";
import FacturasTable from "../components/shared/FacturasTable";

export default function FacturasPage() {
  const {
    facturas, clientes, productos,
    cargando, error, setError,
    expandidaId, toggleDetalle,
    crear,
  } = useFacturas();

  if (cargando) return <p className="p-4">Cargando…</p>;

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 p-3">{error}</div>
      )}

      <FacturaForm
        clientes={clientes}
        productos={productos}
        onCreate={async dto => {
          try {
            await crear(dto);
          } catch (e: any) {
            setError(e?.message ?? "Error al crear factura");
          }
        }}
      />

      <FacturasTable
        facturas={facturas}
        expandidaId={expandidaId}
        onToggleDetalle={toggleDetalle}
      />
    </div>
  );
}

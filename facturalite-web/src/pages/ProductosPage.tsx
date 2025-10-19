import ProductForm from "../components/shared/ProductForm";
import ProductTable from "../components/shared/ProductTable";
import { useProductos } from "../hooks/useProductos";

export default function ProductosPage() {
  const {
    items, loadingInit, error, setError, create, update, remove,
  } = useProductos();

  if (loadingInit) return <p className="p-4">Cargando…</p>;

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 p-3">
          {error}
        </div>
      )}
      <ProductForm
        onCreate={async dto => {
          try {
            await create(dto);
          } catch (e: any) {
            setError(e?.message ?? "Error al crear producto");
          }
        }}
      />

      <ProductTable
        items={items}
        onUpdate={async (id, dto) => {
          try {
            await update(id, dto);
          } catch (e: any) {
            setError(e?.message ?? "Error al guardar cambios");
          }
        }}
        onDelete={async id => {
          try {
            await remove(id);
          } catch (e: any) {
            setError(e?.message ?? "No se pudo eliminar el producto");
          }
        }}
      />
    </div>
  );
}

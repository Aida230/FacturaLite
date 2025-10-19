import { useCallback, useEffect, useState } from "react";
import type { Producto } from "../types/producto";
import {
  listarProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  type CrearProductoDto,
  type ActualizarProductoDto,
} from "../services/productos.service";

export type FiltroActivo = "" | "true" | "false";

export function useProductos() {
  const [items, setItems] = useState<Producto[]>([]);
  const [loadingInit, setLoadingInit] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [fActivo, setFActivo] = useState<FiltroActivo>("");

  // carga inicial (sin filtros)
  useEffect(() => {
    (async () => {
      try {
        setError(null);
        const list = await listarProductos({});
        setItems(list);
      } catch (e: any) {
        setError(e?.message ?? "Error al cargar productos");
      } finally {
        setLoadingInit(false);
      }
    })();
  }, []);

  // CRUD
  const create = useCallback(async (dto: CrearProductoDto) => {
    const nuevo = await crearProducto(dto);
    setItems(prev => [nuevo, ...prev]);
    return nuevo;
  }, []);

  const update = useCallback(async (id: number, dto: ActualizarProductoDto) => {
    const actualizado = await actualizarProducto(id, dto);
    setItems(prev => prev.map(x => (x.id === id ? actualizado : x)));
    return actualizado;
  }, []);

  const remove = useCallback(async (id: number) => {
    await eliminarProducto(id);
    setItems(prev => prev.filter(x => x.id !== id));
  }, []);

  const clearFilters = useCallback(() => {
    setQ("");
    setFActivo("");
  }, []);

  return {
    items, loadingInit, error, setError,
    q, setQ, fActivo, setFActivo, clearFilters, create, update, remove,
  };
}

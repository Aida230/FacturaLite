import { useEffect, useState, useCallback } from "react";
import { listarFacturas, obtenerFactura, crearFactura, type CrearFacturaDto } from "../services/facturas.service";
import { listarClientes } from "../services/clientes.service";
import { listarProductos } from "../services/productos.service";
import type { Factura } from "../types/factura";
import type { Producto } from "../types/producto";

export function useFacturas() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [clientes, setClientes] = useState<{ id: number; nombre: string }[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandidaId, setExpandidaId] = useState<number | null>(null);

  // carga inicial
  useEffect(() => {
    (async () => {
      try {
        setError(null);
        const [fs, cs, ps] = await Promise.all([
          listarFacturas({}), // sin filtros
          listarClientes(),
          listarProductos(),
        ]);
        setFacturas(fs);
        setClientes(cs.map(c => ({ id: c.id, nombre: c.nombre })));
        setProductos(ps);
      } catch (e: any) {
        setError(e?.message ?? "Error al cargar datos");
      } finally {
        setCargando(false);
      }
    })();
  }, []);

  const toggleDetalle = useCallback(async (id: number) => {
    try {
      setError(null);
      if (expandidaId === id) {
        setExpandidaId(null);
        return;
      }
      const ya = facturas.find(f => f.id === id);
      if (!ya?.lineas?.length) {
        const full = await obtenerFactura(id);
        setFacturas(prev => prev.map(f => (f.id === id ? full : f)));
      }
      setExpandidaId(id);
    } catch (e: any) {
      setError(e?.message ?? "Error al cargar detalle");
    }
  }, [expandidaId, facturas]);

  const crear = useCallback(async (dto: CrearFacturaDto) => {
    const nueva = await crearFactura(dto);
    setFacturas(prev => [nueva, ...prev]);
    return nueva;
  }, []);

  return {
    facturas, setFacturas,
    clientes,
    productos,
    cargando,
    error, setError,
    expandidaId, toggleDetalle,
    crear,
  };
}

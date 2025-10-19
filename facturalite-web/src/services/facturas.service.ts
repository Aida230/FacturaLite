import { request } from "../api/client";
import type { Factura } from "../types/factura";

export type ListarFacturasFiltro = {
  fechaDesde?: string;   // ISO (YYYY-MM-DD)
  fechaHasta?: string;   // ISO
  clienteId?: number;
  page?: number;
  pageSize?: number;
};

function toQuery(params: Record<string, unknown>): string {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") q.append(k, String(v));
  });
  const s = q.toString();
  return s ? `?${s}` : "";
}

export async function listarFacturas(f: ListarFacturasFiltro = {}): Promise<Factura[]> {
  return request<Factura[]>(`/api/facturas${toQuery(f)}`);
}

export async function obtenerFactura(id: number): Promise<Factura> {
  return request<Factura>(`/api/facturas/${id}`);
}

export type CrearFacturaDto = {
  clienteId: number;
  lineas: Array<{ productoId: number; cantidad: number }>;
};

export async function crearFactura(dto: CrearFacturaDto): Promise<Factura> {
  return request<Factura>(`/api/facturas`, { method: "POST", body: dto });
}

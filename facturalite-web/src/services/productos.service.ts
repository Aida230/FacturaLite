import { request } from "../api/client";
import type { Producto } from "../types/producto";

export type FiltroProductos = {
  q?: string;         // nombre o sku contiene
  activo?: boolean;   // true/false
  page?: number;
  pageSize?: number;
};

function toQuery(params: Record<string, unknown>) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") q.append(k, String(v));
  });
  const s = q.toString();
  return s ? `?${s}` : "";
}

export async function listarProductos(f: FiltroProductos = {}): Promise<Producto[]> {
  return request<Producto[]>(`/api/productos${toQuery(f)}`);
}

export async function obtenerProducto(id: number): Promise<Producto> {
  return request<Producto>(`/api/productos/${id}`);
}

export type CrearProductoDto = {
  nombre: string;
  sku?: string;
  precioUnitario: number;
  ivaPorcentaje: number;
  activo?: boolean;
};

export async function crearProducto(dto: CrearProductoDto): Promise<Producto> {
  return request<Producto>(`/api/productos`, { method: "POST", body: dto });
}

export type ActualizarProductoDto = Partial<CrearProductoDto>;

export async function actualizarProducto(id: number, dto: ActualizarProductoDto): Promise<Producto> {
  return request<Producto>(`/api/productos/${id}`, { method: "PUT", body: dto });
}

export async function eliminarProducto(id: number): Promise<void> {
  await request<void>(`/api/productos/${id}`, { method: "DELETE" });
}

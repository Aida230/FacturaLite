// Cabecera + líneas (alineado con lo que devuelve tu API .NET)
export type FacturaLinea = {
  id: number;
  facturaId: number;
  productoId: number;
  cantidad: number;
  precioUnitario?: number;
  ivaPorcentaje?: number;
  producto?: { id: number; nombre: string; sku?: string; precioUnitario?: number; ivaPorcentaje?: number };
};

export type Factura = {
  id: number;
  numero: string;
  fecha: string;         // ISO
  clienteId: number;
  cliente?: {
    id: number;
    nombre: string;
    email?: string;
    nif?: string;
    telefono?: string;
    direccion?: string;
    fechaAlta: string;
    activo: boolean;
  };
  totalBase: number;
  totalIva: number;
  total: number;
  activa: boolean;
  lineas: FacturaLinea[];
};

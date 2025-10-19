export type Producto = {
  id: number;
  nombre: string;
  sku?: string;
  precioUnitario: number;
  ivaPorcentaje: number;
  activo: boolean;
};

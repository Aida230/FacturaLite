namespace FacturaLite.Api.Domain.Entities
{
    // Representa un artículo vendible que luego se usa en las líneas de factura.
    public class Producto
    {
        public int Id { get; set; }

        // Nombre del producto (obligatorio)
        public string Nombre { get; set; } = string.Empty;

        // SKU o código interno (opcional pero útil para búsquedas)
        public string? Sku { get; set; }

        // Precio base por unidad (sin IVA). Usamos decimal para dinero.
        public decimal PrecioUnitario { get; set; }

        // Porcentaje de IVA (ej: 21, 10, 0)
        public decimal IvaPorcentaje { get; set; } = 21m;

        // Estado lógico para no borrar físicamente
        public bool Activo { get; set; } = true;
    }
}

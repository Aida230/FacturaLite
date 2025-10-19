namespace FacturaLite.Api.Domain.Entities
{
    // Cabecera de la factura
    public class Factura
    {
        public int Id { get; set; }
        public string Numero { get; set; } = string.Empty;
        public DateTime Fecha { get; set; } = DateTime.UtcNow;

        // Relación con cliente
        public int ClienteId { get; set; }
        public Cliente? Cliente { get; set; }

        // Totales
        public decimal TotalBase { get; set; }
        public decimal TotalIva { get; set; }
        public decimal Total { get; set; }

        public bool Activa { get; set; } = true;

        // Navegación a líneas
        public List<FacturaLinea> Lineas { get; set; } = new();
    }
    
}

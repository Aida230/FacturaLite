using System.Text.Json.Serialization;

namespace FacturaLite.Api.Domain.Entities
{
    public class FacturaLinea
    {
        public int Id { get; set; }

        public int FacturaId { get; set; }

        [JsonIgnore]
        public Factura? Factura { get; set; }

        public int ProductoId { get; set; }
        public Producto? Producto { get; set; }

        public string Descripcion { get; set; } = string.Empty;

        public decimal Cantidad { get; set; } = 1m;
        public decimal PrecioUnitario { get; set; }
        public decimal IvaPorcentaje { get; set; }

        public decimal ImporteBase { get; set; }
        public decimal ImporteIva { get; set; }
        public decimal ImporteTotal { get; set; }
    }
}

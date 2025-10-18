namespace FacturaLite.Api.Domain.Entities
{
    // Representa un cliente de nuestro sistema de facturación.
    // EF Core mapeará esta clase a una tabla (por convención: "Clientes").
    public class Cliente
    {
        // Clave primaria (por convención EF detecta "Id" como PK).
        public int Id { get; set; }

        // Nombre del cliente (razón social o nombre comercial).
        public string Nombre { get; set; } = string.Empty;

        // Email de contacto (para enviar facturas).
        public string? Email { get; set; }

        // NIF/CIF del cliente (identificación fiscal).
        public string? Nif { get; set; }

        // Teléfono de contacto.
        public string? Telefono { get; set; }

        // Dirección (opcional).
        public string? Direccion { get; set; }

        // Fecha de alta (por defecto ahora en UTC).
        public DateTime FechaAlta { get; set; } = DateTime.UtcNow;

        // Estado lógico (evitamos borrados físicos).
        public bool Activo { get; set; } = true;
    }
}

using FacturaLite.Api.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FacturaLite.Api.Infrastructure.Persistence
{
    // DbContext = "cerebro" de EF Core.
    // Mantiene el vínculo entre nuestras clases (Cliente, Factura, etc.)
    // y las tablas de la base de datos.
    public class AppDbContext : DbContext
    {
        // El constructor recibe opciones (proveedor, cadena de conexión, etc.)
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        // Cada DbSet<T> representa una tabla.
        // Por convención, este DbSet se mapeará a una tabla "Clientes".
        public DbSet<Cliente> Clientes => Set<Cliente>();
        public DbSet<Producto> Productos => Set<Producto>();


        // Aquí podríamos afinar el mapeo (nombres de tablas/columnas, índices, etc.)
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Ejemplo de configuración mínima (opcional por ahora):
            // modelBuilder.Entity<Cliente>().Property(c => c.Nombre).HasMaxLength(200).IsRequired();
        }
    }
}

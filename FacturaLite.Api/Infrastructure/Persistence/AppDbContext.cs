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
        public DbSet<Factura> Facturas => Set<Factura>();
        public DbSet<FacturaLinea> FacturasLineas => Set<FacturaLinea>();



        // Aquí podríamos afinar el mapeo (nombres de tablas/columnas, índices, etc.)
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // === Configuración de precisión para decimales (dinero) ===
            modelBuilder.Entity<Producto>()
                .Property(p => p.PrecioUnitario)
                .HasPrecision(18, 2);
            modelBuilder.Entity<Producto>()
                .Property(p => p.IvaPorcentaje)
                .HasPrecision(5, 2);

            modelBuilder.Entity<FacturaLinea>()
                .Property(l => l.Cantidad)
                .HasPrecision(18, 2);
            modelBuilder.Entity<FacturaLinea>()
                .Property(l => l.PrecioUnitario)
                .HasPrecision(18, 2);
            modelBuilder.Entity<FacturaLinea>()
                .Property(l => l.IvaPorcentaje)
                .HasPrecision(5, 2);
            modelBuilder.Entity<FacturaLinea>()
                .Property(l => l.ImporteBase)
                .HasPrecision(18, 2);
            modelBuilder.Entity<FacturaLinea>()
                .Property(l => l.ImporteIva)
                .HasPrecision(18, 2);
            modelBuilder.Entity<FacturaLinea>()
                .Property(l => l.ImporteTotal)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Factura>()
                .Property(f => f.TotalBase)
                .HasPrecision(18, 2);
            modelBuilder.Entity<Factura>()
                .Property(f => f.TotalIva)
                .HasPrecision(18, 2);
            modelBuilder.Entity<Factura>()
                .Property(f => f.Total)
                .HasPrecision(18, 2);
        }
    }
}

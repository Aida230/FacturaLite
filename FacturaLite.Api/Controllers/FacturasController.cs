using FacturaLite.Api.Domain.Entities;
using FacturaLite.Api.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FacturaLite.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // => /api/facturas
    public class FacturasController : ControllerBase
    {
        private readonly AppDbContext _db;
        public FacturasController(AppDbContext db) => _db = db;

        // -------- DTOs de entrada --------
        public record CrearFacturaLineaDto(int ProductoId, decimal Cantidad);
        public record CrearFacturaDto(int ClienteId, List<CrearFacturaLineaDto> Lineas);

        // POST /api/facturas
        // Crea una factura: trae datos de producto (precio/IVA), calcula líneas y totales.
        [HttpPost]
        public async Task<ActionResult<Factura>> Post([FromBody] CrearFacturaDto dto)
        {
            // Validaciones mínimas
            if (dto.Lineas is null || dto.Lineas.Count == 0)
                return BadRequest("La factura debe tener al menos una línea.");

            var cliente = await _db.Clientes.FindAsync(dto.ClienteId);
            if (cliente is null || !cliente.Activo) return BadRequest("Cliente no válido.");

            // Número simple por año: AAAA-#### (secuencial dentro del año actual)
            var año = DateTime.UtcNow.Year;
            var countEsteAño = await _db.Facturas.CountAsync(f => f.Fecha.Year == año);
            var numero = $"{año}-{(countEsteAño + 1).ToString("D4")}";

            var factura = new Factura
            {
                Numero = numero,
                Fecha = DateTime.UtcNow,
                ClienteId = dto.ClienteId,
                Activa = true,
                Lineas = new List<FacturaLinea>()
            };

            decimal totalBase = 0m;
            decimal totalIva = 0m;

            // Construimos líneas trayendo datos del producto
            foreach (var l in dto.Lineas)
            {
                if (l.Cantidad <= 0) return BadRequest("Cantidad debe ser mayor que 0.");

                var prod = await _db.Productos.FirstOrDefaultAsync(p => p.Id == l.ProductoId && p.Activo);
                if (prod is null) return BadRequest($"Producto {l.ProductoId} no válido.");

                var precio = prod.PrecioUnitario;
                var ivaPct = prod.IvaPorcentaje;
                var baseLinea = Math.Round(l.Cantidad * precio, 2);
                var ivaLinea = Math.Round(baseLinea * (ivaPct / 100m), 2);
                var totalLinea = Math.Round(baseLinea + ivaLinea, 2);

                factura.Lineas.Add(new FacturaLinea
                {
                    ProductoId = prod.Id,
                    Descripcion = string.IsNullOrWhiteSpace(prod.Nombre) ? $"Producto {prod.Id}" : prod.Nombre,
                    Cantidad = l.Cantidad,
                    PrecioUnitario = precio,
                    IvaPorcentaje = ivaPct,
                    ImporteBase = baseLinea,
                    ImporteIva = ivaLinea,
                    ImporteTotal = totalLinea
                });

                totalBase += baseLinea;
                totalIva += ivaLinea;
            }

            factura.TotalBase = Math.Round(totalBase, 2);
            factura.TotalIva = Math.Round(totalIva, 2);
            factura.Total = Math.Round(factura.TotalBase + factura.TotalIva, 2);

            _db.Facturas.Add(factura);
            await _db.SaveChangesAsync();

            // Cargamos navegación para devolver factura con líneas y cliente
            await _db.Entry(factura).Reference(f => f.Cliente).LoadAsync();
            await _db.Entry(factura).Collection(f => f.Lineas).LoadAsync();

            return CreatedAtAction(nameof(GetById), new { id = factura.Id }, factura);
        }

        // GET /api/facturas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Factura>>> Get()
        {
            var list = await _db.Facturas
                                .Where(f => f.Activa)
                                .Include(f => f.Cliente)
                                .Include(f => f.Lineas)
                                .OrderByDescending(f => f.Fecha)
                                .ToListAsync();
            return Ok(list);
        }

        // GET /api/facturas/{id}
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Factura>> GetById(int id)
        {
            var f = await _db.Facturas
                             .Include(x => x.Cliente)
                             .Include(x => x.Lineas)
                             .FirstOrDefaultAsync(x => x.Id == id && x.Activa);
            if (f is null) return NotFound();
            return Ok(f);
        }

        // DELETE /api/facturas/{id} (soft-delete)
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var f = await _db.Facturas.FindAsync(id);
            if (f is null || !f.Activa) return NotFound();
            f.Activa = false;
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}

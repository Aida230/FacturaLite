using FacturaLite.Api.Domain.Entities;
using FacturaLite.Api.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FacturaLite.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // => /api/productos
    public class ProductosController : ControllerBase
    {
        private readonly AppDbContext _db;
        public ProductosController(AppDbContext db) => _db = db;

        // GET /api/productos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Producto>>> Get()
        {
            var list = await _db.Productos
                                .Where(p => p.Activo)
                                .OrderBy(p => p.Nombre)
                                .ToListAsync();
            return Ok(list);
        }

        // GET /api/productos/{id}
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Producto>> GetById(int id)
        {
            var p = await _db.Productos.FindAsync(id);
            if (p is null || !p.Activo) return NotFound();
            return Ok(p);
        }

        // DTOs para entrada (crear/actualizar)
        public record CrearProductoDto(string Nombre, string? Sku, decimal PrecioUnitario, decimal IvaPorcentaje);
        public record ActualizarProductoDto(string? Nombre, string? Sku, decimal? PrecioUnitario, decimal? IvaPorcentaje);

        // POST /api/productos
        [HttpPost]
        public async Task<ActionResult<Producto>> Post([FromBody] CrearProductoDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Nombre))
                return BadRequest("El nombre es obligatorio.");
            if (dto.PrecioUnitario < 0)
                return BadRequest("El precio no puede ser negativo.");
            if (dto.IvaPorcentaje < 0)
                return BadRequest("El IVA no puede ser negativo.");

            var p = new Producto
            {
                Nombre = dto.Nombre.Trim(),
                Sku = string.IsNullOrWhiteSpace(dto.Sku) ? null : dto.Sku.Trim(),
                PrecioUnitario = dto.PrecioUnitario,
                IvaPorcentaje = dto.IvaPorcentaje,
                Activo = true
            };

            _db.Productos.Add(p);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = p.Id }, p);
        }

        // PUT /api/productos/{id}
        [HttpPut("{id:int}")]
        public async Task<ActionResult<Producto>> Put(int id, [FromBody] ActualizarProductoDto dto)
        {
            var p = await _db.Productos.FindAsync(id);
            if (p is null || !p.Activo) return NotFound();

            if (!string.IsNullOrWhiteSpace(dto.Nombre)) p.Nombre = dto.Nombre.Trim();
            if (dto.Sku is not null) p.Sku = string.IsNullOrWhiteSpace(dto.Sku) ? null : dto.Sku.Trim();
            if (dto.PrecioUnitario is not null)
            {
                if (dto.PrecioUnitario < 0) return BadRequest("El precio no puede ser negativo.");
                p.PrecioUnitario = dto.PrecioUnitario.Value;
            }
            if (dto.IvaPorcentaje is not null)
            {
                if (dto.IvaPorcentaje < 0) return BadRequest("El IVA no puede ser negativo.");
                p.IvaPorcentaje = dto.IvaPorcentaje.Value;
            }

            await _db.SaveChangesAsync();
            return Ok(p);
        }

        // DELETE /api/productos/{id} (soft-delete)
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var p = await _db.Productos.FindAsync(id);
            if (p is null || !p.Activo) return NotFound();

            p.Activo = false;
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}

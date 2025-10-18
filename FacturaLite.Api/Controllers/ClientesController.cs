using FacturaLite.Api.Domain.Entities;
using FacturaLite.Api.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FacturaLite.Api.Controllers
{
    // Marca este controlador como API (mejor manejo de validación y respuestas automáticas)
    [ApiController]
    // La ruta final será /api/clientes (porque [controller] => "clientes")
    [Route("api/[controller]")]
    public class ClientesController : ControllerBase
    {
        private readonly AppDbContext _db;

        // Inyectamos el DbContext (EF Core).
        public ClientesController(AppDbContext db)
        {
            _db = db;
        }

        // GET /api/clientes
        // Lista todos los clientes (solo activos por simplicidad).
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cliente>>> Get()
        {
            var clientes = await _db.Clientes
                                    .Where(c => c.Activo)
                                    .OrderBy(c => c.Nombre)
                                    .ToListAsync();

            return Ok(clientes); // 200 OK con el listado
        }

        // DTO de entrada para crear (evitamos exponer toda la entidad al crear)
        public record CrearClienteDto(string Nombre, string? Email, string? Nif, string? Telefono, string? Direccion);

        // POST /api/clientes
        // Crea un cliente nuevo con validación mínima.
        [HttpPost]
        public async Task<ActionResult<Cliente>> Post([FromBody] CrearClienteDto dto)
        {
            // Validación mínima: nombre obligatorio
            if (string.IsNullOrWhiteSpace(dto.Nombre))
                return BadRequest("El nombre es obligatorio.");

            var cliente = new Cliente
            {
                Nombre = dto.Nombre.Trim(),
                Email = string.IsNullOrWhiteSpace(dto.Email) ? null : dto.Email.Trim(),
                Nif = string.IsNullOrWhiteSpace(dto.Nif) ? null : dto.Nif.Trim(),
                Telefono = string.IsNullOrWhiteSpace(dto.Telefono) ? null : dto.Telefono.Trim(),
                Direccion = string.IsNullOrWhiteSpace(dto.Direccion) ? null : dto.Direccion.Trim(),
                FechaAlta = DateTime.UtcNow,
                Activo = true
            };

            _db.Clientes.Add(cliente);
            await _db.SaveChangesAsync(); // guarda en SQLite

            // Devuelve 201 Created con la entidad creada
            return CreatedAtAction(nameof(GetById), new { id = cliente.Id }, cliente);
        }

        // GET /api/clientes/{id}
        // Recupera un cliente por Id (para que CreatedAtAction tenga destino).
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Cliente>> GetById(int id)
        {
            var cliente = await _db.Clientes.FindAsync(id);
            if (cliente is null || !cliente.Activo)
                return NotFound();

            return Ok(cliente);
        }
    }
}

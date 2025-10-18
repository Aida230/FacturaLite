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

        // DTO para actualizar (todos opcionales; solo cambia lo que envías)
        public record ActualizarClienteDto(string? Nombre, string? Email, string? Nif, string? Telefono, string? Direccion);

        [HttpPut("{id:int}")]
        public async Task<ActionResult<Cliente>> Put(int id, [FromBody] ActualizarClienteDto dto)
        {
            var cliente = await _db.Clientes.FindAsync(id);
            if (cliente is null || !cliente.Activo)
                return NotFound(); // 404 si no existe o está inactivo

            // Si se envía un campo, se actualiza; si viene null, se deja como está
            if (!string.IsNullOrWhiteSpace(dto.Nombre)) cliente.Nombre = dto.Nombre.Trim();
            if (dto.Email is not null) cliente.Email = string.IsNullOrWhiteSpace(dto.Email) ? null : dto.Email.Trim();
            if (dto.Nif is not null) cliente.Nif = string.IsNullOrWhiteSpace(dto.Nif) ? null : dto.Nif.Trim();
            if (dto.Telefono is not null) cliente.Telefono = string.IsNullOrWhiteSpace(dto.Telefono) ? null : dto.Telefono.Trim();
            if (dto.Direccion is not null) cliente.Direccion = string.IsNullOrWhiteSpace(dto.Direccion) ? null : dto.Direccion.Trim();

            await _db.SaveChangesAsync(); // guarda cambios
            return Ok(cliente);           // 200 con el cliente modificado
        }


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
        // DELETE /api/clientes/{id}
        // "Borrado suave": marca el cliente como inactivo en lugar de eliminarlo.
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var cliente = await _db.Clientes.FindAsync(id);
            if (cliente is null || !cliente.Activo)
                return NotFound(); // 404 si no existe o ya estaba inactivo

            cliente.Activo = false;       // lo desactivamos
            await _db.SaveChangesAsync(); // guardamos cambio

            return NoContent(); // 204 sin contenido (operación OK)
        }

    }
}

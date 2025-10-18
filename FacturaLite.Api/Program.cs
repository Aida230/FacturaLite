using FacturaLite.Api.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

// Crea el "constructor" de la aplicación. 
// Aquí se configuran los servicios que la app usará: controladores, base de datos, CORS, Swagger, etc.
var builder = WebApplication.CreateBuilder(args);

// Registramos el DbContext y le decimos que use SQLite con la conexión del appsettings.json
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers(); // habilita controladores [ApiController]

// ---------------------------------------------------------
// 🧩 Sección: Registro de servicios
// ---------------------------------------------------------

// Habilita la generación automática de documentación (OpenAPI/Swagger).
builder.Services.AddEndpointsApiExplorer();

// Agrega el generador de Swagger para poder probar la API desde el navegador.
builder.Services.AddSwaggerGen();

// Compila la configuración anterior y crea la aplicación lista para ejecutarse.
var app = builder.Build();

// ---------------------------------------------------------
// 🧩 Sección: Configuración del pipeline (flujo de peticiones)
// ---------------------------------------------------------

// Si estamos en entorno de desarrollo (Development), activa Swagger.
// Esto permite acceder a la interfaz web de Swagger en: https://localhost:<puerto>/swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();    // Genera el JSON de la documentación
    app.UseSwaggerUI();  // Muestra la interfaz gráfica de Swagger
}

// Redirige automáticamente las peticiones HTTP a HTTPS
// (por ejemplo, de http://localhost:5000 → https://localhost:7000)
app.UseHttpsRedirection();

// ---------------------------------------------------------
// 🧩 Sección: Endpoint de ejemplo
// ---------------------------------------------------------

// Creamos un arreglo con posibles descripciones del clima (solo para ejemplo)
var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild",
    "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

// Definimos una ruta GET (endpoint) en "/weatherforecast".
// Cuando alguien accede a esa URL, se ejecuta el bloque de código que devuelve datos simulados.
app.MapGet("/weatherforecast", () =>
{
    // Genera 5 días de pronóstico de forma aleatoria.
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)), // Fecha
            Random.Shared.Next(-20, 55),                        // Temperatura en °C
            summaries[Random.Shared.Next(summaries.Length)]      // Descripción aleatoria
        ))
        .ToArray();

    // Retorna el resultado como un arreglo JSON.
    return forecast;
})
.WithName("GetWeatherForecast") // Nombre del endpoint (útil para Swagger)
.WithOpenApi();                 // Lo incluye en la documentación Swagger



// ---------------------------------------------------------
// 🧩 Sección: Inicio de la aplicación!!!!!!!!!!!!!!!!!!!!
// ---------------------------------------------------------

app.MapControllers(); // mapea rutas de los controladores a HTTP

// Arranca la aplicación web y la deja escuchando en el puerto configurado.
app.Run();

// ---------------------------------------------------------
// 🧩 Record (tipo de dato inmutable para el ejemplo)
// ---------------------------------------------------------

// Define un tipo (record) llamado WeatherForecast.
// Representa los datos que devuelve el endpoint: fecha, temperatura, resumen del clima.
record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    // Propiedad calculada: convierte la temperatura de °C a °F.
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}

using FacturaLite.Api.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

// Crea el "constructor" de la aplicación. 
// Aquí se configuran los servicios que la app usará: controladores, base de datos, CORS, Swagger, etc.
var builder = WebApplication.CreateBuilder(args);

// CORS de desarrollo: permite que el front (Vite en 5173) llame a la API
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", policy =>
        policy.WithOrigins("http://localhost:5173", "https://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

builder.Services.AddControllers();

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
//app.UseHttpsRedirection();

app.UseCors("DevCors");

// ---------------------------------------------------------
// 🧩 Sección: Inicio de la aplicación!!!!!!!!!!!!!!!!!!!!
// ---------------------------------------------------------

app.MapControllers(); // mapea rutas de los controladores a HTTP

// Arranca la aplicación web y la deja escuchando en el puerto configurado.
app.Run();



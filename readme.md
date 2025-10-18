Mini proyecto para TeamSystem.
PASOS:
-crear la solución: dotnet new sln -n FacturaLite
  🟢 Esto crea un archivo llamado FacturaLite.sln
  📁 Ese archivo es como la “carpeta madre” que agrupa todos los proyectos.
-crear el proyecto de la API: dotnet new webapi -n FacturaLite.Api
  Esto creará una carpeta nueva llamada FacturaLite.Api/, con dentro:
    Controllers/
    Program.cs
    FacturaLite.Api.csproj
    ...
-conectar el proyecto con la solución: dotnet sln FacturaLite.sln add FacturaLite.Api/FacturaLite.Api.csproj

Vamos a examinar el archivo Program.cs:
  -Este es el corazon de la aplicación.
    Aquí se:
    -configura cómo arranca la API,
    -se registran servicios,
    -se activan herramientas como Swagger,
y al final se pone a escuchar el servidor (como un app.listen() en Node).

-Ejecutar el Api: dotnet run --project FacturaLite.Api
  ver /swagger en el localhost y comprobar que funciona el backend.

Pasos hacia datos reales:
Preparar Entity Framework Core (con SQLite) y crear el modelo cliente
    Por qué SQLite?
    No tienes que instalar nada extra (es un archivo .db).
    Para desarrollo es perfecto. Si luego quieres SQL Server, se cambia fácil.
  1) Instalar paquetes EF Core (en la terminal, dentro de FacturaLite)
        dotnet add FacturaLite.Api package Microsoft.EntityFrameworkCore
        dotnet add FacturaLite.Api package Microsoft.EntityFrameworkCore.Sqlite
        dotnet add FacturaLite.Api package Microsoft.EntityFrameworkCore.Tools
Estos paquetes permiten:
  EntityFrameworkCore: ORM (mapear clases ↔ tablas)
  Sqlite: proveedor de BD
  Tools: poder ejecutar migraciones con dotnet ef

Siguientepaso:
  -crear la clase cliente
  -crear infraestructura
  -crear conexion: en el archivo FacturaLite.Api/appsettings.json tenemos que añadir este bloque
          "ConnectionStrings": {
            "DefaultConnection": "Data Source=FacturaLite.db"
          }


          el archivo completo debe verse asi:
            {
            "Logging": {
              "LogLevel": {
                "Default": "Information",
                "Microsoft.AspNetCore": "Warning"
              }
            },
            "AllowedHosts": "*",
            "ConnectionStrings": {
              "DefaultConnection": "Data Source=FacturaLite.db"
            }
          }
          🧠 Esto crea una base de datos llamada FacturaLite.db (un archivo) en la carpeta del proyecto.

2️⃣ Registrar el AppDbContext en Program.cs

Migración inicial y crear FacturaLite.db
1️⃣ Crear la migración
En la terminal, dentro de la carpeta del proyecto principal (FacturaLite): dotnet ef migrations add InitClientes --project FacturaLite.Api
  📦 Esto generará una nueva carpeta en FacturaLite.Api/Migrations con:
      Un archivo con código C# que representa la estructura de tu tabla Clientes.
      Un ModelSnapshot, que guarda el “estado actual” del modelo.
2️⃣ Aplicar la migración (crear la BD real): dotnet ef database update --project FacturaLite.Api
  Esto:
    Creará un archivo llamado FacturaLite.db en FacturaLite.Api/
    Ejecutará el SQL que creó EF para generar la tabla Clientes.
3️⃣ Verificación
Ve al explorador de VS Code y comprueba que:
  Existe la carpeta FacturaLite.Api/Migrations
  Y que aparece el archivo FacturaLite.db

Mini-paso: crear el endpoint /api/clientes (listar y crear)
1) Habilitar controladores en Program.cs
Abre FacturaLite.Api/Program.cs y añade estas dos cosas:
  Arriba del archivo (si no están):
    using Microsoft.EntityFrameworkCore;
    using FacturaLite.Api.Infrastructure.Persistence;
Después de var builder = WebApplication.CreateBuilder(args);, agrega:
  builder.Services.AddControllers(); // habilita controladores [ApiController]
Antes de app.Run();, agrega:
  app.MapControllers(); // mapea rutas de los controladores a HTTP
Con esto, la API ya entiende clases “Controller”.
2) Crear el controlador ClientesController
  Crea el archivo:
    FacturaLite.Api/Controllers/ClientesController.cs
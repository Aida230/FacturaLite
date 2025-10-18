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
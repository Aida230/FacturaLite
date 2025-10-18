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

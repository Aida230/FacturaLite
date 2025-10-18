// Cabecera con título y espacio para acciones (opcional)
export default function Header() {
  return (
    <header className="border-b bg-white/60 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          <span className="text-indigo-600">Factura</span>Lite
        </h1>
        <nav className="text-sm text-gray-600">
          {/* Si añades más páginas, pon enlaces aquí */}
          <span className="px-2 py-1 rounded-md bg-gray-100">Clientes</span>
        </nav>
      </div>
    </header>
  );
}

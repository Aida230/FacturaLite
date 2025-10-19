export default function Header() {
  return (
    <header className="sticky top-0 z-20 backdrop-blur-md bg-blue-50 border-b border-white/60">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-indigo-600 shadow-md shadow-indigo-600/30" />
          <span className="text-lg sm:text-xl font-semibold tracking-tight">
            <span className="text-indigo-600">Factura</span>Lite
          </span>
        </div>

        <nav className="hidden sm:flex items-center gap-2 text-sm">
          <span className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100">
            Clientes
          </span>
          {/* Cuando tengas más páginas, añade aquí “tabs” con estado activo/inactivo */}
        </nav>
      </div>
    </header>
  );
}

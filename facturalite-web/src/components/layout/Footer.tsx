export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-5xl px-4 py-4 text-xs text-gray-500 flex items-center justify-between">
        <span>© {new Date().getFullYear()} FacturaLite</span>
        <span>Mini ERP de práctica</span>
      </div>
    </footer>
  );
}

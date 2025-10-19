export default function Footer() {
  return (
    <footer className="border-t bg-black border-white/20 backdrop-blur">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 md:px-8 h-14 flex items-center justify-between text-xs text-slate-600">
        <span>© {new Date().getFullYear()} FacturaLite</span>
        <span>Mini ERP — demo</span>
      </div>
    </footer>
  );
}

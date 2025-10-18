import { useEffect, useState } from "react";
import { apiGet, apiPost } from "./api";

// Tipos que reflejan tu API
type Cliente = {
  id: number;
  nombre: string;
  email?: string;
  nif?: string;
  telefono?: string;
  direccion?: string;
  fechaAlta: string;
  activo: boolean;
};

function App() {
  // Estado para la lista
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Formulario mínimo para crear un cliente rápido
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");

  // Cargar clientes al montar
  useEffect(() => {
    (async () => {
      try {
        // Llama a tu endpoint GET /api/clientes
        const data = await apiGet<Cliente[]>("/api/clientes");
        setClientes(data);
      } catch (err: any) {
        setError(err.message ?? "Error desconocido");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Crear cliente mínimo (usa POST /api/clientes)
  async function crearCliente() {
    try {
      setError(null);
      const nuevo = await apiPost<{ nombre: string; email?: string }, Cliente>(
        "/api/clientes",
        { nombre, email: email || undefined }
      );
      // Añadimos el nuevo a la lista local
      setClientes((prev) => [nuevo, ...prev]);
      setNombre("");
      setEmail("");
    } catch (err: any) {
      setError(err.message ?? "Error al crear cliente");
    }
  }

  if (loading) return <p style={{ padding: 16 }}>Cargando clientes…</p>;
  if (error) return <p style={{ padding: 16, color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ maxWidth: 720, margin: "24px auto", padding: 16 }}>
      <h1>FacturaLite · Clientes</h1>

      {/* Formulario simple */}
      <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
        <input
          placeholder="Nombre (requerido)"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />
        <input
          placeholder="Email (opcional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={crearCliente} disabled={!nombre.trim()}>
          Crear
        </button>
      </div>

      {/* Lista */}
      {clientes.length === 0 ? (
        <p>No hay clientes aún.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {clientes.map((c) => (
            <li key={c.id} style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8, marginBottom: 8 }}>
              <strong>#{c.id} — {c.nombre}</strong>
              {c.email ? <div>Email: {c.email}</div> : null}
              <div>Alta: {new Date(c.fechaAlta).toLocaleString()}</div>
              <div>Activo: {c.activo ? "Sí" : "No"}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;

import { useState } from "react";
import { useClientes } from "../hooks/useClientes";
import Button from "../components/shared/Button";

export default function ClientesPage() {
  const { clientes, loading, error, crear, borrar, setError } = useClientes();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");

  if (loading) return <p className="p-4">Cargando clientes…</p>;
  if (error)
    return (
      <div className="p-4">
        <div className="mb-3 rounded-lg border border-red-200 bg-red-50 text-red-700 p-3">
          {error}
        </div>
        <Button variant="ghost" onClick={() => setError(null)}>
          Limpiar error
        </Button>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Tarjeta del formulario */}
      <div className="bg-white rounded-xl border p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Nuevo cliente</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            className="flex-1 h-10 rounded-lg border px-3 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Nombre (requerido)"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            className="flex-1 h-10 rounded-lg border px-3 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Email (opcional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            onClick={async () => {
              await crear({ nombre, email: email || undefined });
              setNombre("");
              setEmail("");
            }}
            disabled={!nombre.trim()}
          >
            Crear
          </Button>
        </div>
      </div>

      {/* Lista de clientes */}
      <div className="bg-white rounded-xl border p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-3">
          Clientes ({clientes.length})
        </h2>

        {clientes.length === 0 ? (
          <p className="text-sm text-gray-500">No hay clientes aún.</p>
        ) : (
          <ul className="space-y-3">
            {clientes.map((c) => (
              <li
                key={c.id}
                className="rounded-lg border p-3 flex items-start justify-between gap-4"
              >
                <div>
                  <div className="font-medium">
                    #{c.id} — {c.nombre}
                  </div>
                  {c.email && (
                    <div className="text-sm text-gray-600">Email: {c.email}</div>
                  )}
                  <div className="text-xs text-gray-500">
                    Alta: {new Date(c.fechaAlta).toLocaleString()}
                  </div>
                  <div className="text-xs">
                    Activo:{" "}
                    <span className={c.activo ? "text-green-600" : "text-red-600"}>
                      {c.activo ? "Sí" : "No"}
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  <Button variant="danger" onClick={() => borrar(c.id)}>
                    Eliminar
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

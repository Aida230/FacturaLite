import { useEffect, useState } from "react";
import type { Cliente } from "../types/cliente";
import {
  listarClientes,
  crearCliente,
  eliminarCliente,
  type CrearClienteDto,
} from "../services/clientes.service";

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // cargar al montar
  useEffect(() => {
    (async () => {
      try {
        const data = await listarClientes();
        setClientes(data);
      } catch (err: any) {
        setError(err?.message ?? "Error al cargar clientes");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function crear(dto: CrearClienteDto) {
    try {
      setError(null);
      const nuevo = await crearCliente(dto);
      setClientes((prev) => [nuevo, ...prev]);
    } catch (err: any) {
      setError(err?.message ?? "Error al crear cliente");
    }
  }

  async function borrar(id: number) {
    try {
      setError(null);
      await eliminarCliente(id);
      setClientes((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      setError(err?.message ?? "Error al eliminar cliente");
    }
  }

  return { clientes, loading, error, crear, borrar, setError };
}

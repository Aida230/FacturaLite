// src/services/clientes.service.ts
// Capa de servicios (dominio) para Clientes: aquí sí va el CRUD.

import { request } from "../api/client";
import type { Cliente } from "../types/cliente.ts";

export async function listarClientes(): Promise<Cliente[]> {
  return request<Cliente[]>("/api/clientes");
}

export type CrearClienteDto = {
  nombre: string;
  email?: string;
  nif?: string;
  telefono?: string;
  direccion?: string;
};

export async function crearCliente(dto: CrearClienteDto): Promise<Cliente> {
  return request<Cliente>("/api/clientes", { method: "POST", body: dto });
}

export type ActualizarClienteDto = Partial<Omit<CrearClienteDto, "nombre">> & { nombre?: string };

export async function actualizarCliente(id: number, dto: ActualizarClienteDto): Promise<Cliente> {
  return request<Cliente>(`/api/clientes/${id}`, { method: "PUT", body: dto });
}

export async function eliminarCliente(id: number): Promise<void> {
  await request<void>(`/api/clientes/${id}`, { method: "DELETE" });
}

// src/types/cliente.ts
// Define la forma del objeto Cliente tal como lo devuelve tu API .NET

export type Cliente = {
  id: number;
  nombre: string;
  email?: string;
  nif?: string;
  telefono?: string;
  direccion?: string;
  fechaAlta: string; // se recibe como cadena ISO
  activo: boolean;
};

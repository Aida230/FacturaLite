// src/api/error.ts
// Helpers para transformar errores en mensajes para el usuario (sin clases)

import { isApiError } from "./client";

export function toUserMessage(err: unknown): string {
  if (isApiError(err)) {
    // Personaliza por status
    if (err.status === 400) return extractMessage(err.body) ?? "Petición inválida.";
    if (err.status === 404) return extractMessage(err.body) ?? "No encontrado.";
    if (err.status >= 500) return "Error del servidor. Inténtalo más tarde.";

    return extractMessage(err.body) ?? `Error HTTP ${err.status}`;
  }

  if (err instanceof Error) return err.message;
  return "Error desconocido";
}

function extractMessage(body: unknown): string | null {
  if (body && typeof body === "object" && "message" in body) {
    const val = (body as Record<string, unknown>)["message"];
    if (typeof val === "string" && val.trim()) return val;
  }
  return null;
}

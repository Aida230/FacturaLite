// src/api/client.ts
// Transporte HTTP funcional (sin clases).
// - Lee baseURL del .env
// - Expone `request` de bajo nivel
// - Define un tipo de error y helpers para detectarlo

export type ApiError = {
  name: "ApiError";
  status: number;
  message: string;
  body?: unknown;
};

export function makeApiError(status: number, statusText: string, body?: unknown): ApiError {
  return {
    name: "ApiError",
    status,
    message: `HTTP ${status} ${statusText}`,
    body,
  };
}

export function isApiError(err: unknown): err is ApiError {
  return typeof err === "object" && err !== null && (err as any).name === "ApiError";
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
if (!BASE_URL) {
  throw new Error("VITE_API_BASE_URL no está definida en .env");
}

type RequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown; // objeto JS; se serializa si existe
};

// Función de bajo nivel: hace la petición y devuelve JSON (si lo hay).
export async function request<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const hasBody = options.body !== undefined;

  const res = await fetch(url, {
    method: options.method ?? "GET",
    headers: {
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      ...(options.headers ?? {}),
    },
    body: hasBody ? JSON.stringify(options.body) : undefined,
  });

  const text = await res.text();
  const maybeJson = text ? safeParseJson(text) : undefined;

  if (!res.ok) {
    // Lanzamos objeto-error plano (ApiError) sin clases
    throw makeApiError(res.status, res.statusText, maybeJson ?? text);
  }

  // 204 No Content
  if (!text) return undefined as T;

  return maybeJson as T;
}

function safeParseJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

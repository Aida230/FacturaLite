// Pequeño cliente HTTP con fetch y baseURL desde .env
const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
console.log("BASE_URL =", BASE_URL); // <-- temporal para verificar

// Función helper para GET genérico
export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    // Lanza un error si la respuesta no es 2xx
    const text = await res.text();
    throw new Error(`GET ${path} -> ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

// Función helper para POST genérico con body JSON
export async function apiPost<TReq, TRes>(path: string, body: TReq): Promise<TRes> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`POST ${path} -> ${res.status}: ${text}`);
  }
  return res.json() as Promise<TRes>;
}

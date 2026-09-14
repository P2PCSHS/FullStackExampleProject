/**
 * Tiny wrapper around fetch for talking to the Flask backend.
 *
 * In development, Vite proxies "/api" to Flask (see vite.config.ts).
 * In production, nginx does the same (see nginx.conf), so the base URL
 * is simply "/api" everywhere unless VITE_API_URL overrides it.
 */
const BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`)
  if (!response.ok) {
    throw new Error(`Request to ${path} failed with status ${response.status}`)
  }
  return (await response.json()) as T
}

export interface HelloResponse {
  message: string
}

export function getHello(): Promise<HelloResponse> {
  return apiGet<HelloResponse>('/hello')
}

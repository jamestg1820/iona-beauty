/**
 * Helpers compartidos para Facebook Pixel + CAPI
 * Centraliza la generación de IDs y la lectura de cookies
 */

/** Lee una cookie del navegador por nombre */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

/**
 * Genera un external_id consistente por sesión.
 * Usa _fbp si existe, sino genera uno basado en timestamp + fingerprint
 * y lo guarda en sessionStorage para reutilizarlo.
 */
export function getExternalId(): string {
  if (typeof window === 'undefined') return '';
  
  // Prioridad 1: usar _fbp como external_id (más consistente)
  const fbp = getCookie('_fbp');
  if (fbp) return fbp;

  // Prioridad 2: reusar ID de sesión si ya existe
  const stored = sessionStorage.getItem('_ext_id');
  if (stored) return stored;

  // Prioridad 3: generar uno nuevo y guardarlo
  const newId = `ext_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  sessionStorage.setItem('_ext_id', newId);
  return newId;
}

/**
 * Construye el payload de clientData para enviar a /api/meta-events
 * Incluye siempre: fbp, fbc, external_id y la URL actual del navegador
 */
export function buildClientData(extra?: { email?: string; phone?: string }) {
  return {
    fbp: getCookie('_fbp'),
    fbc: getCookie('_fbc'),
    external_id: getExternalId(),
    email: extra?.email || undefined,
    phone: extra?.phone || undefined,
  };
}

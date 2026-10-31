// Utilidades de formato. Las fechas viajan como texto "yyyy-MM-dd" para no depender de la zona horaria.

export function fromISO(iso: string): Date | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return undefined;
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function toISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatDate(iso: string): string {
  const date = fromISO(iso);
  if (!date) return "—";
  return date.toLocaleDateString("es-PE", { day: "numeric", month: "short", year: "numeric" });
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export function timeAgo(at: number): string {
  const minutes = Math.round((Date.now() - at) / 60000);
  if (minutes < 1) return "Ahora";
  if (minutes < 60) return `Hace ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `Hace ${hours} ${hours === 1 ? "hora" : "horas"}`;
  const days = Math.round(hours / 24);
  return `Hace ${days} ${days === 1 ? "día" : "días"}`;
}

// Colores de las etiquetas según el estado o la prioridad
export const STATUS_STYLE: Record<string, string> = {
  Planificado: "border-sky-400/40 bg-sky-400/10 text-sky-300",
  Pendiente: "border-sky-400/40 bg-sky-400/10 text-sky-300",
  "En progreso": "border-amber-400/40 bg-amber-400/10 text-amber-300",
  "En revisión": "border-violet-400/40 bg-violet-400/10 text-violet-300",
  Completado: "border-primary/40 bg-primary/10 text-primary",
};

export const PRIORITY_STYLE: Record<string, string> = {
  Baja: "border-border bg-muted/60 text-muted-foreground",
  Media: "border-sky-400/40 bg-sky-400/10 text-sky-300",
  Alta: "border-amber-400/40 bg-amber-400/10 text-amber-300",
  Urgente: "border-destructive/50 bg-destructive/10 text-destructive",
};

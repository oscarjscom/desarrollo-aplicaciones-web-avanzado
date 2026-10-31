"use client";

import type { ReactNode } from "react";
import { CircleAlert, CircleCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Spinner } from "@/components/ui/spinner";

/* ---------- Lleva la vista al primer campo con problema ---------- */
export function focusFirstError() {
  requestAnimationFrame(() => {
    const el = document.querySelector<HTMLElement>('form [aria-invalid="true"]');
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
    el?.focus({ preventScroll: true });
  });
}

/* ---------- Campo con etiqueta y mensaje de error ---------- */
export function Field({
  id,
  label,
  required,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

/* ---------- Alert de validación del formulario ---------- */
export function ErrorAlert({ errors }: { errors: Record<string, string> }) {
  const count = Object.keys(errors).length;
  if (count === 0) return null;
  return (
    <Alert variant="destructive" role="alert">
      <CircleAlert />
      <AlertTitle>Revisa el formulario</AlertTitle>
      <AlertDescription>
        {count === 1 ? "Hay 1 campo con un problema." : `Hay ${count} campos con problemas.`} Corrígelos y vuelve a intentar.
      </AlertDescription>
    </Alert>
  );
}

export function SuccessAlert({ message }: { message: string }) {
  if (!message) return null;
  return (
    <Alert role="status">
      <CircleCheck className="text-primary" />
      <AlertTitle>Listo</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

/* ---------- Botón que muestra el Spinner mientras se envía ---------- */
export function SubmitButton({ pending, children, pendingText = "Guardando…" }: { pending: boolean; children: ReactNode; pendingText?: string }) {
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Spinner /> {pendingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}

/* ---------- Pantalla de carga con Spinner ---------- */
export function Loading({ text = "Cargando datos…" }: { text?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-24 text-muted-foreground" role="status">
      <Spinner className="size-5 text-primary" />
      {text}
    </div>
  );
}

/* ---------- Confirmación antes de eliminar ---------- */
export function ConfirmDelete({
  open,
  onOpenChange,
  title,
  description,
  pending,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  pending: boolean;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={(next) => !pending && onOpenChange(next)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={pending}
            onClick={(event) => {
              event.preventDefault(); // el diálogo se cierra cuando termina la petición
              onConfirm();
            }}
          >
            {pending ? (
              <>
                <Spinner /> Eliminando…
              </>
            ) : (
              "Eliminar"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/* ---------- Paginación numerada ---------- */
export function ListPagination({ page, pages, onChange }: { page: number; pages: number; onChange: (page: number) => void }) {
  if (pages <= 1) return null;

  // 1 … 4 5 6 … 10
  const items: (number | "gap-start" | "gap-end")[] = [];
  for (let p = 1; p <= pages; p++) {
    if (p === 1 || p === pages || Math.abs(p - page) <= 1) items.push(p);
    else if (p < page && items[items.length - 1] !== "gap-start") items.push("gap-start");
    else if (p > page && items[items.length - 1] !== "gap-end") items.push("gap-end");
  }

  const go = (target: number) => (event: React.MouseEvent) => {
    event.preventDefault();
    if (target >= 1 && target <= pages) onChange(target);
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={go(page - 1)}
            aria-disabled={page === 1}
            className={page === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        {items.map((item) =>
          typeof item === "number" ? (
            <PaginationItem key={item}>
              <PaginationLink href="#" isActive={item === page} onClick={go(item)}>
                {item}
              </PaginationLink>
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationEllipsis />
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={go(page + 1)}
            aria-disabled={page === pages}
            className={page === pages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

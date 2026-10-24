"use client";

import { useEffect, useState } from "react";
import type { CharacterResponse } from "@/types/rickmorty";
import { TEXT_MAX, validateText } from "@/lib/validation";
import CharacterCard from "./CharacterCard";

// Búsqueda en CSR: lo que se pide depende de lo que el usuario escribe, así que solo el navegador
// puede saberlo. useState guarda los filtros y useEffect pide los datos cada vez que cambian.

interface Outcome {
  key: string; // a qué búsqueda pertenece este resultado
  data?: CharacterResponse;
  error?: string;
}

const STATUS_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "alive", label: "Vivo" },
  { value: "dead", label: "Muerto" },
  { value: "unknown", label: "Desconocido" },
];
const GENDER_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "female", label: "Mujer" },
  { value: "male", label: "Hombre" },
  { value: "genderless", label: "Sin género" },
  { value: "unknown", label: "Desconocido" },
];
const SUGGESTIONS = ["Rick", "Morty", "Summer", "Beth", "Jerry"];

const inputClass =
  "mt-1 h-12 w-full border-0 border-b-2 border-k-border bg-transparent px-0 text-xl font-bold uppercase tracking-tighter text-k-fg placeholder:text-k-muted-fg/60 focus:border-k-accent focus-visible:outline-none md:text-2xl";
const labelClass = "block text-xs font-bold uppercase tracking-widest text-k-muted-fg md:text-sm";

export default function SearchCharacters() {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [gender, setGender] = useState("");
  const [page, setPage] = useState(1);
  const [debounced, setDebounced] = useState({ name: "", type: "" });
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  // Validación en el cliente, mientras se escribe (el servidor la repite al recibir la petición)
  const nameCheck = validateText(name, "Nombre");
  const typeCheck = validateText(type, "Tipo");
  const activeName = validateText(debounced.name, "Nombre");
  const activeType = validateText(debounced.type, "Tipo");
  const valid = activeName.ok && activeType.ok;
  const hasFilter = Boolean(activeName.value || activeType.value || status || gender);

  const key = valid && hasFilter ? `${activeName.value}|${activeType.value}|${status}|${gender}|${page}` : "";

  // Espera 400 ms desde la última tecla para no pedir datos en cada letra
  useEffect(() => {
    const timer = setTimeout(() => setDebounced({ name, type }), 400);
    return () => clearTimeout(timer);
  }, [name, type]);

  // Pide los resultados cada vez que cambia la búsqueda, un filtro o la página
  useEffect(() => {
    if (!key) return;
    const controller = new AbortController();

    const search = async () => {
      const params = new URLSearchParams({ page: String(page) });
      if (activeName.value) params.set("name", activeName.value);
      if (activeType.value) params.set("type", activeType.value);
      if (status) params.set("status", status);
      if (gender) params.set("gender", gender);

      try {
        const res = await fetch(`/api/characters?${params}`, { signal: controller.signal });
        const body = await res.json();
        if (!res.ok) {
          setOutcome({ key, error: body.message ?? "No se pudo completar la búsqueda" });
          return;
        }
        setOutcome({ key, data: body as CharacterResponse });
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setOutcome({ key, error: "No se pudo completar la búsqueda" });
      }
    };
    search();

    return () => controller.abort();
  }, [key, page, activeName.value, activeType.value, status, gender]);

  const loading = key !== "" && outcome?.key !== key;
  const current = outcome && outcome.key === key ? outcome : null;
  const totalPages = current?.data?.info.pages ?? 0;
  const message = !nameCheck.ok ? nameCheck.message : !typeCheck.ok ? typeCheck.message : "";

  const reset = () => {
    setName("");
    setType("");
    setStatus("");
    setGender("");
    setPage(1);
  };

  return (
    <div>
      {/* Filtros */}
      <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="filtro-nombre" className={labelClass}>
            Nombre
          </label>
          <input
            id="filtro-nombre"
            type="search"
            value={name}
            maxLength={TEXT_MAX}
            autoComplete="off"
            spellCheck={false}
            placeholder="Rick, Morty…"
            onChange={(event) => {
              setName(event.target.value);
              setPage(1);
            }}
            aria-invalid={!nameCheck.ok}
            aria-describedby={message ? "filtros-ayuda" : undefined}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="filtro-tipo" className={labelClass}>
            Tipo
          </label>
          <input
            id="filtro-tipo"
            type="search"
            value={type}
            maxLength={TEXT_MAX}
            autoComplete="off"
            spellCheck={false}
            placeholder="Parasite, Robot…"
            onChange={(event) => {
              setType(event.target.value);
              setPage(1);
            }}
            aria-invalid={!typeCheck.ok}
            aria-describedby={message ? "filtros-ayuda" : undefined}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="filtro-estado" className={labelClass}>
            Estado
          </label>
          <select
            id="filtro-estado"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
            className="mt-1 h-12 w-full border-2 border-k-border bg-k-bg/80 px-3 text-base font-bold uppercase tracking-tighter text-k-fg focus:border-k-accent focus-visible:outline-none"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filtro-genero" className={labelClass}>
            Género
          </label>
          <select
            id="filtro-genero"
            value={gender}
            onChange={(event) => {
              setGender(event.target.value);
              setPage(1);
            }}
            className="mt-1 h-12 w-full border-2 border-k-border bg-k-bg/80 px-3 text-base font-bold uppercase tracking-tighter text-k-fg focus:border-k-accent focus-visible:outline-none"
          >
            {GENDER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Solo aparece si hay un error de validación o algún filtro que limpiar */}
      {(message || name || type || status || gender) && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          {message ? (
            <p id="filtros-ayuda" role="alert" className="text-sm font-bold uppercase tracking-widest text-k-accent">
              {message}
            </p>
          ) : (
            <span />
          )}
          {(name || type || status || gender) && (
            <button
              type="button"
              onClick={reset}
              className="h-10 border-2 border-k-border px-4 text-sm font-bold uppercase tracking-tighter text-k-fg transition-colors duration-200 hover:bg-k-fg hover:text-black"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      {/* Sugerencias: solo mientras no hay ningún filtro */}
      {!hasFilter && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-k-muted-fg">Prueba con</span>
          {SUGGESTIONS.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => {
                setName(term);
                setPage(1);
              }}
              className="h-9 border-2 border-k-border px-4 text-sm font-bold uppercase tracking-tighter text-k-fg transition-colors duration-200 hover:border-k-accent hover:bg-k-accent hover:text-black"
            >
              {term}
            </button>
          ))}
        </div>
      )}

      {/* Resultados */}
      <div className="mt-6" aria-live="polite" aria-busy={loading}>
        {loading && (
          <div className="grid grid-cols-2 border-l-2 border-t-2 border-k-border sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="k-motion animate-pulse border-b-2 border-r-2 border-k-border bg-k-bg/75 p-3 md:p-4">
                <div className="mb-3 h-10 w-14 bg-k-muted" />
                <div className="aspect-square w-full bg-k-muted" />
                <div className="mt-3 h-6 w-3/4 bg-k-muted" />
              </div>
            ))}
          </div>
        )}

        {current?.error && (
          <div role="alert" className="border-2 border-k-accent p-6 md:p-10">
            <p className="text-2xl font-bold uppercase leading-none tracking-tighter text-k-accent md:text-4xl">
              Algo salió mal
            </p>
            <p className="mt-4 text-lg text-k-muted-fg">{current.error}</p>
          </div>
        )}

        {current?.data && current.data.results.length === 0 && (
          <div className="border-2 border-k-border p-6 md:p-10">
            <p className="text-2xl font-bold uppercase leading-none tracking-tighter text-k-fg md:text-4xl">
              Sin resultados
            </p>
            <p className="mt-4 text-lg text-k-muted-fg">Ningún personaje cumple esos filtros. Prueba con otros.</p>
          </div>
        )}

        {current?.data && current.data.results.length > 0 && (
          <>
            <p className="mb-5 text-sm font-bold uppercase tracking-widest text-k-muted-fg md:text-base">
              {current.data.info.count.toLocaleString("es-PE")} personajes · página {page} de {totalPages}
            </p>
            <div className="grid grid-cols-2 border-l-2 border-t-2 border-k-border sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {current.data.results.map((character) => (
                <CharacterCard key={character.id} character={character} />
              ))}
            </div>

            {totalPages > 1 && (
              <nav className="mt-8 flex items-center justify-between gap-4" aria-label="Paginación de resultados">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="h-14 border-2 border-k-border px-8 text-sm font-bold uppercase tracking-tighter text-k-fg transition-colors duration-200 hover:bg-k-fg hover:text-black disabled:pointer-events-none disabled:opacity-50"
                >
                  ← Anterior
                </button>
                <span className="text-sm font-bold uppercase tracking-widest text-k-muted-fg">
                  {page} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="h-14 bg-k-accent px-8 text-sm font-bold uppercase tracking-tighter text-black transition-transform hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
                >
                  Siguiente →
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useStore } from "@/lib/store";
import { LANGUAGES, PAGE_SIZES, TIMEZONES, type Settings } from "@/lib/types";
import { hasErrors, validateSettings } from "@/lib/validation";
import { ErrorAlert, Field, focusFirstError, SubmitButton } from "./FormParts";
import { SelectField, toOptions } from "./SelectField";
import { useNotice } from "./useNotice";

export function SettingsTab() {
  const { settings, saveSettings } = useStore();
  const { notice, show } = useNotice();

  const [form, setForm] = useState<Settings>(settings);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

  const dirty = JSON.stringify(form) !== JSON.stringify(settings);

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      const next = { ...e };
      delete next[key];
      return next;
    });
  };

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const local = validateSettings(form);
    if (hasErrors(local)) {
      setErrors(local);
      focusFirstError();
      return;
    }

    setPending(true);
    const result = await saveSettings(form);
    setPending(false);

    if (!result.ok) {
      setErrors(result.errors ?? { form: "No se pudo guardar" });
      focusFirstError();
      return;
    }
    show(result.message ?? "Configuración guardada");
  }

  return (
    <div className="grid max-w-3xl gap-4">
      {notice}

      <div>
        <h2 className="text-xl font-semibold">Configuración</h2>
        <p className="text-sm text-muted-foreground">Ajusta cómo se ve y cómo se comporta tu espacio de trabajo.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="grid gap-4">
        <ErrorAlert errors={errors} />

        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
            <CardDescription>Datos básicos del espacio.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field id="s-workspace" label="Nombre del espacio" required error={errors.workspace}>
              <Input id="s-workspace" value={form.workspace} maxLength={40} aria-invalid={!!errors.workspace} onChange={(e) => set("workspace", e.target.value)} />
            </Field>
            <Field id="s-email" label="Correo de contacto" required error={errors.email}>
              <Input id="s-email" type="email" value={form.email} aria-invalid={!!errors.email} onChange={(e) => set("email", e.target.value)} />
            </Field>
            <Field id="s-language" label="Idioma" error={errors.language}>
              <SelectField id="s-language" value={form.language} options={toOptions(LANGUAGES)} invalid={!!errors.language} onChange={(v) => set("language", v as Settings["language"])} />
            </Field>
            <Field id="s-timezone" label="Zona horaria" error={errors.timezone}>
              <SelectField id="s-timezone" value={form.timezone} options={toOptions(TIMEZONES)} invalid={!!errors.timezone} onChange={(v) => set("timezone", v as Settings["timezone"])} />
            </Field>
            <Field id="s-pagesize" label="Filas por página" error={errors.pageSize} hint="Se aplica a las tablas de Tareas y Equipo">
              <SelectField
                id="s-pagesize"
                value={String(form.pageSize)}
                invalid={!!errors.pageSize}
                options={PAGE_SIZES.map((n) => ({ value: String(n), label: `${n} filas` }))}
                onChange={(v) => set("pageSize", Number(v) as Settings["pageSize"])}
              />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notificaciones</CardTitle>
            <CardDescription>Elige cómo quieres enterarte de los cambios.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <SwitchRow id="s-notify-email" title="Avisos por correo" text="Recibe un correo cuando te asignen una tarea." checked={form.notifyEmail} onChange={(v) => set("notifyEmail", v)} />
            <Separator />
            <SwitchRow id="s-notify-push" title="Avisos en el navegador" text="Muestra notificaciones mientras trabajas." checked={form.notifyPush} onChange={(v) => set("notifyPush", v)} />
            <Separator />
            <SwitchRow id="s-weekly" title="Resumen semanal" text="Un correo cada lunes con el avance de tus proyectos." checked={form.weeklySummary} onChange={(v) => set("weeklySummary", v)} />
          </CardContent>
        </Card>

        <div className="flex flex-wrap justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={pending || !dirty}
            onClick={() => {
              setForm(settings);
              setErrors({});
            }}
          >
            <RotateCcw /> Descartar cambios
          </Button>
          <SubmitButton pending={pending}>Guardar configuración</SubmitButton>
        </div>
      </form>
    </div>
  );
}

function SwitchRow({ id, title, text, checked, onChange }: { id: string; title: string; text: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <label htmlFor={id} className="text-sm">
        <span className="font-medium">{title}</span>
        <span className="block text-muted-foreground">{text}</span>
      </label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useStore } from "@/lib/store";
import { ROLES, type Member, type MemberInput } from "@/lib/types";
import { hasErrors, validateMember } from "@/lib/validation";
import { DatePicker } from "./DatePicker";
import { ErrorAlert, Field, focusFirstError, SubmitButton } from "./FormParts";
import { SelectField, toOptions } from "./SelectField";

const NO_PROJECT = "none"; // las listas no admiten un valor vacío

interface MemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member?: Member;
  onSaved: (message: string) => void;
}

export function MemberDialog({ open, onOpenChange, member, onSaved }: MemberDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{member ? "Editar miembro" : "Nuevo miembro"}</DialogTitle>
          <DialogDescription>
            {member ? `Código ${member.userId}` : "El código de usuario se asigna automáticamente al guardar."}
          </DialogDescription>
        </DialogHeader>
        <MemberForm member={member} onClose={() => onOpenChange(false)} onSaved={onSaved} />
      </DialogContent>
    </Dialog>
  );
}

function MemberForm({ member, onClose, onSaved }: { member?: Member; onClose: () => void; onSaved: (message: string) => void }) {
  const { projects, createMember, updateMember } = useStore();

  const [form, setForm] = useState<MemberInput>(() => ({
    role: member?.role ?? "Desarrollador",
    name: member?.name ?? "",
    email: member?.email ?? "",
    position: member?.position ?? "",
    birthdate: member?.birthdate ?? "",
    phone: member?.phone ?? "",
    projectId: member?.projectId ?? "",
    isActive: member?.isActive ?? true,
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

  const set = <K extends keyof MemberInput>(key: K, value: MemberInput[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      const next = { ...e };
      delete next[key];
      return next;
    });
  };

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const local = validateMember(form);
    if (hasErrors(local)) {
      setErrors(local);
      focusFirstError();
      return;
    }

    setPending(true);
    const result = member ? await updateMember(member.userId, form) : await createMember(form);
    setPending(false);

    if (!result.ok) {
      setErrors(result.errors ?? { form: "No se pudo guardar" });
      focusFirstError();
      return;
    }
    onSaved(result.message ?? "Miembro guardado");
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4">
      <ErrorAlert errors={errors} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="m-name" label="Nombre completo" required error={errors.name}>
          <Input id="m-name" value={form.name} maxLength={60} placeholder="Ej. María García" aria-invalid={!!errors.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field id="m-email" label="Correo" required error={errors.email}>
          <Input id="m-email" type="email" value={form.email} placeholder="nombre@empresa.com" aria-invalid={!!errors.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field id="m-position" label="Cargo" required error={errors.position}>
          <Input id="m-position" value={form.position} maxLength={50} placeholder="Ej. Frontend Developer" aria-invalid={!!errors.position} onChange={(e) => set("position", e.target.value)} />
        </Field>
        <Field id="m-role" label="Rol" required error={errors.role}>
          <SelectField id="m-role" value={form.role} options={toOptions(ROLES)} invalid={!!errors.role} onChange={(v) => set("role", v as MemberInput["role"])} />
        </Field>
        <Field id="m-birth" label="Fecha de nacimiento" required error={errors.birthdate}>
          <DatePicker id="m-birth" birthdate value={form.birthdate} invalid={!!errors.birthdate} onChange={(v) => set("birthdate", v)} />
        </Field>
        <Field id="m-phone" label="Teléfono" required error={errors.phone} hint="9 dígitos, empieza con 9">
          <Input id="m-phone" inputMode="numeric" value={form.phone} maxLength={9} placeholder="987654321" aria-invalid={!!errors.phone} onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))} />
        </Field>
        <Field id="m-project" label="Proyecto" error={errors.projectId}>
          <SelectField
            id="m-project"
            value={form.projectId || NO_PROJECT}
            invalid={!!errors.projectId}
            options={[{ value: NO_PROJECT, label: "Sin proyecto" }, ...projects.map((p) => ({ value: p.id, label: p.name }))]}
            onChange={(v) => set("projectId", v === NO_PROJECT ? "" : v)}
          />
        </Field>
        <div className="flex items-center justify-between rounded-lg border p-3 sm:mt-6">
          <label htmlFor="m-active" className="text-sm">
            Miembro activo
            <span className="block text-xs text-muted-foreground">Puede recibir tareas</span>
          </label>
          <Switch id="m-active" checked={form.isActive} onCheckedChange={(checked) => set("isActive", checked)} />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" disabled={pending} onClick={onClose}>
          Cancelar
        </Button>
        <SubmitButton pending={pending}>{member ? "Guardar cambios" : "Agregar miembro"}</SubmitButton>
      </DialogFooter>
    </form>
  );
}

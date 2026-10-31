"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { initials } from "@/lib/format";
import { useStore } from "@/lib/store";
import { CATEGORIES, PRIORITIES, PROJECT_STATUSES, type Project, type ProjectInput } from "@/lib/types";
import { hasErrors, validateProject } from "@/lib/validation";
import { DatePicker } from "./DatePicker";
import { ErrorAlert, Field, focusFirstError, SubmitButton } from "./FormParts";
import { SelectField, toOptions } from "./SelectField";

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project; // si viene, se edita; si no, se crea
  onSaved: (message: string) => void;
}

export function ProjectDialog({ open, onOpenChange, project, onSaved }: ProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{project ? "Editar proyecto" : "Nuevo proyecto"}</DialogTitle>
          <DialogDescription>
            {project ? "Cambia los datos y guarda los cambios." : "Completa los datos del proyecto y elige a su equipo."}
          </DialogDescription>
        </DialogHeader>
        {/* El formulario se monta al abrir, así siempre empieza limpio */}
        <ProjectForm project={project} onClose={() => onOpenChange(false)} onSaved={onSaved} />
      </DialogContent>
    </Dialog>
  );
}

function ProjectForm({ project, onClose, onSaved }: { project?: Project; onClose: () => void; onSaved: (message: string) => void }) {
  const { members, createProject, updateProject } = useStore();

  const [form, setForm] = useState<ProjectInput>(() => ({
    name: project?.name ?? "",
    description: project?.description ?? "",
    category: project?.category ?? "Desarrollo Web",
    priority: project?.priority ?? "Media",
    status: project?.status ?? "Planificado",
    dueDate: project?.dueDate ?? "",
    memberIds: project ? members.filter((m) => m.projectId === project.id).map((m) => m.userId) : [],
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

  const set = <K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      const next = { ...e };
      delete next[key];
      return next;
    });
  };

  const toggleMember = (userId: string, checked: boolean) =>
    set("memberIds", checked ? [...form.memberIds, userId] : form.memberIds.filter((id) => id !== userId));

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    // 1) Validación en el navegador
    const local = validateProject(form);
    if (hasErrors(local)) {
      setErrors(local);
      focusFirstError();
      return;
    }

    // 2) Petición simulada: el servidor valida otra vez antes de guardar
    setPending(true);
    const result = project ? await updateProject(project.id, form) : await createProject(form);
    setPending(false);

    if (!result.ok) {
      setErrors(result.errors ?? { form: "No se pudo guardar" });
      focusFirstError();
      return;
    }
    onSaved(result.message ?? "Proyecto guardado");
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4">
      <ErrorAlert errors={errors} />

      <Field id="p-name" label="Nombre del proyecto" required error={errors.name}>
        <Input
          id="p-name"
          value={form.name}
          maxLength={60}
          placeholder="Ej. Plataforma de reservas"
          aria-invalid={!!errors.name}
          onChange={(e) => set("name", e.target.value)}
        />
      </Field>

      <Field id="p-description" label="Descripción" error={errors.description} hint={`${form.description.length}/200`}>
        <Textarea
          id="p-description"
          value={form.description}
          maxLength={200}
          rows={2}
          placeholder="Breve descripción del proyecto"
          aria-invalid={!!errors.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="p-category" label="Categoría" required error={errors.category}>
          <SelectField id="p-category" value={form.category} options={toOptions(CATEGORIES)} invalid={!!errors.category} onChange={(v) => set("category", v as ProjectInput["category"])} />
        </Field>
        <Field id="p-priority" label="Prioridad" required error={errors.priority}>
          <SelectField id="p-priority" value={form.priority} options={toOptions(PRIORITIES)} invalid={!!errors.priority} onChange={(v) => set("priority", v as ProjectInput["priority"])} />
        </Field>
        <Field id="p-status" label="Estado" required error={errors.status}>
          <SelectField id="p-status" value={form.status} options={toOptions(PROJECT_STATUSES)} invalid={!!errors.status} onChange={(v) => set("status", v as ProjectInput["status"])} />
        </Field>
        <Field id="p-due" label="Fecha de entrega" required error={errors.dueDate}>
          <DatePicker id="p-due" value={form.dueDate} invalid={!!errors.dueDate} onChange={(v) => set("dueDate", v)} />
        </Field>
      </div>

      <fieldset className="grid gap-2">
        <legend className="mb-1 text-sm font-medium">Miembros del equipo</legend>
        <div className="grid max-h-32 gap-1 overflow-y-auto rounded-lg border p-2">
          {members.map((member) => {
            const taken = member.projectId !== "" && member.projectId !== project?.id;
            return (
              <label key={member.userId} htmlFor={`p-m-${member.userId}`} className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 hover:bg-muted">
                <Checkbox
                  id={`p-m-${member.userId}`}
                  checked={form.memberIds.includes(member.userId)}
                  onCheckedChange={(checked) => toggleMember(member.userId, checked === true)}
                />
                <span className="flex size-7 items-center justify-center rounded-full bg-secondary text-xs font-medium">{initials(member.name)}</span>
                <span className="flex-1 text-sm">
                  {member.name}
                  <span className="block text-xs text-muted-foreground">{member.position}</span>
                </span>
                {taken && <span className="text-xs text-muted-foreground">En otro proyecto</span>}
              </label>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">Un miembro pertenece a un solo proyecto: si ya está en otro, pasará a este.</p>
        {errors.memberIds && <p role="alert" className="text-xs text-destructive">{errors.memberIds}</p>}
      </fieldset>

      <DialogFooter>
        <Button type="button" variant="outline" disabled={pending} onClick={onClose}>
          Cancelar
        </Button>
        <SubmitButton pending={pending}>{project ? "Guardar cambios" : "Crear proyecto"}</SubmitButton>
      </DialogFooter>
    </form>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/lib/store";
import { PRIORITIES, TASK_STATUSES, type Task, type TaskInput } from "@/lib/types";
import { hasErrors, validateTask } from "@/lib/validation";
import { DatePicker } from "./DatePicker";
import { ErrorAlert, Field, focusFirstError, SubmitButton } from "./FormParts";
import { SelectField, toOptions } from "./SelectField";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
  onSaved: (message: string) => void;
}

export function TaskDialog({ open, onOpenChange, task, onSaved }: TaskDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{task ? "Editar tarea" : "Nueva tarea"}</DialogTitle>
          <DialogDescription>{task ? `Código ${task.id}` : "Describe la tarea y asígnala a alguien del equipo."}</DialogDescription>
        </DialogHeader>
        <TaskForm task={task} onClose={() => onOpenChange(false)} onSaved={onSaved} />
      </DialogContent>
    </Dialog>
  );
}

function TaskForm({ task, onClose, onSaved }: { task?: Task; onClose: () => void; onSaved: (message: string) => void }) {
  const { projects, members, createTask, updateTask } = useStore();

  const [form, setForm] = useState<TaskInput>(() => ({
    description: task?.description ?? "",
    projectId: task?.projectId ?? "",
    status: task?.status ?? "Pendiente",
    priority: task?.priority ?? "Media",
    userId: task?.userId ?? "",
    dateline: task?.dateline ?? "",
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

  const set = <K extends keyof TaskInput>(key: K, value: TaskInput[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      const next = { ...e };
      delete next[key];
      return next;
    });
  };

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const local = validateTask(form);
    if (hasErrors(local)) {
      setErrors(local);
      focusFirstError();
      return;
    }

    setPending(true);
    const result = task ? await updateTask(task.id, form) : await createTask(form);
    setPending(false);

    if (!result.ok) {
      setErrors(result.errors ?? { form: "No se pudo guardar" });
      focusFirstError();
      return;
    }
    onSaved(result.message ?? "Tarea guardada");
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4">
      <ErrorAlert errors={errors} />

      <Field id="t-description" label="Descripción" required error={errors.description} hint={`${form.description.length}/120`}>
        <Textarea
          id="t-description"
          value={form.description}
          maxLength={120}
          rows={2}
          placeholder="Ej. Diseñar la pantalla de inicio"
          aria-invalid={!!errors.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="t-project" label="Proyecto" required error={errors.projectId}>
          <SelectField
            id="t-project"
            value={form.projectId}
            placeholder="Elige un proyecto"
            invalid={!!errors.projectId}
            options={projects.map((p) => ({ value: p.id, label: p.name }))}
            onChange={(v) => set("projectId", v)}
          />
        </Field>
        <Field id="t-user" label="Asignada a" required error={errors.userId}>
          <SelectField
            id="t-user"
            value={form.userId}
            placeholder="Elige a un miembro"
            invalid={!!errors.userId}
            options={members.filter((m) => m.isActive || m.userId === task?.userId).map((m) => ({ value: m.userId, label: m.name }))}
            onChange={(v) => set("userId", v)}
          />
        </Field>
        <Field id="t-status" label="Estado" required error={errors.status}>
          <SelectField id="t-status" value={form.status} options={toOptions(TASK_STATUSES)} invalid={!!errors.status} onChange={(v) => set("status", v as TaskInput["status"])} />
        </Field>
        <Field id="t-priority" label="Prioridad" required error={errors.priority}>
          <SelectField id="t-priority" value={form.priority} options={toOptions(PRIORITIES)} invalid={!!errors.priority} onChange={(v) => set("priority", v as TaskInput["priority"])} />
        </Field>
        <Field id="t-dateline" label="Fecha límite" required error={errors.dateline}>
          <DatePicker id="t-dateline" value={form.dateline} invalid={!!errors.dateline} onChange={(v) => set("dateline", v)} />
        </Field>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" disabled={pending} onClick={onClose}>
          Cancelar
        </Button>
        <SubmitButton pending={pending}>{task ? "Guardar cambios" : "Crear tarea"}</SubmitButton>
      </DialogFooter>
    </form>
  );
}

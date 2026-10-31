"use client";

import { useState } from "react";
import { ListChecks, Pencil, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate, PRIORITY_STYLE, STATUS_STYLE, toISO } from "@/lib/format";
import { useStore } from "@/lib/store";
import { TASK_STATUSES, type Task } from "@/lib/types";
import { ConfirmDelete, ListPagination } from "./FormParts";
import { SelectField } from "./SelectField";
import { TaskDialog } from "./TaskDialog";
import { useNotice } from "./useNotice";

const ALL = "all";

export function TasksTab() {
  const { tasks, projects, members, settings, deleteTask, setTaskStatus } = useStore();
  const { notice, show } = useNotice();

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [projectFilter, setProjectFilter] = useState(ALL);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Task | undefined>();
  const [toDelete, setToDelete] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  const filtered = tasks.filter(
    (t) => (statusFilter === ALL || t.status === statusFilter) && (projectFilter === ALL || t.projectId === projectFilter),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / settings.pageSize));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * settings.pageSize, current * settings.pageSize);

  const projectName = (id: string) => projects.find((p) => p.id === id)?.name ?? "—";
  const memberName = (id: string) => members.find((m) => m.userId === id)?.name ?? "Sin asignar";
  const today = toISO(new Date());

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    const result = await deleteTask(toDelete.id);
    setDeleting(false);
    setToDelete(null);
    if (result.ok) show(result.message ?? "Tarea eliminada");
  }

  async function toggleDone(task: Task, done: boolean) {
    setBusy(task.id);
    const result = await setTaskStatus(task.id, done ? "Completado" : "Pendiente");
    setBusy(null);
    if (result.ok) show(result.message ?? "Tarea actualizada");
  }

  return (
    <div className="grid gap-4">
      {notice}

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Tareas</h2>
          <p className="text-sm text-muted-foreground">
            {tasks.filter((t) => t.status === "Completado").length} completadas de {tasks.length}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SelectField
            id="f-status"
            className="w-40"
            value={statusFilter}
            options={[{ value: ALL, label: "Todos los estados" }, ...TASK_STATUSES.map((s) => ({ value: s, label: s }))]}
            onChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
          />
          <SelectField
            id="f-project"
            className="w-52"
            value={projectFilter}
            options={[{ value: ALL, label: "Todos los proyectos" }, ...projects.map((p) => ({ value: p.id, label: p.name }))]}
            onChange={(v) => {
              setProjectFilter(v);
              setPage(1);
            }}
          />
          <Button
            onClick={() => {
              setEditing(undefined);
              setFormOpen(true);
            }}
          >
            <Plus /> Nueva tarea
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <ListChecks className="size-10 text-muted-foreground" />
              <p className="font-medium">No hay tareas con estos filtros</p>
              <p className="text-sm text-muted-foreground">Cambia los filtros o crea una tarea nueva.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 pl-4">
                    <span className="sr-only">Completada</span>
                  </TableHead>
                  <TableHead>Tarea</TableHead>
                  <TableHead className="hidden lg:table-cell">Proyecto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="hidden sm:table-cell">Prioridad</TableHead>
                  <TableHead className="hidden md:table-cell">Asignada a</TableHead>
                  <TableHead>Fecha límite</TableHead>
                  <TableHead className="pr-4 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((t) => {
                  const done = t.status === "Completado";
                  const overdue = !done && t.dateline < today;
                  return (
                    <TableRow key={t.id}>
                      <TableCell className="pl-4">
                        <Checkbox
                          checked={done}
                          disabled={busy === t.id}
                          aria-label={`Marcar «${t.description}» como completada`}
                          onCheckedChange={(checked) => toggleDone(t, checked === true)}
                        />
                      </TableCell>
                      <TableCell className="max-w-64">
                        <p className={`truncate font-medium ${done ? "text-muted-foreground line-through" : ""}`}>{t.description}</p>
                        <p className="text-xs text-muted-foreground">{t.id}</p>
                      </TableCell>
                      <TableCell className="hidden max-w-48 truncate lg:table-cell">{projectName(t.projectId)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={STATUS_STYLE[t.status]}>{t.status}</Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="outline" className={PRIORITY_STYLE[t.priority]}>{t.priority}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{memberName(t.userId)}</TableCell>
                      <TableCell className={overdue ? "font-medium text-destructive" : ""}>
                        {formatDate(t.dateline)}
                        {overdue && <span className="block text-xs">Vencida</span>}
                      </TableCell>
                      <TableCell className="pr-4">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label={`Editar «${t.description}»`}
                            onClick={() => {
                              setEditing(t);
                              setFormOpen(true);
                            }}
                          >
                            <Pencil />
                          </Button>
                          <Button size="icon" variant="ghost" aria-label={`Eliminar «${t.description}»`} onClick={() => setToDelete(t)}>
                            <Trash2 className="text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ListPagination page={current} pages={pages} onChange={setPage} />

      <TaskDialog open={formOpen} onOpenChange={setFormOpen} task={editing} onSaved={show} />

      <ConfirmDelete
        open={toDelete !== null}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="¿Eliminar esta tarea?"
        description={`Se eliminará «${toDelete?.description ?? ""}». Esta acción no se puede deshacer.`}
        pending={deleting}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

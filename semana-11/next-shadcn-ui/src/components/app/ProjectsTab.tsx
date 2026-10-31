"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Eye, FolderOpen, Pencil, Plus, Trash2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { formatDate, initials, PRIORITY_STYLE, STATUS_STYLE } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { Project } from "@/lib/types";
import { ConfirmDelete, ListPagination } from "./FormParts";
import { ProjectDialog } from "./ProjectDialog";
import { useNotice } from "./useNotice";

const PER_PAGE = 6;

// Avance del proyecto = tareas completadas sobre tareas totales
function useProgress() {
  const { tasks } = useStore();
  return (project: Project) => {
    const own = tasks.filter((t) => t.projectId === project.id);
    if (own.length === 0) return project.status === "Completado" ? 100 : 0;
    return Math.round((own.filter((t) => t.status === "Completado").length / own.length) * 100);
  };
}

export function ProjectsTab() {
  const { projects, members, deleteProject } = useStore();
  const progressOf = useProgress();
  const { notice, show } = useNotice();

  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Project | undefined>();
  const [detailId, setDetailId] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  const pages = Math.max(1, Math.ceil(projects.length / PER_PAGE));
  const current = Math.min(page, pages);
  const visible = useMemo(() => projects.slice((current - 1) * PER_PAGE, current * PER_PAGE), [projects, current]);
  const detail = projects.find((p) => p.id === detailId);

  function openCreate() {
    setEditing(undefined);
    setFormOpen(true);
  }
  function openEdit(project: Project) {
    setDetailId(null);
    setEditing(project);
    setFormOpen(true);
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    const result = await deleteProject(toDelete.id);
    setDeleting(false);
    setToDelete(null);
    if (result.ok) show(result.message ?? "Proyecto eliminado");
  }

  return (
    <div className="grid gap-4">
      {notice}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Proyectos</h2>
          <p className="text-sm text-muted-foreground">
            {projects.length} {projects.length === 1 ? "proyecto" : "proyectos"} en total
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus /> Nuevo proyecto
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <FolderOpen className="size-10 text-muted-foreground" />
            <p className="font-medium">Todavía no hay proyectos</p>
            <p className="text-sm text-muted-foreground">Crea el primero para empezar a organizar el trabajo.</p>
            <Button onClick={openCreate}>
              <Plus /> Crear proyecto
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((project) => {
            const team = members.filter((m) => m.projectId === project.id);
            const progress = progressOf(project);
            return (
              <Card key={project.id} className="transition-colors hover:border-primary/50">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <CardTitle className="text-base leading-snug">{project.name}</CardTitle>
                      <CardDescription className="line-clamp-2 min-h-8">{project.description || "Sin descripción"}</CardDescription>
                    </div>
                    <Badge variant="outline" className={STATUS_STYLE[project.status]}>
                      {project.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <Badge variant="outline">{project.category}</Badge>
                    <Badge variant="outline" className={PRIORITY_STYLE[project.priority]}>
                      {project.priority}
                    </Badge>
                    <span className="ml-auto flex items-center gap-1 text-muted-foreground">
                      <CalendarDays className="size-3.5" /> {formatDate(project.dueDate)}
                    </span>
                  </div>

                  <div className="grid gap-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Avance</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex -space-x-2">
                        {team.slice(0, 4).map((m) => (
                          <span key={m.userId} title={m.name} className="flex size-7 items-center justify-center rounded-full border-2 border-card bg-secondary text-[0.65rem] font-medium text-foreground">
                            {initials(m.name)}
                          </span>
                        ))}
                      </div>
                      <span className="flex items-center gap-1">
                        <Users className="size-3.5" /> {team.length}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => setDetailId(project.id)}>
                        <Eye /> Ver detalles
                      </Button>
                      <Button size="icon" variant="ghost" aria-label={`Eliminar ${project.name}`} onClick={() => setToDelete(project)}>
                        <Trash2 className="text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <ListPagination page={current} pages={pages} onChange={setPage} />

      <ProjectDialog open={formOpen} onOpenChange={setFormOpen} project={editing} onSaved={show} />

      <ProjectDetails
        project={detail}
        progress={detail ? progressOf(detail) : 0}
        onClose={() => setDetailId(null)}
        onEdit={openEdit}
        onDelete={(p) => {
          setDetailId(null);
          setToDelete(p);
        }}
      />

      <ConfirmDelete
        open={toDelete !== null}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="¿Eliminar este proyecto?"
        description={`Se eliminará «${toDelete?.name ?? ""}» junto con sus tareas, y su equipo quedará sin proyecto. Esta acción no se puede deshacer.`}
        pending={deleting}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

function ProjectDetails({
  project,
  progress,
  onClose,
  onEdit,
  onDelete,
}: {
  project?: Project;
  progress: number;
  onClose: () => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}) {
  const { members, tasks } = useStore();
  const team = project ? members.filter((m) => m.projectId === project.id) : [];
  const own = project ? tasks.filter((t) => t.projectId === project.id) : [];

  return (
    <Dialog open={!!project} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        {project && (
          <>
            <DialogHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={STATUS_STYLE[project.status]}>{project.status}</Badge>
                <Badge variant="outline" className={PRIORITY_STYLE[project.priority]}>{project.priority}</Badge>
                <Badge variant="outline">{project.category}</Badge>
              </div>
              <DialogTitle className="text-xl">{project.name}</DialogTitle>
              <DialogDescription>{project.description || "Sin descripción"}</DialogDescription>
            </DialogHeader>

            <div className="grid gap-5">
              <div className="grid gap-3 sm:grid-cols-3">
                <Info label="Código" value={project.id} />
                <Info label="Entrega" value={formatDate(project.dueDate)} />
                <Info label="Tareas" value={`${own.filter((t) => t.status === "Completado").length} de ${own.length} completadas`} />
              </div>

              <div className="grid gap-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avance</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>

              <div className="grid gap-2">
                <h3 className="text-sm font-medium">Equipo ({team.length})</h3>
                {team.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Este proyecto todavía no tiene miembros.</p>
                ) : (
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {team.map((m) => (
                      <li key={m.userId} className="flex items-center gap-3 rounded-lg border p-2">
                        <span className="flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-medium">{initials(m.name)}</span>
                        <span className="text-sm">
                          {m.name}
                          <span className="block text-xs text-muted-foreground">{m.position}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="grid gap-2">
                <h3 className="text-sm font-medium">Tareas ({own.length})</h3>
                {own.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No hay tareas en este proyecto.</p>
                ) : (
                  <ul className="grid gap-1.5">
                    {own.map((t) => (
                      <li key={t.id} className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm">
                        <span>{t.description}</span>
                        <Badge variant="outline" className={STATUS_STYLE[t.status]}>{t.status}</Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <DialogFooter className="sm:justify-between">
              <Button variant="ghost" onClick={() => onDelete(project)}>
                <Trash2 className="text-destructive" /> Eliminar
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>Cerrar</Button>
                <Button onClick={() => onEdit(project)}>
                  <Pencil /> Editar
                </Button>
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium">{value}</p>
    </div>
  );
}

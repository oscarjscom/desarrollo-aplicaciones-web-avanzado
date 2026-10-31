"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate, initials } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { Member } from "@/lib/types";
import { ConfirmDelete, ListPagination } from "./FormParts";
import { MemberDialog } from "./MemberDialog";
import { useNotice } from "./useNotice";

export function TeamTab() {
  const { members, projects, settings, deleteMember, setMemberActive } = useStore();
  const { notice, show } = useNotice();

  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Member | undefined>();
  const [toDelete, setToDelete] = useState<Member | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);

  const pages = Math.max(1, Math.ceil(members.length / settings.pageSize));
  const current = Math.min(page, pages);
  const visible = members.slice((current - 1) * settings.pageSize, current * settings.pageSize);
  const projectName = (id: string) => projects.find((p) => p.id === id)?.name ?? "Sin proyecto";

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    const result = await deleteMember(toDelete.userId);
    setDeleting(false);
    setToDelete(null);
    if (result.ok) show(result.message ?? "Miembro eliminado");
  }

  async function toggle(member: Member, isActive: boolean) {
    setToggling(member.userId);
    const result = await setMemberActive(member.userId, isActive);
    setToggling(null);
    if (result.ok) show(result.message ?? "Estado actualizado");
  }

  return (
    <div className="grid gap-4">
      {notice}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Equipo</h2>
          <p className="text-sm text-muted-foreground">
            {members.filter((m) => m.isActive).length} activos de {members.length} miembros
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(undefined);
            setFormOpen(true);
          }}
        >
          <Plus /> Nuevo miembro
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {members.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <UserRound className="size-10 text-muted-foreground" />
              <p className="font-medium">No hay miembros en el equipo</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4">Miembro</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead className="hidden lg:table-cell">Cargo</TableHead>
                  <TableHead className="hidden md:table-cell">Proyecto</TableHead>
                  <TableHead className="hidden xl:table-cell">Teléfono</TableHead>
                  <TableHead className="hidden xl:table-cell">Nacimiento</TableHead>
                  <TableHead>Activo</TableHead>
                  <TableHead className="pr-4 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((m) => (
                  <TableRow key={m.userId}>
                    <TableCell className="pl-4">
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium">{initials(m.name)}</span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{m.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {m.userId} · {m.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{m.role}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{m.position}</TableCell>
                    <TableCell className="hidden max-w-48 truncate md:table-cell">{projectName(m.projectId)}</TableCell>
                    <TableCell className="hidden xl:table-cell">{m.phone}</TableCell>
                    <TableCell className="hidden xl:table-cell">{formatDate(m.birthdate)}</TableCell>
                    <TableCell>
                      <Switch
                        checked={m.isActive}
                        disabled={toggling === m.userId}
                        aria-label={`${m.name} activo`}
                        onCheckedChange={(checked) => toggle(m, checked)}
                      />
                    </TableCell>
                    <TableCell className="pr-4">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Editar a ${m.name}`}
                          onClick={() => {
                            setEditing(m);
                            setFormOpen(true);
                          }}
                        >
                          <Pencil />
                        </Button>
                        <Button size="icon" variant="ghost" aria-label={`Eliminar a ${m.name}`} onClick={() => setToDelete(m)}>
                          <Trash2 className="text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ListPagination page={current} pages={pages} onChange={setPage} />

      <MemberDialog open={formOpen} onOpenChange={setFormOpen} member={editing} onSaved={show} />

      <ConfirmDelete
        open={toDelete !== null}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="¿Eliminar a este miembro?"
        description={`${toDelete?.name ?? ""} saldrá del equipo y sus tareas quedarán sin asignar. Esta acción no se puede deshacer.`}
        pending={deleting}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { Activity, CircleCheckBig, Flame, FolderKanban, Users } from "lucide-react";
import { es } from "react-day-picker/locale";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatDate, fromISO, PRIORITY_STYLE, STATUS_STYLE, timeAgo, toISO } from "@/lib/format";
import { useStore } from "@/lib/store";

// Todas las cifras salen de los datos en memoria: si creas, editas o eliminas algo, aquí cambian.
export function SummaryTab() {
  const { projects, tasks, members, activity } = useStore();
  // El calendario arranca en la próxima entrega pendiente, para que se vea de inmediato qué viene
  const [day, setDay] = useState<Date | undefined>(() => {
    const todayIso = toISO(new Date());
    const next = tasks
      .filter((t) => t.status !== "Completado" && t.dateline >= todayIso)
      .map((t) => t.dateline)
      .sort()[0];
    return fromISO(next ?? todayIso);
  });

  const today = toISO(new Date());
  const done = tasks.filter((t) => t.status === "Completado").length;
  const donePct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const activeProjects = projects.filter((p) => p.status !== "Completado").length;
  const activeMembers = members.filter((m) => m.isActive).length;
  const urgent = tasks.filter((t) => t.priority === "Urgente" && t.status !== "Completado").length;
  const overdue = tasks.filter((t) => t.status !== "Completado" && t.dateline < today).length;

  const stats = [
    { title: "Proyectos activos", value: activeProjects, text: `${projects.length} en total`, icon: FolderKanban },
    { title: "Tareas completadas", value: `${done}/${tasks.length}`, text: `${donePct}% del total`, icon: CircleCheckBig },
    { title: "Miembros activos", value: activeMembers, text: `${members.length} en el equipo`, icon: Users },
    { title: "Tareas urgentes", value: urgent, text: overdue ? `${overdue} ${overdue === 1 ? "vencida" : "vencidas"}` : "Ninguna vencida", icon: Flame },
  ];

  const progressOf = (projectId: string, status: string) => {
    const own = tasks.filter((t) => t.projectId === projectId);
    if (own.length === 0) return status === "Completado" ? 100 : 0;
    return Math.round((own.filter((t) => t.status === "Completado").length / own.length) * 100);
  };

  const deadlines = tasks.filter((t) => t.status !== "Completado").map((t) => fromISO(t.dateline)!);
  const dueOnDay = day ? tasks.filter((t) => t.dateline === toISO(day)) : [];

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ title, value, text, icon: Icon }) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Icon className="size-4" />
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{value}</div>
              <p className="text-xs text-muted-foreground">{text}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Avance de los proyectos</CardTitle>
            <CardDescription>Tareas completadas sobre el total de cada proyecto.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {projects.length === 0 && <p className="text-sm text-muted-foreground">Todavía no hay proyectos.</p>}
            {projects.map((p) => {
              const progress = progressOf(p.id, p.status);
              return (
                <div key={p.id} className="grid gap-1.5">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate font-medium">{p.name}</span>
                    <span className="flex shrink-0 items-center gap-2">
                      <Badge variant="outline" className={STATUS_STYLE[p.status]}>{p.status}</Badge>
                      <span className="w-10 text-right text-muted-foreground">{progress}%</span>
                    </span>
                  </div>
                  <Progress value={progress} />
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Calendario de entregas</CardTitle>
            <CardDescription>Los días en verde tienen tareas pendientes.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Calendar
              mode="single"
              locale={es}
              selected={day}
              defaultMonth={day}
              onSelect={setDay}
              modifiers={{ entrega: deadlines }}
              modifiersClassNames={{ entrega: "font-bold text-primary underline underline-offset-4" }}
              className="mx-auto"
            />
            <div className="grid gap-2">
              <p className="text-sm font-medium">{day ? formatDate(toISO(day)) : "Elige un día"}</p>
              {dueOnDay.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay tareas para este día.</p>
              ) : (
                dueOnDay.map((t) => (
                  <div key={t.id} className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm">
                    <span className="truncate">{t.description}</span>
                    <Badge variant="outline" className={PRIORITY_STYLE[t.priority]}>{t.priority}</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actividad reciente</CardTitle>
          <CardDescription>Lo último que pasó en tus proyectos.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {activity.map((a) => (
            <div key={a.id} className="flex items-center gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                <Activity className="size-4" />
              </span>
              <p className="flex-1 text-sm">{a.text}</p>
              <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(a.at)}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

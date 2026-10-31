"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  validateMemberAction,
  validateProjectAction,
  validateSettingsAction,
  validateTaskAction,
  type ServerCheck,
} from "@/app/actions";
import { seedActivity, seedMembers, seedProjects, seedSettings, seedTasks } from "./seed";
import type {
  Activity,
  Member,
  MemberInput,
  Project,
  ProjectInput,
  ServiceResult,
  Settings,
  Task,
  TaskInput,
  TaskStatus,
} from "./types";

// Almacén en memoria + "backend" simulado.
// Cada operación espera un momento (como una petición de red), valida los datos en el servidor con una
// acción de servidor y recién entonces los guarda. Al recargar la página los datos vuelven al estado inicial.

const LATENCY_MS = 700;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const nextId = (prefix: string, ids: string[]) => {
  const max = ids.reduce((m, id) => Math.max(m, Number(id.split("-")[1]) || 0), 0);
  return `${prefix}-${String(max + 1).padStart(3, "0")}`;
};

interface Store {
  ready: boolean;
  projects: Project[];
  members: Member[];
  tasks: Task[];
  activity: Activity[];
  settings: Settings;

  createProject: (input: ProjectInput) => Promise<ServiceResult>;
  updateProject: (id: string, input: ProjectInput) => Promise<ServiceResult>;
  deleteProject: (id: string) => Promise<ServiceResult>;

  createMember: (input: MemberInput) => Promise<ServiceResult>;
  updateMember: (userId: string, input: MemberInput) => Promise<ServiceResult>;
  deleteMember: (userId: string) => Promise<ServiceResult>;
  setMemberActive: (userId: string, isActive: boolean) => Promise<ServiceResult>;

  createTask: (input: TaskInput) => Promise<ServiceResult>;
  updateTask: (id: string, input: TaskInput) => Promise<ServiceResult>;
  deleteTask: (id: string) => Promise<ServiceResult>;
  setTaskStatus: (id: string, status: TaskStatus) => Promise<ServiceResult>;

  saveSettings: (input: Settings) => Promise<ServiceResult>;
}

const StoreContext = createContext<Store | null>(null);

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore debe usarse dentro de StoreProvider");
  return ctx;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [projects, setProjects] = useState<Project[]>(seedProjects);
  const [members, setMembers] = useState<Member[]>(seedMembers);
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [activity, setActivity] = useState<Activity[]>(seedActivity);
  const [settings, setSettings] = useState<Settings>(seedSettings);

  // Carga inicial simulada
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 900);
    return () => clearTimeout(timer);
  }, []);

  const log = useCallback((text: string) => {
    setActivity((list) => [{ id: `ACT-${Date.now()}`, text, at: Date.now() }, ...list].slice(0, 8));
  }, []);

  // Valida en el servidor y, si todo está bien, aplica el cambio
  const submit = useCallback(
    async <I,>(
      validate: (input: unknown) => Promise<ServerCheck>,
      input: I,
      apply: () => string,
    ): Promise<ServiceResult> => {
      await delay(LATENCY_MS);
      const check = await validate(input);
      if (!check.ok) return { ok: false, errors: check.errors };
      return { ok: true, message: apply() };
    },
    [],
  );

  const act = useCallback(async (apply: () => string): Promise<ServiceResult> => {
    await delay(LATENCY_MS);
    return { ok: true, message: apply() };
  }, []);

  /* ---------- Proyectos ---------- */
  // Un miembro pertenece a un solo proyecto: los elegidos pasan a este y los quitados quedan sin proyecto
  const assignMembers = useCallback((projectId: string, memberIds: string[]) => {
    setMembers((list) =>
      list.map((m) => {
        if (memberIds.includes(m.userId)) return { ...m, projectId };
        if (m.projectId === projectId) return { ...m, projectId: "" };
        return m;
      }),
    );
  }, []);

  const createProject: Store["createProject"] = useCallback(
    (input) =>
      submit(validateProjectAction, input, () => {
        const { memberIds, ...data } = input;
        const id = nextId("PRJ", projects.map((p) => p.id));
        setProjects((list) => [{ id, ...clean(data) }, ...list]);
        assignMembers(id, memberIds);
        log(`Se creó el proyecto «${data.name.trim()}»`);
        return `Proyecto «${data.name.trim()}» creado`;
      }),
    [submit, projects, assignMembers, log],
  );

  const updateProject: Store["updateProject"] = useCallback(
    (id, input) =>
      submit(validateProjectAction, input, () => {
        const { memberIds, ...data } = input;
        setProjects((list) => list.map((p) => (p.id === id ? { id, ...clean(data) } : p)));
        assignMembers(id, memberIds);
        log(`Se actualizó el proyecto «${data.name.trim()}»`);
        return `Proyecto «${data.name.trim()}» actualizado`;
      }),
    [submit, assignMembers, log],
  );

  const deleteProject: Store["deleteProject"] = useCallback(
    (id) =>
      act(() => {
        const name = projects.find((p) => p.id === id)?.name ?? id;
        setProjects((list) => list.filter((p) => p.id !== id));
        setTasks((list) => list.filter((t) => t.projectId !== id));
        setMembers((list) => list.map((m) => (m.projectId === id ? { ...m, projectId: "" } : m)));
        log(`Se eliminó el proyecto «${name}»`);
        return `Proyecto «${name}» eliminado`;
      }),
    [act, projects, log],
  );

  /* ---------- Equipo ---------- */
  const createMember: Store["createMember"] = useCallback(
    (input) =>
      submit(validateMemberAction, input, () => {
        const userId = nextId("USR", members.map((m) => m.userId));
        setMembers((list) => [...list, { userId, ...cleanMember(input) }]);
        log(`${input.name.trim()} se unió al equipo`);
        return `${input.name.trim()} se agregó al equipo`;
      }),
    [submit, members, log],
  );

  const updateMember: Store["updateMember"] = useCallback(
    (userId, input) =>
      submit(validateMemberAction, input, () => {
        setMembers((list) => list.map((m) => (m.userId === userId ? { userId, ...cleanMember(input) } : m)));
        log(`Se actualizaron los datos de ${input.name.trim()}`);
        return `Datos de ${input.name.trim()} actualizados`;
      }),
    [submit, log],
  );

  const deleteMember: Store["deleteMember"] = useCallback(
    (userId) =>
      act(() => {
        const name = members.find((m) => m.userId === userId)?.name ?? userId;
        setMembers((list) => list.filter((m) => m.userId !== userId));
        setTasks((list) => list.map((t) => (t.userId === userId ? { ...t, userId: "" } : t)));
        log(`${name} salió del equipo`);
        return `${name} se eliminó del equipo`;
      }),
    [act, members, log],
  );

  const setMemberActive: Store["setMemberActive"] = useCallback(
    (userId, isActive) =>
      act(() => {
        const name = members.find((m) => m.userId === userId)?.name ?? userId;
        setMembers((list) => list.map((m) => (m.userId === userId ? { ...m, isActive } : m)));
        log(`${name} ahora está ${isActive ? "activo" : "inactivo"}`);
        return `${name} ahora está ${isActive ? "activo" : "inactivo"}`;
      }),
    [act, members, log],
  );

  /* ---------- Tareas ---------- */
  const createTask: Store["createTask"] = useCallback(
    (input) =>
      submit(validateTaskAction, input, () => {
        const id = nextId("TSK", tasks.map((t) => t.id));
        setTasks((list) => [{ id, ...cleanTask(input) }, ...list]);
        log(`Se creó la tarea «${input.description.trim()}»`);
        return "Tarea creada";
      }),
    [submit, tasks, log],
  );

  const updateTask: Store["updateTask"] = useCallback(
    (id, input) =>
      submit(validateTaskAction, input, () => {
        setTasks((list) => list.map((t) => (t.id === id ? { id, ...cleanTask(input) } : t)));
        log(`Se actualizó la tarea «${input.description.trim()}»`);
        return "Tarea actualizada";
      }),
    [submit, log],
  );

  const deleteTask: Store["deleteTask"] = useCallback(
    (id) =>
      act(() => {
        const text = tasks.find((t) => t.id === id)?.description ?? id;
        setTasks((list) => list.filter((t) => t.id !== id));
        log(`Se eliminó la tarea «${text}»`);
        return "Tarea eliminada";
      }),
    [act, tasks, log],
  );

  const setTaskStatus: Store["setTaskStatus"] = useCallback(
    (id, status) =>
      act(() => {
        const text = tasks.find((t) => t.id === id)?.description ?? id;
        setTasks((list) => list.map((t) => (t.id === id ? { ...t, status } : t)));
        log(`La tarea «${text}» pasó a «${status}»`);
        return `Tarea en «${status}»`;
      }),
    [act, tasks, log],
  );

  /* ---------- Configuración ---------- */
  const saveSettings: Store["saveSettings"] = useCallback(
    (input) =>
      submit(validateSettingsAction, input, () => {
        setSettings({ ...input, workspace: input.workspace.trim(), email: input.email.trim() });
        log("Se guardó la configuración");
        return "Configuración guardada";
      }),
    [submit, log],
  );

  const value = useMemo<Store>(
    () => ({
      ready, projects, members, tasks, activity, settings,
      createProject, updateProject, deleteProject,
      createMember, updateMember, deleteMember, setMemberActive,
      createTask, updateTask, deleteTask, setTaskStatus,
      saveSettings,
    }),
    [
      ready, projects, members, tasks, activity, settings,
      createProject, updateProject, deleteProject,
      createMember, updateMember, deleteMember, setMemberActive,
      createTask, updateTask, deleteTask, setTaskStatus,
      saveSettings,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

// Limpia espacios de más antes de guardar
const clean = <T extends { name: string; description: string }>(data: T) => ({
  ...data,
  name: data.name.trim().replace(/\s+/g, " "),
  description: data.description.trim().replace(/\s+/g, " "),
});
const cleanMember = (m: MemberInput): MemberInput => ({
  ...m,
  name: m.name.trim().replace(/\s+/g, " "),
  email: m.email.trim().toLowerCase(),
  position: m.position.trim().replace(/\s+/g, " "),
  phone: m.phone.replace(/\s/g, ""),
});
const cleanTask = (t: TaskInput): TaskInput => ({ ...t, description: t.description.trim().replace(/\s+/g, " ") });

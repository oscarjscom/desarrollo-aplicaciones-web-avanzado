"use client";

import { FolderKanban, LayoutDashboard, ListChecks, Settings as SettingsIcon, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StoreProvider, useStore } from "@/lib/store";
import { Loading } from "./FormParts";
import { ProjectsTab } from "./ProjectsTab";
import { SettingsTab } from "./SettingsTab";
import { SummaryTab } from "./SummaryTab";
import { TasksTab } from "./TasksTab";
import { TeamTab } from "./TeamTab";

const TABS = [
  { value: "summary", label: "Resumen", icon: LayoutDashboard },
  { value: "projects", label: "Proyectos", icon: FolderKanban },
  { value: "tasks", label: "Tareas", icon: ListChecks },
  { value: "team", label: "Equipo", icon: Users },
  { value: "settings", label: "Configuración", icon: SettingsIcon },
] as const;

export function AppShell() {
  return (
    <StoreProvider>
      <Dashboard />
    </StoreProvider>
  );
}

function Dashboard() {
  const { ready, settings } = useStore();

  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <PortalMark />
          <div>
            <h1 className="text-2xl font-bold leading-tight tracking-tight">Portal</h1>
            <p className="text-sm text-muted-foreground">{settings.workspace}</p>
          </div>
        </div>
      </header>

      <Tabs defaultValue="summary" className="gap-6">
        <TabsList className="h-auto w-full flex-wrap justify-start sm:w-auto">
          {TABS.map(({ value, label, icon: Icon }) => (
            <TabsTrigger key={value} value={value} className="gap-2 px-3 py-1.5">
              <Icon className="size-4" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {ready ? (
          <>
            <TabsContent value="summary"><SummaryTab /></TabsContent>
            <TabsContent value="projects"><ProjectsTab /></TabsContent>
            <TabsContent value="tasks"><TasksTab /></TabsContent>
            <TabsContent value="team"><TeamTab /></TabsContent>
            <TabsContent value="settings"><SettingsTab /></TabsContent>
          </>
        ) : (
          <Loading />
        )}
      </Tabs>
    </div>
  );
}

// Marca de la aplicación: un portal que gira despacio
function PortalMark() {
  return (
    <svg viewBox="0 0 48 48" className="size-10" aria-hidden="true">
      <defs>
        <radialGradient id="mark" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#06120d" />
          <stop offset="60%" stopColor="#0f4b2d" />
          <stop offset="100%" stopColor="#97ce4c" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="22" fill="url(#mark)" />
      <g fill="none" strokeLinecap="round" className="origin-center animate-[spin_12s_linear_infinite] motion-reduce:animate-none">
        <path d="M24 5c12 1 19 10 17 20" stroke="#d8ffb0" strokeWidth="2.5" />
        <path d="M24 11c7 1 12 7 10 14" stroke="#38e6e0" strokeWidth="2.5" />
        <path d="M24 17c3 .5 6 3.5 5 7" stroke="#ffffff" strokeWidth="2" />
      </g>
    </svg>
  );
}

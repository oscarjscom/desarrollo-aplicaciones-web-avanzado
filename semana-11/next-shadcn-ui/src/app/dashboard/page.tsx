import type { Metadata } from "next";
import { AppShell } from "@/components/app/AppShell";

export const metadata: Metadata = {
  title: "Portal · Proyectos",
  description: "Organiza proyectos, tareas y equipo en un solo lugar.",
};

export default function DashboardPage() {
  return <AppShell />;
}

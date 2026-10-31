import { redirect } from "next/navigation";

// La aplicación vive en /dashboard
export default function Home() {
  redirect("/dashboard");
}

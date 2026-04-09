import { redirect } from "next/navigation";

export default function LegacyDashboardTasksPage() {
  redirect("/tasks");
}

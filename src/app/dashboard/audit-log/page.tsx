import { redirect } from "next/navigation";

export default function LegacyDashboardAuditLogPage() {
  redirect("/audit-logs");
}

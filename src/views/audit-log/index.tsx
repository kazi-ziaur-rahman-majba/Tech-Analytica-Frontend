"use client";

import PageHeader from "@/components/page-header/PageHeader";
import RefreshButton from "@/components/table-components/RefreshButton";

type AuditLog = {
  id: string;
  timestamp: string;
  userEmail: string;
  action: string;
  details: string;
};

const auditLogs: AuditLog[] = [
  {
    id: "a1",
    timestamp: "2026-04-09 10:24:12",
    userEmail: "raihan@example.com",
    action: "TASK_CREATED",
    details: "Task Created: Fix Checkout Bug",
  },
  {
    id: "a2",
    timestamp: "2026-04-09 12:05:01",
    userEmail: "nadia@example.com",
    action: "TASK_UPDATED",
    details: "Task Updated: Update Landing Page",
  },
  {
    id: "a3",
    timestamp: "2026-04-09 13:42:50",
    userEmail: "bipasha@example.com",
    action: "TASK_COMPLETED",
    details: "Task Completed: Deploy New Release",
  },
];

const AuditLogPage = () => {
  return (
    <div className="flex flex-col gap-6 min-h-screen p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          headerTitle="Audit Logs"
          headerDescription="View task audit history with timestamps, actors, and human-readable details."
        />
        <RefreshButton onClick={() => {}} />
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-left border-collapse">
          <thead className="bg-[var(--primary-color-light)]">
            <tr className="text-sm border-b border-gray-200">
              <th className="px-6 py-3 border-r border-gray-200 text-start text-[#000000e0]">Timestamp</th>
              <th className="px-6 py-3 border-r border-gray-200 text-start text-[#000000e0]">User</th>
              <th className="px-6 py-3 border-r border-gray-200 text-start text-[#000000e0]">Action</th>
              <th className="px-6 py-3 text-center text-[#000000e0]">Details</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log) => (
              <tr key={log.id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                <td className="px-4 py-4 align-top text-sm text-gray-700">{log.timestamp}</td>
                <td className="px-4 py-4 align-top text-sm text-gray-900">{log.userEmail}</td>
                <td className="px-4 py-4 align-top text-sm font-semibold text-gray-900">{log.action}</td>
                <td className="px-4 py-4 align-top text-sm text-gray-600">{log.details}</td>
              </tr>
            ))}
            {auditLogs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  No audit logs available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogPage;

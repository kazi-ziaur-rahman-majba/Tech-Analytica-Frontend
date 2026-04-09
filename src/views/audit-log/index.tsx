"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import PageHeader from "@/components/page-header/PageHeader";
import RefreshButton from "@/components/table-components/RefreshButton";
import api from "@/services/api";

type AuditLog = {
  id: string;
  timestamp: string;
  userEmail: string;
  action: string;
  details: string;
  task?: { title: string };
  assignee?: string;
  beforeData?: { status: string };
  afterData?: { status: string };
};

const formatDetails = (log: AuditLog) => {
  const taskTitle = log.task?.title || "Unknown task";
  switch (log.action) {
    case "TASK_CREATED":
      return `Task Created: ${taskTitle}`;
    case "TASK_UPDATED":
      return `Task Updated: ${taskTitle}`;
    case "TASK_DELETED":
      return `Task Deleted: ${taskTitle}`;
    case "TASK_ASSIGNED":
      return `Task Assigned: ${taskTitle} to ${log.assignee || "Unknown assignee"}`;
    case "STATUS_CHANGED":
      return `Status Changed: ${taskTitle} from ${log.beforeData?.status || "Unknown"} to ${log.afterData?.status || "Unknown"}`;
    default:
      return log.details;
  }
};

const AuditLogPage = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const response = await api.get("/audit-logs");
      setAuditLogs(response.data || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  return (
    <div className="flex flex-col gap-6 min-h-screen p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          headerTitle="Audit Logs"
          headerDescription="View task audit history with timestamps, actors, and human-readable details."
        />
        <RefreshButton onClick={fetchAuditLogs} />
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
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : (
              auditLogs.map((log) => (
                <tr key={log.id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-4 py-4 align-top text-sm text-gray-700">{log.timestamp}</td>
                  <td className="px-4 py-4 align-top text-sm text-gray-900">{log.userEmail}</td>
                  <td className="px-4 py-4 align-top text-sm font-semibold text-gray-900">{log.action}</td>
                  <td className="px-4 py-4 align-top text-sm text-gray-600">{formatDetails(log)}</td>
                </tr>
              ))
            )}
            {!loading && auditLogs.length === 0 && (
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

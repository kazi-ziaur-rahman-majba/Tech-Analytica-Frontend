"use client";

import { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import Button from "@/components/button/Button";
import Footer from "@/components/admin/Footer";
import PageHeader from "@/components/page-header/PageHeader";
import RefreshButton from "@/components/table-components/RefreshButton";
import api from "@/services/api";

type TaskStatus = "PENDING" | "PROCESSING" | "DONE";

type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignedToId?: string;
  assigneeId?: string;
};

type DecodedToken = {
  sub?: string;
  userId?: string;
  id?: string;
};

const statusStyles: Record<TaskStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-900",
  PROCESSING: "bg-blue-100 text-blue-900",
  DONE: "bg-green-100 text-green-900",
};

const MyTasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedStatusByTask, setSelectedStatusByTask] = useState<Record<string, TaskStatus>>({});
  const [loading, setLoading] = useState(true);

  const currentUserId = useMemo(() => {
    const token = Cookies.get("token");
    if (!token) return "";
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.sub || decoded.userId || decoded.id || "";
    } catch {
      return "";
    }
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await api.get("/tasks");
      const apiTasks = response.data || [];
      const filteredTasks = currentUserId
        ? apiTasks.filter(
            (task: Task) =>
              (task.assignedToId || task.assigneeId || "") === currentUserId
          )
        : apiTasks;

      setTasks(filteredTasks);
      setSelectedStatusByTask(
        filteredTasks.reduce((acc: Record<string, TaskStatus>, task: Task) => {
          acc[task.id] = task.status;
          return acc;
        }, {})
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    setSelectedStatusByTask((prev) => ({ ...prev, [taskId]: status }));
  };

  const handleUpdateStatus = async (taskId: string) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, {
        status: selectedStatusByTask[taskId],
      });
      await fetchTasks();
      toast.success("Task status updated successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update task status");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6 min-h-screen p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <PageHeader
            headerTitle="My Tasks"
            headerDescription="View your assigned tasks and update task status."
          />
          <RefreshButton onClick={fetchTasks} />
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="w-full min-w-[720px] text-left border-collapse">
            <thead className="bg-[var(--primary-color-light)]">
              <tr className="text-sm border-b border-gray-200">
                <th className="px-6 py-3 border-r border-gray-200 text-start text-[#000000e0]">Title</th>
                <th className="px-6 py-3 border-r border-gray-200 text-start text-[#000000e0]">Description</th>
                <th className="px-6 py-3 border-r border-gray-200 text-start text-[#000000e0]">Current Status</th>
                <th className="px-6 py-3 text-start text-[#000000e0]">Update Status</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              )}

              {!loading &&
                tasks.map((task) => (
                  <tr key={task.id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-4 py-4 align-top text-sm font-medium text-gray-900">
                      <div>{task.title}</div>
                      
                    </td>
                    <td className="px-4 py-4 align-top text-sm text-gray-700">{task.description}</td>
                    <td className="px-4 py-4 align-top">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[task.status]}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex items-center gap-2">
                        <select
                          value={selectedStatusByTask[task.id] || task.status}
                          onChange={(event) => handleStatusChange(task.id, event.target.value as TaskStatus)}
                          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(224,79,22,0.15)]"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="DONE">DONE</option>
                        </select>
                        <Button
                          label="Update"
                          onClick={() => handleUpdateStatus(task.id)}
                          color="var(--color-primary)"
                          hoverColor="var(--color-primary-hover)"
                        />
                      </div>
                    </td>
                  </tr>
                ))}

              {!loading && tasks.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                    No tasks available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyTasksPage;

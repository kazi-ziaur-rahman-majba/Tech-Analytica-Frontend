"use client";

import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import Button from "@/components/button/Button";
import PageHeader from "@/components/page-header/PageHeader";
import Modal from "@/components/modal/Modal";
import DeleteModal from "@/components/modal/DeleteModal";
import RefreshButton from "@/components/table-components/RefreshButton";
import Footer from "@/components/admin/Footer";
import api from "@/services/api";

type User = {
  id: string;
  name: string;
  email: string;
};

type TaskStatus = "PENDING" | "PROCESSING" | "DONE";

type Task = {
  id: string;
  title: string;
  description: string;
  assignedToId: string;
  status: TaskStatus;
};

const statusStyles: Record<TaskStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-900",
  PROCESSING: "bg-blue-100 text-blue-900",
  DONE: "bg-green-100 text-green-900",
};

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formAssigneeId, setFormAssigneeId] = useState("");

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await api.get("/tasks");
      const normalizedTasks = (response.data || []).map((task: any) => ({
        ...task,
        assignedToId: task.assignedToId ?? task.assigneeId ?? task.assignedTo?.id ?? "",
      }));
      setTasks(normalizedTasks);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([fetchTasks(), fetchUsers()]);
    };
    loadInitialData();
  }, []);

  const openCreateModal = () => {
    setActiveTask(null);
    setFormTitle("");
    setFormDescription("");
    setFormAssigneeId(users[0]?.id || "");
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setActiveTask(task);
    setFormTitle(task.title);
    setFormDescription(task.description);
    setFormAssigneeId(task.assignedToId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActiveTask(null);
  };

  const openDeleteDialog = (task: Task) => {
    setActiveTask(task);
    setIsDeleteOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteOpen(false);
    setActiveTask(null);
  };

  const handleSave = async () => {
    if (!formTitle.trim() || !formDescription.trim()) {
      return;
    }

    try {
      if (activeTask) {
        await api.patch(`/tasks/${activeTask.id}`, {
          title: formTitle,
          description: formDescription,
          assignedToId: formAssigneeId,
        });
        toast.success("Task updated successfully!");
      } else {
        await api.post("/tasks", {
          title: formTitle,
          description: formDescription,
          assignedToId: formAssigneeId,
        });
        toast.success("Task created successfully!");
      }
      await fetchTasks();
      closeModal();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save task");
    }
  };

  const handleDelete = async () => {
    if (!activeTask) return;
    try {
      await api.delete(`/tasks/${activeTask.id}`);
      await fetchTasks();
      toast.success("Task deleted successfully!");
      closeDeleteDialog();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete task");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6 min-h-screen p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <PageHeader
            headerTitle="Tasks"
            headerDescription="Manage task assignments, statuses, and approvals."
          />
          <div className="flex items-center gap-2">
            <RefreshButton onClick={fetchTasks} />
            <Button
              label="Add Task"
              onClick={openCreateModal}
              color="var(--color-primary)"
              hoverColor="var(--color-primary-hover)"
              icon={<FaPlus size={16} />}
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="w-full min-w-[720px] text-left border-collapse">
            <thead className="bg-[var(--primary-color-light)]">
              <tr className="text-sm border-b border-gray-200">
                <th className="px-6 py-3 border-r border-gray-200 text-start text-[#000000e0]">Title</th>
                <th className="px-6 py-3 border-r border-gray-200 text-start text-[#000000e0]">Assignee</th>
                <th className="px-6 py-3 border-r border-gray-200 text-start text-[#000000e0]">Status</th>
                <th className="px-6 py-3 text-start text-[#000000e0]">Actions</th>
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
              {tasks.map((task) => {
                const assignee = users.find((user) => user.id === task.assignedToId);
                return (
                  <tr key={task.id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-4 py-4 align-top">
                      <div className="font-medium text-gray-900">{task.title}</div>
                      <p className="mt-1 text-sm text-gray-600">{task.description}</p>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="text-sm font-medium text-gray-900">{assignee?.name || "Unknown"}</div>
                      <div className="text-xs text-gray-500">{assignee?.email || "-"}</div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[task.status]}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <button
                          onClick={() => openEditModal(task)}
                          className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteDialog(task)}
                          className="rounded-md border border-red-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                    No tasks available yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />

      <Modal
        isOpen={isModalOpen}
        title={activeTask ? "Edit Task" : "Create Task"}
        onClose={closeModal}
        footerButtons={
          <>
            <Button label="Cancel" onClick={closeModal} color="#6b7280" hoverColor="#4b5563" />
            <Button label={activeTask ? "Update" : "Create"} onClick={handleSave} color="var(--color-primary)" hoverColor="var(--color-primary-hover)" />
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={formTitle}
              onChange={(event) => setFormTitle(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(224,79,22,0.15)]"
              placeholder="Enter task title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formDescription}
              onChange={(event) => setFormDescription(event.target.value)}
              className="w-full min-h-[120px] resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(224,79,22,0.15)]"
              placeholder="Enter task description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
            <select
              value={formAssigneeId}
              onChange={(event) => setFormAssigneeId(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(224,79,22,0.15)]"
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
        </div>
      </Modal>

      <DeleteModal
        isOpen={isDeleteOpen}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        onClose={closeDeleteDialog}
        onDelete={handleDelete}
      />
    </>
  );
};

export default Tasks;

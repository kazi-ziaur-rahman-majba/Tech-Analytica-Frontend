"use client";

import { useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";
import Button from "@/components/button/Button";
import PageHeader from "@/components/page-header/PageHeader";
import Modal from "@/components/modal/Modal";
import DeleteModal from "@/components/modal/DeleteModal";
import Footer from "@/components/admin/Footer";

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
  assigneeId: string;
  status: TaskStatus;
};

type AuditLog = {
  id: string;
  timestamp: string;
  userEmail: string;
  action: string;
  details: string;
};

const users: User[] = [
  { id: "u1", name: "Raihan Ahmed", email: "raihan@example.com" },
  { id: "u2", name: "Nadia Karim", email: "nadia@example.com" },
  { id: "u3", name: "Bipasha Sultana", email: "bipasha@example.com" },
];

const initialTasks: Task[] = [
  {
    id: "t1",
    title: "Fix Checkout Bug",
    description: "Resolve issue with payment gateway validation.",
    assigneeId: "u1",
    status: "PENDING",
  },
  {
    id: "t2",
    title: "Update Landing Page",
    description: "Refresh hero section content and CTA.",
    assigneeId: "u2",
    status: "PROCESSING",
  },
  {
    id: "t3",
    title: "Deploy New Release",
    description: "Push the latest feature branch to staging.",
    assigneeId: "u3",
    status: "DONE",
  },
];

const initialAuditLogs: AuditLog[] = [
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

const statusStyles: Record<TaskStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-900",
  PROCESSING: "bg-blue-100 text-blue-900",
  DONE: "bg-green-100 text-green-900",
};

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formAssigneeId, setFormAssigneeId] = useState(users[0].id);
  const [formStatus, setFormStatus] = useState<TaskStatus>("PENDING");

  const selectedAssignee = useMemo(
    () => users.find((user) => user.id === formAssigneeId) ?? users[0],
    [formAssigneeId]
  );

  const openCreateModal = () => {
    setActiveTask(null);
    setFormTitle("");
    setFormDescription("");
    setFormAssigneeId(users[0].id);
    setFormStatus("PENDING");
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setActiveTask(task);
    setFormTitle(task.title);
    setFormDescription(task.description);
    setFormAssigneeId(task.assigneeId);
    setFormStatus(task.status);
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

  const addAuditLog = (action: string, details: string) => {
    const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
    setAuditLogs((current) => [
      { id: `a-${Date.now()}`, timestamp, userEmail: selectedAssignee.email, action, details },
      ...current,
    ]);
  };

  const handleSave = () => {
    if (!formTitle.trim() || !formDescription.trim()) {
      return;
    }

    if (activeTask) {
      const updatedTask: Task = {
        ...activeTask,
        title: formTitle,
        description: formDescription,
        assigneeId: formAssigneeId,
        status: formStatus,
      };
      setTasks((current) => current.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
      addAuditLog("TASK_UPDATED", `Task Updated: ${updatedTask.title}`);
    } else {
      const newTask: Task = {
        id: `t-${Date.now()}`,
        title: formTitle,
        description: formDescription,
        assigneeId: formAssigneeId,
        status: "PENDING",
      };
      setTasks((current) => [newTask, ...current]);
      addAuditLog("TASK_CREATED", `Task Created: ${newTask.title}`);
    }

    closeModal();
  };

  const handleDelete = () => {
    if (!activeTask) return;
    setTasks((current) => current.filter((task) => task.id !== activeTask.id));
    addAuditLog("TASK_DELETED", `Task Deleted: ${activeTask.title}`);
    closeDeleteDialog();
  };

  return (
    <>
      <div className="flex flex-col gap-6 min-h-screen p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <PageHeader
            headerTitle="Tasks"
            headerDescription="Manage task assignments, statuses, and approvals."
          />
          <Button
            label="Add Task"
            onClick={openCreateModal}
            color="var(--color-primary)"
            hoverColor="var(--color-primary-hover)"
            icon={<FaPlus size={16} />}
          />
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="w-full min-w-[720px] text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Title</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Assignee</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => {
                const assignee = users.find((user) => user.id === task.assigneeId);
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
          {activeTask && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formStatus}
                onChange={(event) => setFormStatus(event.target.value as TaskStatus)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(224,79,22,0.15)]"
              >
                <option value="PENDING">PENDING</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="DONE">DONE</option>
              </select>
            </div>
          )}
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

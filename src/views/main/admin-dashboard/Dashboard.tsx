"use client";
import { useEffect, useState } from "react";
import DashboardOverView from "@/components/cards/Dashboard-Overview";
import { MotionDiv } from "@/utils/framer.motion";
import Footer from "@/components/admin/Footer";
import api from "@/services/api";
import { FaTasks, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { showToast } from "@/utils/toast-utils";

interface Task {
  id: string;
  status: "PENDING" | "PROCESSING" | "DONE";
}

const AdminDashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get("/tasks");
        setTasks(response.data || []);
      } catch (error: any) {
        showToast("error", "Failed to load tasks data");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "DONE").length;
  const processingTasks = tasks.filter((t) => t.status === "PROCESSING").length;

  return (
    <>
      <div className="flex flex-col gap-8 min-h-screen p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full transition-all ease-in duration-300 cursor-pointer">
          <MotionDiv>
            <DashboardOverView
              bgColor="bg-[var(--color-primary)]"
              title={loading ? "..." : totalTasks.toString()}
              subTitle="Total Tasks"
            >
              <FaTasks />
            </DashboardOverView>
          </MotionDiv>
          
          <MotionDiv>
            <DashboardOverView
              bgColor="bg-[#28c76f]"
              title={loading ? "..." : completedTasks.toString()}
              subTitle="Completed Tasks"
            >
              <FaCheckCircle />
            </DashboardOverView>
          </MotionDiv>

          <MotionDiv>
            <DashboardOverView
              bgColor="bg-[#00cfe8]"
              title={loading ? "..." : processingTasks.toString()}
              subTitle="Processing Tasks"
            >
              <FaSpinner className={loading || processingTasks === 0 ? "" : "animate-spin"} />
            </DashboardOverView>
          </MotionDiv>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminDashboard;

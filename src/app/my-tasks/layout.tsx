"use client";

import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { useState } from "react";
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarClick, setSidebarClick] = useState(false);

  const handleSidebarClick = () => setSidebarClick((v) => !v);

  return (
    <div className="relative flex h-screen overflow-hidden">
      <button
        onClick={handleSidebarClick}
        aria-label={sidebarClick ? "Expand sidebar" : "Collapse sidebar"}
        style={{ willChange: "left" }}
        className={`hidden lg:block lg:fixed top-5 z-[51] bg-[#E04F16] text-white rounded-full p-1 shadow hover:opacity-90 focus:outline-none transition-[left,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer motion-reduce:transition-none ${
          sidebarClick ? "left-[80px]" : "left-[235px]"
        }`}
      >
        {sidebarClick ? (
          <MdKeyboardDoubleArrowRight size={18} />
        ) : (
          <MdKeyboardDoubleArrowLeft size={18} />
        )}
      </button>

      <Sidebar
        sidebarClick={sidebarClick}
      />

      <div className="flex flex-col flex-1">
        <Header sidebarClick={sidebarClick} />

        <main className="flex-1 overflow-auto bg-[#F6F6F6] mt-16">
          {children}
        </main>
      </div>
    </div>
  );
}

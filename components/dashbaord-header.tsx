"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { FC } from "react";

const DashboardHeader: FC<{ title: string }> = ({ title }) => {
  const router = useRouter();

  return (
    <header className="bg-sidebar px-4 py-4 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto flex items-center">
        <button
          onClick={router.back}
          className="p-2 rounded-full hover:bg-[#2a2b2f] transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-medium ml-4">{title}</h1>
      </div>
    </header>
  );
};

export default DashboardHeader;

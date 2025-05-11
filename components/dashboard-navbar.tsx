"use client";

import React from "react";
import { Input } from "./ui/input";
import { Bell, MenuIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSidebar } from "./ui/sidebar";
import { ConnectWallet } from "./connect-wallet";

export const DashboradNavBar = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <nav className="w-full">
      <div className="w-full bg-sidebar px-6 py-4 flex items-end justify-end">
        <div className="flex items-center gap-3">
          <MenuIcon
            onClick={toggleSidebar}
            size={20}
            className="flex md:hidden"
          />
          <Bell size={20} />
          <ConnectWallet />
        </div>
      </div>
    </nav>
  );
};

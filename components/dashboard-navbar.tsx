"use client";

import React from "react";
import { Input } from "./ui/input";
import { Bell, MenuIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSidebar } from "./ui/sidebar";

export const DashboradNavBar = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <nav className="w-full">
      <div className="w-full bg-sidebar px-6 py-4 flex items-center justify-between">
        <Input placeholder="Search" className=" md:w-[30%] w-[40%]" />
        <div className="flex items-center gap-3">
          <MenuIcon
            onClick={toggleSidebar}
            size={20}
            className="flex md:hidden"
          />
          <Bell size={20} />
          <Avatar>
            <AvatarImage src={""} />
            <AvatarFallback className="bg-accent-foreground/20">
              SG
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </nav>
  );
};

"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { Button } from "./ui/button";
import {
  BadgeDollarSignIcon,
  Home,
  PowerOffIcon,
  Settings2Icon,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { isAdmin } from "@/lib/utils";
import { ConnectWallet } from "./connect-wallet";
import { useWallet } from "@suiet/wallet-kit";

export function AppSidebar() {
  const { address = "" } = useWallet();

  const navLinks = [
    {
      url: "/dashboard/overview",
      title: "Dashboard",
      icon: Home,
      isHidden: false, // Show for all user,
    },
    {
      url: "/dashboard/payfrica-lite",
      title: "Dashboard (LITE)",
      icon: Home,
      isHidden: false, // Show for all user,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <Image src="/logo.png" width={100} height={100} priority alt="Logo" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent className="mt-3">
            <SidebarMenu className="space-y-3">
              {navLinks
                .filter((nav) => !Boolean(nav.isHidden))
                .map((item) => (
                  <SidebarMenuItem key={item.title} className="h-10">
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {/*<SidebarMenuButton asChild variant="default">*/}
        <ConnectWallet className="w-full h-10" />
      </SidebarFooter>
    </Sidebar>
  );
}

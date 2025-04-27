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
  Users,
} from "lucide-react";
import Link from "next/link";

const navLinks = [
  {
    url: "/dashboard/overview",
    title: "Dashboard",
    icon: Home,
  },
  {
    url: "/dashboard/agents",
    title: "Agents",
    icon: Users,
  },
  {
    url: "/dashboard/transactions/",
    title: "Transactions",
    icon: BadgeDollarSignIcon,
  },
  {
    url: "/dashboard/settings/",
    title: "Settings",
    icon: Settings2Icon,
  },
];

export function AppSidebar() {
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
              {navLinks.map((item) => (
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
        <SidebarMenuButton asChild variant="default">
          <Button className="gap-2">
            <PowerOffIcon size={19} />
            Log Out
          </Button>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}

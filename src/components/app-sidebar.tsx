import * as React from "react"
import {
  BookOpen,
  Map,
  PieChart,
  Home,
  Settings,
  CheckSquare
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Soybean",
    email: "soy@bean.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
      isActive: true,
      items: [],
    },
    {
      title: "Bean Journey",
      url: "/bean-journey",
      icon: BookOpen,
      items: [],
    },
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: PieChart,
      items: [],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      items: [],
    },
    {
      title: "ToDo List",
      url: "/todo",
      icon: CheckSquare,
      items: [],
    },
  ],
  navSecondary: [],
  projects: [
    {
      name: "Study",
      url: "#",
      icon: BookOpen,
    },
    {
      name: "Fitness",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Nature",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props} className="text-[#1e1742] dark:text-white">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white text-[#9645ff]">
                  <span className="text-lg font-bold">🌱</span>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">BeanJournal</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <div className="px-2 py-2">
          <h3 className="px-2 text-xs font-medium text-[#1e1742]/70 dark:text-white/70">Trending Tags</h3>
        </div>
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

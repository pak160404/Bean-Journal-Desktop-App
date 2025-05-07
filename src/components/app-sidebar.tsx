import * as React from "react";
import {
  BookOpen,
  Map,
  PieChart,
  Home,
  Settings,
  CheckSquare,
  CreditCard,
  Palette,
  UserCircle,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserButton } from "@clerk/clerk-react";
import logoBean from "@/images/logo_bean_journal.png";

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
      title: "Bean Journal",
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
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      variant="inset"
      {...props}
      className="text-[#1e1742] font-publica-sans dark:text-white"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <img src={logoBean} alt="bean journal" className="w-14 h-14 ml-[-1rem] mr-[-0.4rem]" />
                <div className="grid flex-1 text-left text-lg leading-tight">
                  <span className="truncate font-semibold">bean journal</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <div className="px-2 py-2">
          <h3 className="px-2 text-xs font-medium text-[#1e1742]/70 dark:text-white/70">
            Trending Tags
          </h3>
        </div>
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu className="NavUser">
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="user-menu-button w-full">
              <div className="flex items-center gap-3 w-full">
                <UserButton
                  showName
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "h-10 w-10 order-1",
                      userButtonOuterIdentifier:
                        "text-left font-semibold text-base truncate order-2",
                      userButtonBox: "flex w-full items-center gap-3",
                      userButtonTrigger:
                        "flex items-center w-full my-6 pr-12 pl-4",
                    },
                  }}
                >
                  <UserButton.MenuItems>
                    <UserButton.Link 
                      href="/journal/user-profile" 
                      label="My Profile"
                      labelIcon={<UserCircle size={16} />}
                    />
                    <UserButton.UserProfilePage label="account" />
                    <UserButton.UserProfilePage label="security" />
                  </UserButton.MenuItems>
                  <UserButton.UserProfilePage
                    label="Theme"
                    url="theme"
                    labelIcon={<Palette size={16} />}
                  >
                    <div className="w-full">
                      <h1 className="text-[1.05rem] font-bold mb-2 border-b pb-4">
                        Theme Settings
                      </h1>

                      <div className="space-y-8 py-4">
                        <div className="border-b pb-6">
                          <h2 className="text-[0.8rem] mb-4 font-medium text-[#212126] dark:text-gray-300">
                            Theme
                          </h2>
                          <div className="flex flex-col gap-4">
                            <button className="h-20 w-full bg-gradient-to-r from-[#FFD1FB] to-[#AE70FF] rounded-xl shadow-md focus:ring-2 focus:ring-offset-2 focus:ring-[#9645ff] transition-all hover:scale-105 active:scale-95"></button>
                            <button
                              className="h-20 w-full rounded-xl shadow-md focus:ring-2 focus:ring-offset-2 focus:ring-[#9645ff] transition-all hover:scale-105 active:scale-95 overflow-hidden bg-cover bg-center"
                              style={{
                                backgroundImage:
                                  "url('/images/themes/theme1.jpg')",
                              }}
                            >
                              {/* Content removed as image is background */}
                            </button>
                            <button
                              className="h-20 w-full rounded-xl shadow-md focus:ring-2 focus:ring-offset-2 focus:ring-[#9645ff] transition-all hover:scale-105 active:scale-95 overflow-hidden bg-cover bg-center"
                              style={{
                                backgroundImage:
                                  "url('/images/themes/theme2.jpg')",
                              }}
                            >
                              {/* Content removed as image is background */}
                            </button>
                          </div>
                        </div>

                        <div className="border-b pb-6">
                          <h2 className="text-[0.8rem] mb-3 font-medium text-[#212126] dark:text-gray-300">
                            Font
                          </h2>
                          <div className="flex space-x-3">
                            <button className="flex-1 py-3 px-4 bg-[#B274FF] text-white rounded-lg shadow-md text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-[#9645ff]">
                              Publica Sans
                            </button>
                            <button className="flex-1 py-3 px-4 bg-[#F5C5FC] text-gray-800 rounded-lg shadow-md text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-[#9645ff]">
                              Roboto
                            </button>
                          </div>
                        </div>

                        <div className="mt-6">
                          <h3 className="text-[0.8rem] mb-3 font-medium text-[#212126] dark:text-gray-300">
                            Font Size
                          </h3>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              A
                            </span>
                            <input
                              type="range"
                              min="1"
                              max="3"
                              step="1"
                              defaultValue="2"
                              className="w-full h-1.5 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer focus:ring-2 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-[#9645ff]"
                            />
                            <span className="text-lg text-gray-500 dark:text-gray-400">
                              A
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </UserButton.UserProfilePage>
                  <UserButton.UserProfilePage
                    label="Billing"
                    url="billing"
                    labelIcon={<CreditCard size={16} />}
                  >
                    <div className="p-4 w-full">
                      <h1 className="text-lg font-medium mb-3">
                        Billing Settings
                      </h1>
                      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                        Manage your subscription and payment methods
                      </p>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-3">
                          <div className="text-sm">Current Plan</div>
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 bg-green-100 text-green-800 rounded text-xs font-medium">
                              Active
                            </span>
                            <span className="text-sm">Free Plan</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-b pb-3">
                          <div className="text-sm">Payment Method</div>
                          <button className="text-[#9645ff] text-xs font-medium">
                            Add payment method
                          </button>
                        </div>

                        <div className="flex items-center justify-between border-b pb-3">
                          <div className="text-sm">Billing History</div>
                          <div className="text-xs text-gray-500">
                            No previous invoices
                          </div>
                        </div>

                        <div className="flex justify-end pt-1">
                          <button className="px-3 py-1.5 bg-[#9645ff] text-white rounded-md hover:bg-[#8435ef] text-xs font-medium">
                            Upgrade Plan
                          </button>
                        </div>
                      </div>
                    </div>
                  </UserButton.UserProfilePage>
                </UserButton>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

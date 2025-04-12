import { createRootRoute, Outlet } from "@tanstack/react-router";
//import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/app-sidebar";

// components
import { ModeToggle } from "@/components/shared/ModeToggle";
//import { ShadcnSidebar } from "@/components/shared/ShadcnSidebar";

export const Route = createRootRoute({
  component: () => (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-white dark:bg-transparent">
        <header className="flex h-16 shrink-0 items-center gap-2 rounded-t-lg">
          <div className="flex items-center justify-between w-full px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger 
                className="-ml-1 text-[#2f2569] dark:text-white z-50" 
                aria-label="Toggle sidebar"
              />
              <Separator orientation="vertical" className="mr-2 h-4 bg-[#2f2569]/20 dark:bg-white/20" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink
                      href="#"
                      className="text-[#2f2569] dark:text-white interactive"
                    >
                      Building Your Application
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block text-[#2f2569]/50 dark:text-white/50" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-[#2f2569] dark:text-white">
                      Data Fetching
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center gap-2">
              <ModeToggle />
            </div>
          </div>
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
        {/* <TanStackRouterDevtools /> */}
      </SidebarInset>
    </SidebarProvider>
  ),
});

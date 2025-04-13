import { Outlet, createFileRoute } from "@tanstack/react-router";
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
import { ModeToggle } from "@/components/shared/ModeToggle";
import { useEffect } from 'react';
import '../journal-theme.css'; 


// Create a file route for the journal section
export const Route = createFileRoute("/journal")({
  component: JournalLayout
});

function JournalLayout() {
  useEffect(() => {
    document.body.classList.add('journal-theme');
    // Optionally add theme class to root div if needed for direct scoping
    // const rootDiv = document.getElementById('root'); // Or use a ref
    // if (rootDiv) rootDiv.classList.add('journal-theme');

    return () => {
      document.body.classList.remove('journal-theme');
      // if (rootDiv) rootDiv.classList.remove('journal-theme');
    };
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-white dark:bg-transparent">
        <header className="flex h-16 items-center gap-2 rounded-t-lg">
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
                      href="/journal"
                      className="text-[#2f2569] dark:text-white interactive"
                    >
                      Bean Journal
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block text-[#2f2569]/50 dark:text-white/50" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-[#2f2569] dark:text-white">
                      My Coffee Journey
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-[#2f2569] dark:text-white">
                <ModeToggle />
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
} 
import { createRootRoute, Outlet, useRouterState } from "@tanstack/react-router";
//import { ModeToggle } from "@/components/shared/ModeToggle";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ClerkAndThemeProvider } from "../main";
import { NotFound } from "@/components/shared/NotFound";
import { useEffect } from "react";
import { useAuthProtection } from "@/utils/authUtils";

export const Route = createRootRoute({
  component: LandingRoot,
  notFoundComponent: NotFound,
});

function LandingRoot() {
  const { location } = useRouterState();
  const isJournalRoute = location.pathname.startsWith('/journal');
  
  // Scroll to top whenever the route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <ClerkAndThemeProvider>
      <AuthProtector />
      <div className={`landing-page-theme min-h-screen ${!isJournalRoute ? 'bg-white dark:bg-transparent' : ''}`}>
        {/* Simple floating header - Conditionally rendered */}

        
        <main>
          <Outlet />
        </main>
        
        {/* Footer - Conditionally rendered */}
        <TanStackRouterDevtools />
      </div>
    </ClerkAndThemeProvider>
  );
}

// Separate component to use the auth hook inside the Clerk context
function AuthProtector() {
  useAuthProtection();
  return null;
} 
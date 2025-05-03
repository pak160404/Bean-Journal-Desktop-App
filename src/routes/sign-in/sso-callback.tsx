import { createFileRoute } from "@tanstack/react-router";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";

export const Route = createFileRoute('/sign-in/sso-callback')({
  component: SSOCallback,
});

// This component now relies on ClerkProvider configuration for redirects
function SSOCallback() {
  console.log("SSO Callback component rendering (simplified)");

  // This component handles the token exchange and relies on the 
  // fallback URLs set in ClerkProvider in main.tsx
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl mb-4">Completing authentication...</h2>
        <div className="w-12 h-12 rounded-full border-4 border-t-purple-500 border-purple-200 animate-spin mx-auto"></div>
        {/* AuthenticateWithRedirectCallback uses the fallback URLs from ClerkProvider */}
        <AuthenticateWithRedirectCallback />
      </div>
    </div>
  );
} 
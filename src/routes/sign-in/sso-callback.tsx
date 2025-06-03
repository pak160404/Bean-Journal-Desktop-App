import { createFileRoute } from "@tanstack/react-router";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import Silk from "@/components/Silk/Silk";

export const Route = createFileRoute('/sign-in/sso-callback')({
  component: SSOCallback,
});

// This component now relies on ClerkProvider configuration for redirects
function SSOCallback() {
  console.log("SSO Callback component rendering (simplified)");

  // This component handles the token exchange and relies on the 
  // fallback URLs set in ClerkProvider in main.tsx
  return (
    <div className="relative grid min-h-screen place-items-center px-4 py-10">
      <div className="absolute inset-0 -z-10">
        <Silk
          speed={5}
          scale={1}
          color="#647E5D"
          noiseIntensity={1.5}
          rotation={0}
        />
      </div>
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 w-full max-w-sm overflow-hidden">
        <div className="text-center py-4">
          <h2 className="text-xl mb-4 text-white">Completing authentication...</h2>
          <div className="w-12 h-12 rounded-full border-4 border-t-purple-500 border-purple-200 animate-spin mx-auto"></div>
          {/* AuthenticateWithRedirectCallback uses the fallback URLs from ClerkProvider */}
          <AuthenticateWithRedirectCallback />
        </div>
      </div>
    </div>
  );
} 
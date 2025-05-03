"use client";

import { createFileRoute } from "@tanstack/react-router";
import { SignUp } from "@clerk/clerk-react"; // Import SignUp component
import logo_bean_journey from "@/images/logo_bean_journal.png";
export const Route = createFileRoute("/sign-up")({
  component: RouteComponent,
});

function RouteComponent() {
  const signInUrl = import.meta.env.VITE_CLERK_SIGN_IN_URL || "/login";
  const afterSignUpUrl = import.meta.env.VITE_CLERK_AFTER_SIGN_UP_URL || "/sign-up/continue";

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-b from-[#f6efff] to-[#ead6ff] px-4 py-10">
      <div className="w-full max-w-sm space-y-6">
        {/* 1. Custom Header */}
        <div className="text-center">
          <img
            src={logo_bean_journey}
            alt="Bean Journey Logo"
            className="w-[6rem] h-[6rem] object-contain mx-auto"
          />
          <h1 className="text-xl font-publica-sans font-semibold tracking-tight text-gray-900">
            Create your Bean Journal account
          </h1>
          <p className="mt-1 font-mono text-sm text-gray-600">
            Let's get you started!
          </p>
        </div>

        {/* 2. Clerk SignUp Component */}
        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl={signInUrl}
          afterSignUpUrl={afterSignUpUrl}
          redirectUrl={afterSignUpUrl}
          appearance={{
            variables: {
              colorPrimary: "#9645FF",
              borderRadius: "1rem",
              colorText: "#111827",
              colorTextSecondary: "#4B5563",
              colorInputText: "#111827",
              colorBackground: "#ffffff",
              fontFamily: "Publica Sans",
            },
            elements: {
              rootBox: "bg-transparent",
              card: {
                backgroundColor: "white",
                border: "none",
                borderRadius: "1rem",
                padding: "1.5rem 2rem",
                boxShadow: "none",
                borderColor: "transparent",
              },
              header: "hidden",
              socialButtonsContainer: "mb-4 gap-4",
              socialButtonsBlockButton:
                "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl py-2",
              dividerRow: "my-5",
              dividerText: "text-gray-500 text-xs",
              formFieldLabel: "text-gray-800 text-sm font-medium mb-1",
              formInput:
                "bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder:text-gray-400 py-2",
              formButtonPrimary:
                "border border-[#9645FF] bg-white text-[#9645FF] hover:bg-purple-50 text-sm font-medium rounded-lg py-2.5 shadow-sm",
              alternativeMethodsContainer: "pt-4",
              footer: "bg-transparent pt-2",
              footerActionText: "text-sm text-gray-500",
              footerActionLink:
                "text-[#9645FF] hover:text-[#7d37d3] text-sm font-medium",
            },
          }}
        />
      </div>
    </div>
  );
}

"use client";

import { createFileRoute } from "@tanstack/react-router";
import { SignIn } from "@clerk/clerk-react"; // Import standard SignIn
// import { BeanJournalLogo } from '@/components/icons/BeanJournalLogo'; // Assuming you have a logo component

// TODO: Replace with actual Apple icon if desired
// import { AppleIcon } from '@/components/icons'
import logo_bean_journey from "@/images/logo_bean_journal.png";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const signUpUrl = import.meta.env.VITE_CLERK_SIGN_UP_URL || "/sign-up";
  const afterSignInUrl = import.meta.env.VITE_CLERK_AFTER_SIGN_IN_URL || "/journal";

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-b from-[#f6efff] to-[#ead6ff] px-4 py-10">
      <div className="w-full max-w-sm space-y-6">
        {" "}
        {/* Adjusted max-width slightly */}
        {/* 1. Your Custom Header */}
        <div className="text-center">
          <img
            src={logo_bean_journey}
            alt="Bean Journey Logo"
            className="w-[6rem] h-[6rem] object-contain mx-auto"
          />
          <h1 className="text-xl font-publica-sans font-semibold tracking-tight text-gray-900">
            Sign in to Bean Journal
          </h1>
          <p className="mt-1 font-mono text-sm text-gray-600">
            Welcome back! Please sign in to continue
          </p>
        </div>
        {/* 2. Clerk Sign In Component */}
        <SignIn
          routing="path"
          path="/login"
          signUpUrl={signUpUrl}
          afterSignInUrl={afterSignInUrl}
          redirectUrl="/login/sso-callback"
          appearance={{
            variables: {
              colorPrimary: "#9645FF",
              borderRadius: "1rem",
              colorText: "#111827", // Darker text (like Tailwind gray-900)
              colorTextSecondary: "#4B5563", // Medium gray text
              colorInputText: "#111827",
              colorBackground: "#ffffff", // Ensure card bg is white
              fontFamily: "Publica Sans",
            },
            elements: {
              rootBox: "bg-transparent",
              card: {
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '1rem',
                padding: '1.5rem 2rem',
                boxShadow: 'none',
                borderColor: 'transparent'
              },
              header: "hidden",
              socialButtonsContainer: "mb-4 gap-4", // Add gap between social buttons
              socialButtonsBlockButton:
                "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl py-2", // Updated style
              dividerRow: "my-5", // Adjust divider spacing
              dividerText: "text-gray-500 text-xs",
              formFieldLabel: "text-gray-800 text-sm font-medium mb-1",
              formInput:
                "bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 py-2", // Updated input style
              formButtonPrimary:
                "border border-[#9645FF] bg-white text-[#9645FF] hover:bg-purple-50 text-sm font-medium rounded-lg py-2.5", // Updated button style
              alternativeMethodsContainer: "pt-4", // Spacing above footer link
              footer: "bg-transparent pt-2", // Adjust footer container if needed
              footerActionText: "text-sm text-gray-500",
              footerActionLink:
                "text-[#9645FF] hover:text-[#7d37d3] text-sm font-medium", // Updated sign up link style
            },
          }}
        />
      </div>
    </div>
  );
}

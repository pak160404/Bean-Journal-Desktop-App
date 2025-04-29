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
          <h1 className="text-xl font-semibold tracking-tight text-gray-900">
            Sign in to Bean Journal
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Welcome back! Please sign in to continue
          </p>
        </div>
        {/* 2. Clerk Sign In Component */}
        <SignIn
          routing="virtual"
          signUpUrl="/sign-up"
          appearance={{
            variables: {
              colorPrimary: "#9645FF",
              borderRadius: "1rem",
              colorText: "#111827", // Darker text (like Tailwind gray-900)
              colorTextSecondary: "#4B5563", // Medium gray text
              colorInputText: "#111827",
              colorBackground: "#ffffff", // Ensure card bg is white
            },
            elements: {
              rootBox: "bg-transparent",
              card: "bg-white shadow-md border-none rounded-2xl p-6 md:p-8", // Adjusted shadow, radius, padding
              header: "hidden",
              socialButtonsContainer: "mb-4 gap-4", // Add gap between social buttons
              socialButtonsBlockButton:
                "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl py-2", // Updated style
              dividerRow: "my-5", // Adjust divider spacing
              dividerText: "text-gray-500 text-xs",
              formFieldLabel: "text-gray-800 text-sm font-medium mb-1",
              formInput:
                "bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder:text-gray-400 py-2", // Updated input style
              formButtonPrimary:
                "border border-[#9645FF] bg-white text-[#9645FF] hover:bg-purple-50 text-sm font-medium rounded-lg py-2.5 shadow-sm", // Updated button style
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

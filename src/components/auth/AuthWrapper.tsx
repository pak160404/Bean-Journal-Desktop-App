import { SignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import { ReactNode } from "react";

interface AuthWrapperProps {
  children: ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <SignIn />
        </div>
      </SignedOut>
    </>
  );
}
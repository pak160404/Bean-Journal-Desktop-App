"use client";

import { createFileRoute } from '@tanstack/react-router';
import { SignUp, useSignUp } from '@clerk/clerk-react';
import logo_bean_journey from "@/images/logo_bean_journal.png";
import Silk from "@/components/Silk/Silk";
import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/sign-up/continue')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { signUp, isLoaded } = useSignUp();
  const [debugInfo, setDebugInfo] = useState('Loading...');
  
  const signInUrl = import.meta.env.VITE_CLERK_SIGN_IN_URL || "/sign-in";
  const signUpUrl = import.meta.env.VITE_CLERK_SIGN_UP_URL || "/sign-up";
  const afterSignUpUrl = import.meta.env.VITE_CLERK_AFTER_SIGN_IN_URL || "/journal";

  // Add debugging to check what's happening with the sign-up state
  useEffect(() => {
    if (isLoaded && signUp) {
      const info = {
        status: signUp.status,
        missingFields: signUp.missingFields,
        hasExternalAccount: signUp.verifications?.externalAccount?.status === 'verified',
        emailVerified: signUp.verifications?.emailAddress?.status === 'verified',
        unverifiedFields: signUp.unverifiedFields,
      };
      console.log('SignUp state:', info);
      setDebugInfo(JSON.stringify(info, null, 2));

      // If there's an active sign-up but username isn't in missing fields,
      // let's force a check to make sure it's not being overlooked
      if (signUp.status === 'missing_requirements' && 
          !signUp.missingFields?.includes('username') &&
          !signUp.username) {
        console.log('Username not in missing fields but also not set, adding it manually');
        signUp.update({ username: '' }).catch(err => {
          console.error('Error updating sign-up:', err);
        });
      }
    }
  }, [isLoaded, signUp]);

  // Redirect to sign-up if this page is accessed directly 
  useEffect(() => {
    // Only check if there's no active sign-up attempt in progress
    if (isLoaded) {
      if (!signUp) {
        // No active sign-up, check URL and localStorage as fallbacks
        const hasContinuationToken = window.location.href.includes('__clerk_ticket');
        const hasOAuthData = 
          window.location.href.includes('external_account') || 
          window.location.search.includes('transfer_flow=signup');
      
        // If no indicators of a sign-up continuation, redirect
        if (!hasContinuationToken && !hasOAuthData) {
          console.log('No active sign-up found, redirecting to sign-up');
          navigate({ to: signUpUrl });
        }
      } else {
        console.log('Active sign-up found with status:', signUp.status);
      }
    }
  }, [isLoaded, signUp, navigate, signUpUrl]);

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
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 sm:p-6 md:p-8 w-full max-w-md sm:max-w-lg md:max-w-3xl lg:max-w-4xl overflow-hidden">
        {!isLoaded ? (
          <div className="text-center py-12">
            <h2 className="text-xl sm:text-2xl text-white">Loading session...</h2>
            <div className="mt-4 w-10 h-10 rounded-full border-4 border-t-purple-500 border-purple-200 animate-spin mx-auto"></div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-stretch w-full">
            <div className="flex flex-col items-center md:items-start text-center md:text-left py-4 md:flex-none md:w-2/5">
              <img
                src={logo_bean_journey}
                alt="Bean Journey Logo"
                className="w-[11rem] h-[11rem] object-contain md:mx-0 md:-ml-6 md:-mt-12"
              />
              <h1 className="mt-4 text-2xl sm:text-3xl font-publica-sans font-semibold tracking-tight text-white">
                Complete your registration
              </h1>
              <p className="mt-2 font-mono text-sm sm:text-base text-gray-200">
                You're almost there! Just a few more details.
              </p>
              <div className="mt-8 p-4 bg-white/5 rounded-lg w-full max-w-xs md:max-w-sm text-center md:text-left">
                <p className="text-xs text-gray-300/80 italic">
                  Finalize your account to start your Bean Journal journey.
                </p>
              </div>
            </div>

            <div className="w-4/5 h-px bg-gray-400/30 my-6 self-center md:hidden"></div>
            <div className="hidden md:block w-px bg-gray-400/30 self-stretch mx-4 sm:mx-6 lg:mx-8"></div>

            <div className="flex flex-col items-center justify-center py-4 md:pl-6 md:flex-1">
              {import.meta.env.DEV && (
                <div className="w-full bg-white/20 p-3 rounded-md border border-gray-300/30 text-xs overflow-auto max-h-40 mb-4 shadow">
                  <p className="text-white/80 text-sm font-semibold mb-1">Dev Debug Info:</p>
                  <pre className="text-white/90 whitespace-pre-wrap break-all">{debugInfo}</pre>
                </div>
              )}
              <SignUp
                routing="path"
                path="/sign-up/continue"
                signInUrl={signInUrl}
                afterSignUpUrl={afterSignUpUrl}
                redirectUrl={afterSignUpUrl}
                initialValues={{
                  username: ''
                }}
                appearance={{
                  elements: {
                    rootBox: "bg-transparent w-full", // Updated
                    header: "hidden",
                  },
                }}
              />
              <div className="text-center pt-6 w-full">
                <button
                  onClick={() => navigate({ to: signInUrl })}
                  className="text-sm text-gray-300 hover:text-white hover:underline"
                >
                  Cancel and go to Sign In
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
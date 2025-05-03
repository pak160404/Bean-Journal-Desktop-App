"use client";

import { createFileRoute } from '@tanstack/react-router';
import { SignUp, useSignUp } from '@clerk/clerk-react';
import logo_bean_journey from "@/images/logo_bean_journal.png";
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

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-b from-[#f6efff] to-[#ead6ff] px-4 py-10">
      <div className="w-full max-w-sm space-y-6">
        {/* Custom Header */}
        <div className="text-center">
          <img
            src={logo_bean_journey}
            alt="Bean Journey Logo"
            className="w-[6rem] h-[6rem] object-contain mx-auto"
          />
          <h1 className="text-xl font-semibold tracking-tight text-gray-900">
            Complete your registration
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            You're almost there! Just a few more details.
          </p>
        </div>

        {/* Debug info - will only show during development */}
        {import.meta.env.DEV && (
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-xs overflow-auto max-h-40">
            <pre>{debugInfo}</pre>
          </div>
        )}

        {/* Clerk SignUp Component */}
        <SignUp
          routing="path"
          path="/sign-up/continue"
          signInUrl={signInUrl}
          afterSignUpUrl={afterSignUpUrl}
          redirectUrl={afterSignUpUrl}
          initialValues={{
            // Force focus on username field if needed
            username: ''
          }}
          appearance={{
            variables: {
              colorPrimary: '#9645FF',
              borderRadius: '1rem',
              colorText: '#111827',
              colorTextSecondary: '#4B5563',
              colorInputText: '#111827',
              colorBackground: '#ffffff',
              fontFamily: "Publica Sans",
            },
            elements: {
              rootBox: 'bg-transparent',
              card: {
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '1rem',
                padding: '1.5rem 2rem',
                boxShadow: 'none',
                borderColor: 'transparent'
              },
              header: 'hidden',
              socialButtonsContainer: 'mb-4 gap-4',
              socialButtonsBlockButton:
                'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl py-2',
              dividerRow: 'my-5',
              dividerText: 'text-gray-500 text-xs',
              formFieldLabel: 'text-gray-800 text-sm font-medium mb-1',
              formInput:
                'bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder:text-gray-400 py-2',
              formButtonPrimary:
                'border border-[#9645FF] bg-white text-[#9645FF] hover:bg-purple-50 text-sm font-medium rounded-lg py-2.5 shadow-sm',
              alternativeMethodsContainer: 'pt-4',
              footer: 'bg-transparent pt-2',
              footerActionText: 'text-sm text-gray-500',
              footerActionLink: 'text-[#9645FF] hover:text-[#7d37d3] text-sm font-medium',
            }
          }}
        />

        {/* Cancel option */}
        <div className="text-center pt-2">
          <button
            onClick={() => navigate({ to: signInUrl })}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
} 
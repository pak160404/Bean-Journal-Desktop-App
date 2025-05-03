import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AuthenticateWithRedirectCallback, useClerk } from "@clerk/clerk-react";
import { useEffect } from "react";

export const Route = createFileRoute('/login/sso-callback')({
  component: SSOCallback,
});

function SSOCallback() {
  const navigate = useNavigate();
  const clerk = useClerk();

  // Add an effect to help track what's happening with the OAuth flow
  useEffect(() => {
    // Log the current URL to help with debugging
    console.log('SSO Callback URL:', window.location.href);
    
    // This will capture when Clerk's internal state indicates
    // the user needs to complete their sign-up
    const handleClerkCallback = async () => {
      try {
        if (clerk.client?.signUp) {
          console.log('SignUp state in callback:', clerk.client.signUp);
        }
        
        // Give time for the AuthenticateWithRedirectCallback to process
        const timeoutId = setTimeout(() => {
          // If we're still on this page after processing, check the URL for error params
          const urlParams = new URLSearchParams(window.location.search);
          const error = urlParams.get('error');
          const transferStatus = urlParams.get('transfer_status');
          
          if (error || transferStatus === 'needs_requirements') {
            console.log('Detected OAuth error or missing requirements, redirecting to continue page');
            navigate({ to: '/sign-up/continue' });
          }
        }, 2000); // Wait 2 seconds

        return () => clearTimeout(timeoutId);
      } catch (err) {
        console.error('Error handling OAuth callback redirection:', err);
      }
    };

    handleClerkCallback();
  }, [navigate, clerk]);

  // Use Clerk's prebuilt component to handle the OAuth callback with proper redirects
  return (
    <div>
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl mb-4">Completing authentication...</h2>
          <div className="w-12 h-12 rounded-full border-4 border-t-purple-500 border-purple-200 animate-spin mx-auto"></div>
        </div>
      </div>
      <AuthenticateWithRedirectCallback 
        continueSignUpUrl="/sign-up/continue"
        signInUrl="/login"
        signUpUrl="/sign-up"
      />
    </div>
  );
} 
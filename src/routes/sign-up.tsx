'use client'

import { createFileRoute } from '@tanstack/react-router'
import { SignUp } from '@clerk/clerk-react' // Import SignUp component

export const Route = createFileRoute('/sign-up')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-b from-[#f6efff] to-[#ead6ff] px-4 py-10">
      <div className="w-full max-w-sm space-y-6"> 

        {/* 1. Custom Header */} 
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full border-2 border-gray-900"></div> 
          <h1 className="text-xl font-semibold tracking-tight text-gray-900">
            Create your Bean Journal account
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Let's get you started!
          </p>
        </div>

        {/* 2. Clerk SignUp Component */} 
        <SignUp
          routing="virtual" // Use type assertion workaround
          signInUrl="/login"  
          appearance={{
             variables: { 
               colorPrimary: '#9645FF', 
               borderRadius: '1rem', 
               colorText: '#111827', 
               colorTextSecondary: '#4B5563', 
               colorInputText: '#111827',
               colorBackground: '#ffffff', 
             },
             elements: { 
               rootBox: 'bg-transparent',
               card: 'bg-white shadow-md border-none rounded-2xl p-6 md:p-8', 
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
      </div>
    </div>
  )
} 
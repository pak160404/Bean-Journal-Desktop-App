import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { ClerkProvider } from '@clerk/clerk-react'

//theme provider
import { ThemeProvider } from "@/components/shared/ThemeProvider";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

//global styles - REMOVED theme-specific imports
// import "./index.css"; 
// import "./app.css";

// Get your Clerk publishable key from environment variable
// You'll need to add this to your .env file
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
	throw new Error("Missing Clerk publishable key");
}

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
				<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
					<RouterProvider router={router} />
				</ThemeProvider>
			</ClerkProvider>
		</StrictMode>,
	);
}

import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

// components
import { ModeToggle } from "@/components/shared/ModeToggle";
import { Navbar } from "@/components/shared/Navbar";

export const Route = createRootRoute({
	component: () => (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<main className="flex-1 container mx-auto p-4">
				<Outlet />
			</main>
			<footer className="border-t py-4">
				<div className="container mx-auto flex justify-between items-center">
					<p className="text-sm">© 2024 Bean Journal</p>
					<ModeToggle />
				</div>
			</footer>
			<TanStackRouterDevtools />
		</div>
	),
});

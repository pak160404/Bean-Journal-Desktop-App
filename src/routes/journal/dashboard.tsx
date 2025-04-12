import { createFileRoute } from "@tanstack/react-router";
import { AuthWrapper } from "@/components/auth/AuthWrapper";

export const Route = createFileRoute("/journal/dashboard")({
  component: Dashboard
});

function Dashboard() {
  return (
    <AuthWrapper>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p>This is a protected route that only authenticated users can access.</p>
      </div>
    </AuthWrapper>
  );
}

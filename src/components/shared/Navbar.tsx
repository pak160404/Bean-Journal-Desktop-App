import { Link } from "@tanstack/react-router";
import { UserButton } from "../auth/AuthButtons";

export function Navbar() {
  return (
    <header className="border-b">
      <div className="container flex items-center justify-between h-16 mx-auto">
        <Link to="/" className="text-xl font-bold">
          Bean Journal
        </Link>
        <nav className="hidden space-x-4 md:flex">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <Link to="/dashboard" className="hover:text-primary">
            Dashboard
          </Link>
        </nav>
        <UserButton />
      </div>
    </header>
  );
}

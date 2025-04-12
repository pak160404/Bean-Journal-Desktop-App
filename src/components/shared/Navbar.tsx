import { Link } from "@tanstack/react-router";
import { UserButton } from "../auth/AuthButtons";

export function Navbar() {
  return (
    <header className="border-b border-[#e0e0e0] bg-white dark:bg-slate-900 dark:border-slate-800">
      <div className="container flex items-center justify-between h-16 mx-auto">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold flex items-center">
            <div className="w-8 h-8 mr-2 bg-gradient-to-br from-[#ffd1fb] to-[#ae70ff] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">B</span>
            </div>
            <span className="text-[#2f2569] dark:text-white">BeanJournal</span>
          </Link>
        </div>
        <nav className="hidden space-x-6 md:flex">
          <Link to="/" className="text-[#2f2569] dark:text-white hover:text-[#9645ff] dark:hover:text-[#9645ff] transition-colors">
            Home
          </Link>
          <Link to="/bean-journey" className="text-[#2f2569] dark:text-white hover:text-[#9645ff] dark:hover:text-[#9645ff] transition-colors">
            Bean Journey
          </Link>
          <Link to="/dashboard" className="text-[#2f2569] dark:text-white hover:text-[#9645ff] dark:hover:text-[#9645ff] transition-colors">
            Dashboard
          </Link>
        </nav>
        <div className="flex items-center">
          <UserButton />
        </div>
      </div>
    </header>
  );
}

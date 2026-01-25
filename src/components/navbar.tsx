import {
    SignedIn,
    SignedOut,
    SignInButton,
    SignUpButton,
    UserButton,
} from "@clerk/nextjs";
import { Github } from "lucide-react";
import Link from "next/link";
import { ThemeSwitcher } from "./theme-switcher";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname()
  const apiDashboardActive = pathname.includes("api-dashboard");
  const requestBinActive = pathname.includes("request-bin");
  
  return (
    <nav className="w-full py-5 flex gap-10 justify-between items-center dark:text-zinc-400 text-zinc-500">
      <div className="flex justify-center items-center gap-2">
        <SignedIn>
          <UserButton />
          <Link
            className={`${apiDashboardActive && " text-zinc-400 dark:text-zinc-300"} px-4 py-2 dark:hover:border-zinc-b-600/50 border hover:border-b-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 border-transparent rounded cursor-pointer transition-colors`}
            href={"/api-dashboard"}
          >
            Api Dashboard
          </Link>
          <Link
            className={`${requestBinActive && " text-zinc-400 dark:text-zinc-300"} px-4 py-2 dark:hover:border-zinc-b-600/50 border hover:border-b-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 border-transparent rounded cursor-pointer transition-colors`}
            href={"/request-bin"}
          >
            Request Bin
          </Link>
        </SignedIn>
        <SignedOut>
          <Link
            className="px-4 py-2 dark:hover:border-zinc-b-600/50 border hover:border-b-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 border-transparent rounded cursor-pointer transition-colors"
            href={"/"}
          >
            Home
          </Link>
          <SignInButton mode="modal" />
          <SignUpButton mode="modal" />
        </SignedOut>
      </div>
      <div className="flex justify-center items-center gap-4">
        <div className="rounded-full p-2 hover:text-zinc-600 cursor-pointer dark:hover:border-zinc-700 dark:hover:text-zinc-200 dark:hover:bg-zinc-800 transition-colors hover:border-zinc-300 border border-transparent">
          <a href="https://github.com/YugShrivastava/http-kit" target="_blank">
            <Github size="20" />
          </a>
        </div>
        <ThemeSwitcher />
      </div>
    </nav>
  );
}

import { Github, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <>
      <footer className="w-full mx-auto flex gap-4 justify-center items-center text-zinc-500 dark:text-zinc-400 border-2 border-t-zinc-200 dark:border-t-zinc-700 py-4">
        <div>
          Made with <span className="text-sm">❤️</span> by Yug
        </div>
        <div className="flex items-center">
          <a
            className="hover:bg-zinc-50 hover:border-zinc-300 border border-transparent hover:text-zinc-800 p-1.5 rounded-full dark:hover:bg-zinc-800 dark:hover:border-zinc-700 dark:hover:text-zinc-300 transition-colors"
            href="https://github.com/YugShrivastava"
          >
            <Github size={16} />
          </a>
          <a
            className="hover:bg-zinc-50 hover:border-zinc-300 border border-transparent hover:text-zinc-800 p-1.5 rounded-full dark:hover:bg-zinc-800 dark:hover:border-zinc-700 dark:hover:text-zinc-300 transition-colors"
            href="https://linkedin.com/in/yug-shrivastava"
          >
            <Linkedin size={16} />
          </a>
        </div>
      </footer>
    </>
  );
}

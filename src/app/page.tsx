import { ThemeSwitcher } from "@/components/theme-switcher";

export default function Home() {
  return (
    <main className="">
      <div className="absolute right-5 top-5"><ThemeSwitcher /></div>
      <header>
        <h1 className="text-3xl">http-kit</h1>
      </header>
    </main>
  );
}

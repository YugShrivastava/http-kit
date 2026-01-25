import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Toolkit | Api",
  description: "Api dashboard of toolkit",
};

export default function ApiDashboardPage() {
  return (
    <section>
      <h1 className="text-3xl">Api Dashboard</h1>
    </section>
  )
}
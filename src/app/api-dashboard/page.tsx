import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Toolkit | Api",
  description: "Api dashboard of toolkit",
};

export default function ApiDashboardPage() {
  return (
    <>
      {" "}
      <h1 className="text-3xl">Api Dashboard</h1>
      <div className="flex gap-10 justify-between w-full items-start">
        <section>
          <Button>
            Create api resource
          </Button>
        </section>
        <section></section>
      </div>
    </>
  );
}

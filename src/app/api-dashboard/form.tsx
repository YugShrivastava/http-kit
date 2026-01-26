"use client"

import { useUser } from "@clerk/nextjs";
import { createMockApi } from "@/actions/api-actions";
import { Button } from "@/components/ui/button";

export function Form() {
  const { user } = useUser();
  const action = async (formData: FormData) => {
    if (!user) return;
    formData.set("returnData", JSON.stringify({
      data: "mock",
      asli: true
    }))
    const res = await createMockApi(user.id, formData);
  }

  return (
    <>
      {" "}
      <h1 className="text-3xl">Api Dashboard</h1>
      <div className="flex gap-10 justify-between w-full items-start">
        <section>
          <form action={action}>
            <Button type="submit">Create api resource</Button>
          </form>
        </section>
        <section></section>
      </div>
    </>
  );
}
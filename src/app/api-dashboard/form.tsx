"use client"

import { deleteRequestLog } from "@/actions/bin-actions";
import { Button } from "@/components/ui/button";

export function Form() {  
  const action = async (formData: FormData) => {
    formData.set("binId", "BTqgPv");
    formData.set("id", "cmkwofw3c00067v0hqezd978x");
    //user_38lcQObbiza9MZJwIX9PL08FsEw
    const userId = "user_38lcQObbiza9MZJwIX9PL08FsEw";
    
    
    const res = await deleteRequestLog(userId, formData);
    console.log(res);
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
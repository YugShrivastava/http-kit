// app/api-dashboard/page.tsx
import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import {
  createMockApi,
  updateMockApi,
  deleteMockApi,
} from "@/actions/api-actions";

export const metadata: Metadata = {
  title: "Toolkit | API Dashboard",
};

export default async function ApiDashboardPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const apis = await prisma.api.findMany({
    where: { userId },
    orderBy: { id: "desc" },
  });

  return (
    <section className="max-w-5xl mx-auto flex flex-col gap-10">
      {/* Header */}
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold tracking-tight">
          API Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Read-only mock endpoints for development.
        </p>
      </header>

      {/* Create API */}
      <details className="group border rounded-xl bg-card">
        <summary className="cursor-pointer list-none px-6 py-4 flex justify-between items-center">
          <span className="text-sm font-medium">Create new API</span>
          <span className="text-xs text-muted-foreground group-open:hidden">
            +
          </span>
        </summary>

        <form
          action={async (formData) => {
            "use server";
            await createMockApi(userId, formData);
          }}
          className="px-6 pb-6 flex flex-col gap-4"
        >
          <textarea
            name="returnData"
            placeholder={`{\n  "feature": true\n}`}
            className="min-h-[140px] rounded-lg border bg-background p-4 font-mono text-sm"
            required
          />
          <div className="flex justify-end">
            <button className="px-4 py-2 rounded-lg border text-sm hover:bg-muted">
              Create API
            </button>
          </div>
        </form>
      </details>

      {/* APIs */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-muted-foreground">
          Your APIs ({apis.length})
        </h2>

        {apis.length === 0 && (
          <div className="border border-dashed rounded-xl p-10 text-center text-sm text-muted-foreground">
            No APIs created yet.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {apis.map((api) => (
            <details
              key={api.apiId}
              className="group border rounded-xl bg-card"
            >
              <summary className="list-none cursor-pointer px-5 py-4 flex justify-between items-center">
                <div className="flex flex-col">
                  <code className="font-mono text-sm">
                    /api/mock/{api.apiId}
                  </code>
                  <span className="text-xs text-muted-foreground">
                    GET
                  </span>
                </div>
                <span className="text-xs text-muted-foreground group-open:hidden">
                  View
                </span>
              </summary>

              <div className="px-5 pb-5 flex flex-col gap-4">
                <form
                  action={async (formData) => {
                    "use server";
                    await updateMockApi(userId, formData);
                  }}
                  className="flex flex-col gap-3"
                >
                  <input type="hidden" name="apiId" value={api.apiId} />
                  <textarea
                    name="data"
                    defaultValue={api.data}
                    className="min-h-[120px] rounded-lg border bg-background p-4 font-mono text-sm"
                  />
                  <div className="flex justify-between items-center">
                    <button className="text-xs px-3 py-1.5 rounded-md border hover:bg-muted">
                      Update
                    </button>
                  </div>
                </form>

                <form
                  action={async (formData) => {
                    "use server";
                    await deleteMockApi(userId, formData);
                  }}
                >
                  <input type="hidden" name="apiId" value={api.apiId} />
                  <button className="text-xs text-destructive hover:underline">
                    Delete
                  </button>
                </form>
              </div>
            </details>
          ))}
        </div>
      </section>
    </section>
  );
}

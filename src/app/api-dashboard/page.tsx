// app/api-dashboard/page.tsx
import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import {
  createMockApi,
  updateMockApi,
  deleteMockApi,
} from "@/actions/api-actions";
import { CopyButton } from "@/components/copy-button";

export const metadata: Metadata = {
  title: "Toolkit | API Dashboard",
};

export default async function ApiDashboardPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      apis: {
        orderBy: { id: "desc" },
      },
    },
  });

  if (!user) return null;

  const apis = user.apis;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

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

      {/* API Token Section */}
      <div className="border rounded-xl bg-card p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-medium">Your API Token</h3>
            <p className="text-xs text-muted-foreground">
              Include this token in the Authorization header as Bearer token
            </p>
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded-lg border bg-muted/30 px-4 py-2 font-mono text-sm">
              {user.token.slice(0, 8)}{"•".repeat(8)}
            </code>
            <CopyButton text={user.token} />
          </div>
        </div>
      </div>

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
          <div className="flex flex-col gap-2">
            <label htmlFor="returnData" className="text-xs font-medium text-muted-foreground">
              Response Data (JSON)
            </label>
            <textarea
              id="returnData"
              name="returnData"
              placeholder={`{\n  "feature": true,\n  "version": "1.0"\n}`}
              className="min-h-[140px] rounded-lg border bg-background p-4 font-mono text-sm"
              required
            />
          </div>
          <div className="flex justify-end">
            <button className="px-4 py-2 rounded-lg border text-sm hover:bg-muted transition">
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
          {apis.map((api) => {
            const endpointUrl = `${baseUrl}/api/mock/${api.apiId}`;
            
            return (
              <details
                key={api.apiId}
                className="group border rounded-xl bg-card"
              >
                <summary className="list-none cursor-pointer px-5 py-4 flex justify-between items-center">
                  <div className="flex flex-col gap-1">
                    <code className="font-mono text-sm">
                      /api/mock/{api.apiId}
                    </code>
                    <span className="text-xs text-muted-foreground">
                      GET, POST, PUT, PATCH, DELETE
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground group-open:hidden">
                    View
                  </span>
                </summary>

                <div className="px-5 pb-5 flex flex-col gap-4">
                  {/* Endpoint URL */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-muted-foreground">
                      Endpoint URL
                    </label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 rounded-lg border bg-muted/30 px-3 py-2 font-mono text-xs break-all">
                        {endpointUrl}
                      </code>
                      <CopyButton text={endpointUrl} />
                    </div>
                  </div>

                  {/* cURL Example */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-muted-foreground">
                      Example Request
                    </label>
                    <div className="relative">
                      <pre className="rounded-lg border bg-background p-3 font-mono text-xs overflow-x-auto">
{`curl -X GET '${endpointUrl}' \\
  -H 'Authorization: Bearer ${user.token}'`}
                      </pre>
                      <div className="absolute top-2 right-2">
                        <CopyButton 
                          text={`curl -X GET '${endpointUrl}' -H 'Authorization: Bearer ${user.token}'`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Update Form */}
                  <form
                    action={async (formData) => {
                      "use server";
                      await updateMockApi(userId, formData);
                    }}
                    className="flex flex-col gap-3"
                  >
                    <input type="hidden" name="apiId" value={api.apiId} />
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-medium text-muted-foreground">
                        Response Data
                      </label>
                      <textarea
                        name="data"
                        defaultValue={api.data}
                        className="min-h-[120px] rounded-lg border bg-background p-4 font-mono text-sm"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <button className="text-xs px-3 py-1.5 rounded-md border hover:bg-muted transition">
                        Update
                      </button>
                    </div>
                  </form>

                  {/* Delete */}
                  <form
                    action={async (formData) => {
                      "use server";
                      await deleteMockApi(userId, formData);
                    }}
                    className="pt-3 border-t"
                  >
                    <input type="hidden" name="apiId" value={api.apiId} />
                    <button className="text-xs text-destructive hover:underline">
                      Delete API
                    </button>
                  </form>
                </div>
              </details>
            );
          })}
        </div>
      </section>
    </section>
  );
}
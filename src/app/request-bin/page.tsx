// app/request-bin/page.tsx
import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import {
  createRequestBin,
  deleteRequestBin,
  deleteRequestLog,
} from "@/actions/bin-actions";

export const metadata: Metadata = {
  title: "Toolkit | Request Bin",
};

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;

export default async function RequestBinPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const bins = await prisma.bin.findMany({
    where: { userId },
    include: {
      logs: true
    },
    orderBy: { id: "desc" },
  });

  return (
    <section className="max-w-6xl mx-auto flex flex-col gap-12">
      {/* Header */}
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold tracking-tight">
          Request Bins
        </h1>
        <p className="text-sm text-muted-foreground">
          Capture and inspect incoming HTTP requests in real time.
        </p>
      </header>

      {/* Create Bin */}
      <details className="group border rounded-2xl bg-card overflow-hidden">
        <summary className="cursor-pointer list-none px-6 py-5 flex justify-between items-center">
          <span className="text-sm font-medium">Create new bin</span>
          <span className="text-xs text-muted-foreground group-open:hidden">
            +
          </span>
        </summary>

        <form
          action={async () => {
            "use server";
            await createRequestBin(userId);
          }}
          className="px-6 pb-6"
        >
          <div className="rounded-xl border bg-muted/30 p-5 flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              A unique endpoint will be generated automatically.
            </p>
            <button className="h-9 px-4 rounded-md border text-sm font-medium hover:bg-muted transition">
              Create Bin
            </button>
          </div>
        </form>
      </details>

      {/* Bins */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-muted-foreground">
          Your Bins ({bins.length})
        </h2>

        {bins.length === 0 && (
          <div className="border border-dashed rounded-xl p-10 text-center text-sm text-muted-foreground">
            No request bins created yet.
          </div>
        )}

        <div className="flex flex-col gap-4">
          {bins.map((bin) => {
            const logsByMethod = METHODS.reduce((acc, method) => {
              acc[method] = bin.logs.filter(
                (log) => log.method === method
              );
              return acc;
            }, {} as Record<string, typeof bin.logs>);

            return (
              <details
                key={bin.binId}
                className="group border rounded-2xl bg-card overflow-hidden"
              >
                {/* Bin header */}
                <summary className="list-none cursor-pointer px-6 py-5 flex justify-between items-center">
                  <div className="flex flex-col">
                    <code className="font-mono text-sm">
                      /api/bin/{bin.binId}
                    </code>
                    <span className="text-xs text-muted-foreground">
                      Any HTTP method
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground group-open:hidden">
                    Open
                  </span>
                </summary>

                {/* Bin content */}
                <div className="px-6 pb-6 flex flex-col gap-6">
                  {/* Logs by method */}
                  {METHODS.map((method) => {
                    const logs = logsByMethod[method];
                    if (!logs || logs.length === 0) return null;

                    return (
                      <div key={method} className="flex flex-col gap-2">
                        <h3 className="text-xs font-semibold tracking-wide text-muted-foreground">
                          {method}
                        </h3>

                        <div className="rounded-xl border bg-muted/30 divide-y">
                          {logs.map((log) => (
                            <details
                              key={log.id}
                              className="group px-4 py-3"
                            >
                              <summary className="cursor-pointer list-none flex justify-between items-center">
                                <span className="text-xs text-muted-foreground">
                                  {new Date(log.createdAt).toLocaleString()}
                                </span>
                                <span className="text-xs text-muted-foreground group-open:hidden">
                                  View
                                </span>
                              </summary>

                              <div className="mt-3 flex flex-col gap-3">
                                <pre className="rounded-lg border bg-background p-3 text-xs overflow-auto">
{JSON.stringify(
  {
    headers: log.headers,
    query: log.query,
    body: log.body,
  },
  null,
  2
)}
                                </pre>

                                <form
                                  action={async (formData) => {
                                    "use server";
                                    await deleteRequestLog(
                                      userId,
                                      formData
                                    );
                                  }}
                                >
                                  <input
                                    type="hidden"
                                    name="logId"
                                    value={log.id}
                                  />
                                  <button className="text-xs text-destructive hover:underline">
                                    Delete log
                                  </button>
                                </form>
                              </div>
                            </details>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {/* Delete bin */}
                  <form
                    action={async (formData) => {
                      "use server";
                      await deleteRequestBin(userId, formData);
                    }}
                    className="pt-4 border-t"
                  >
                    <input
                      type="hidden"
                      name="binId"
                      value={bin.binId}
                    />
                    <button className="text-xs text-destructive hover:underline">
                      Delete entire bin
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

// app/request-bin/page.tsx
import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import {
  createRequestBin,
  deleteRequestBin,
} from "@/actions/bin-actions";
import { CopyButton } from "@/components/copy-button";
import { RequestLogDialog } from "@/components/request-log-dialog";
import { DeleteConfirmButton } from "@/components/delete-confirm-button";

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
      logs: {
        orderBy: { timestamp: "desc" }
      }
    },
    orderBy: { id: "desc" },
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <section className="max-w-6xl mx-auto flex flex-col gap-12">
      {/* Header */}
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Request Bins
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Capture and inspect incoming HTTP requests in real time.
        </p>
      </header>

      {/* Create Bin */}
      <details className="group border rounded-xl bg-card overflow-hidden">
        <summary className="cursor-pointer list-none px-8 py-5 flex justify-between items-center">
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
          className="px-8 pb-8"
        >
          <div className="rounded-xl border bg-muted/30 p-6 flex justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              A unique endpoint will be generated automatically to capture all HTTP requests.
            </p>
            <button className="px-5 py-2.5 rounded-md border text-sm font-medium hover:bg-muted transition whitespace-nowrap">
              Create Bin
            </button>
          </div>
        </form>
      </details>

      {/* Bins */}
      <section className="flex flex-col gap-5">
        <h2 className="text-sm font-medium text-muted-foreground">
          Your Bins ({bins.length})
        </h2>

        {bins.length === 0 && (
          <div className="border border-dashed rounded-xl p-12 text-center">
            <p className="text-sm text-muted-foreground">
              No request bins yet. Create your first bin to start capturing requests!
            </p>
          </div>
        )}

        <div className="flex flex-col gap-5">
          {bins.map((bin) => {
            const binUrl = `${baseUrl}/api/bin/${bin.binId}`;
            const totalLogs = bin.logs.length;
            
            const logsByMethod = METHODS.reduce((acc, method) => {
              acc[method] = bin.logs.filter(
                (log) => log.method === method
              );
              return acc;
            }, {} as Record<string, typeof bin.logs>);

            return (
              <details
                key={bin.binId}
                className="group border rounded-xl bg-card overflow-hidden"
              >
                {/* Bin header */}
                <summary className="list-none cursor-pointer px-6 py-5 flex justify-between items-center">
                  <div className="flex flex-col gap-1.5">
                    <code className="font-mono text-sm">
                      /api/bin/{bin.binId}
                    </code>
                    <span className="text-xs text-muted-foreground">
                      {totalLogs} {totalLogs === 1 ? 'request' : 'requests'} captured
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground group-open:hidden">
                    Open
                  </span>
                </summary>

                {/* Bin content */}
                <div className="px-6 pb-6 flex flex-col gap-6">
                  {/* Endpoint URL */}
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-medium text-muted-foreground">
                      Endpoint URL
                    </label>
                    <div className="flex items-center gap-3">
                      <code className="flex-1 rounded-lg border bg-muted/30 px-4 py-3 font-mono text-xs break-all">
                        {binUrl}
                      </code>
                      <CopyButton text={binUrl} />
                    </div>
                  </div>

                  {/* cURL Example */}
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-medium text-muted-foreground">
                      Example Request
                    </label>
                    <div className="relative">
                      <pre className="rounded-lg border bg-background p-4 font-mono text-xs overflow-x-auto leading-relaxed">
{`curl -X POST '${binUrl}' \\
  -H 'Content-Type: application/json' \\
  -d '{"test": "data"}'`}
                      </pre>
                      <div className="absolute top-3 right-3">
                        <CopyButton 
                          text={`curl -X POST '${binUrl}' -H 'Content-Type: application/json' -d '{"test": "data"}'`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Request logs grouped by method */}
                  {totalLogs > 0 ? (
                    <div className="flex flex-col gap-4">
                      <h3 className="text-xs font-medium text-muted-foreground">
                        Captured Requests by Method
                      </h3>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {METHODS.map((method) => {
                          const logs = logsByMethod[method];
                          const count = logs?.length || 0;

                          return (
                            <RequestLogDialog
                              key={method}
                              method={method}
                              logs={logs || []}
                              count={count}
                              userId={userId}
                              binId={bin.binId}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed bg-muted/20 p-8 text-center">
                      <p className="text-sm text-muted-foreground">
                        No requests captured yet. Send a request to this endpoint to see it here!
                      </p>
                    </div>
                  )}

                  {/* Delete bin */}
                  <div className="pt-4 border-t">
                    <DeleteConfirmButton
                      itemType="bin"
                      itemName={`/api/bin/${bin.binId}`}
                      action={deleteRequestBin}
                      userId={userId}
                      formData={{ binId: bin.binId }}
                    />
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      </section>
    </section>
  );
}
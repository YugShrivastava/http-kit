"use client";

import { useState } from "react";
import { deleteRequestLog } from "@/actions/bin-actions";
import { CopyButton } from "./copy-button";

interface RequestLog {
  id: string;
  method: string;
  timestamp: Date;
  headers: string;
  body: string;
  query: string;
}

interface RequestLogDialogProps {
  method: string;
  logs: RequestLog[];
  count: number;
  userId: string;
  binId: string;
}

export function RequestLogDialog({
  method,
  logs,
  count,
  userId,
  binId,
}: RequestLogDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (logId: string) => {
    if (!confirm("Are you sure you want to delete this request log?")) {
      return;
    }

    setDeletingId(logId);
    const formData = new FormData();
    formData.append("id", logId);
    formData.append("binId", binId);
    
    await deleteRequestLog(userId, formData);
    setDeletingId(null);
    
    // Close dialog if no logs remain
    if (logs.length === 1) {
      setIsOpen(false);
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "POST":
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
      case "PUT":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
      case "PATCH":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      case "DELETE":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <>
      {/* Method Card Trigger */}
      <button
        onClick={() => count > 0 && setIsOpen(true)}
        disabled={count === 0}
        className={`rounded-lg border p-4 text-left transition ${
          count > 0
            ? "hover:bg-muted/50 cursor-pointer"
            : "opacity-50 cursor-not-allowed"
        }`}
      >
        <div className="flex flex-col gap-2">
          <span className={`text-xs font-semibold px-2 py-1 rounded border w-fit ${getMethodColor(method)}`}>
            {method}
          </span>
          <span className="text-sm font-medium">
            {count} {count === 1 ? "request" : "requests"}
          </span>
        </div>
      </button>

      {/* Dialog/Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card border rounded-xl shadow-lg w-full max-w-4xl max-h-[85vh] flex flex-col">
            {/* Dialog Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <span className={`text-xs font-semibold px-3 py-1.5 rounded border ${getMethodColor(method)}`}>
                  {method}
                </span>
                <h2 className="text-lg font-semibold">
                  {count} {count === 1 ? "Request" : "Requests"}
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Dialog Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex flex-col gap-4">
                {logs.length === 0 ? (
                  <div className="border border-dashed rounded-lg p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      No {method} requests captured yet.
                    </p>
                  </div>
                ) : (
                  logs.map((log, index) => {
                    let parsedHeaders, parsedQuery, parsedBody;
                    
                    try {
                      parsedHeaders = JSON.parse(log.headers);
                    } catch {
                      parsedHeaders = log.headers;
                    }
                    
                    try {
                      parsedQuery = JSON.parse(log.query);
                    } catch {
                      parsedQuery = log.query;
                    }
                    
                    try {
                      parsedBody = log.body ? JSON.parse(log.body) : null;
                    } catch {
                      parsedBody = log.body;
                    }

                    const fullRequest = {
                      method: log.method,
                      timestamp: log.timestamp,
                      headers: parsedHeaders,
                      query: parsedQuery,
                      body: parsedBody,
                    };

                    return (
                      <details
                        key={log.id}
                        className="group border rounded-lg bg-muted/30 overflow-hidden"
                      >
                        <summary className="cursor-pointer list-none px-5 py-4 flex justify-between items-center hover:bg-muted/50 transition">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium font-mono">
                              Request #{logs.length - index}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(log.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground group-open:hidden">
                            View Details
                          </span>
                        </summary>

                        <div className="px-5 pb-5 pt-2 flex flex-col gap-4">
                          {/* Headers */}
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-medium text-muted-foreground">
                                Headers
                              </label>
                              <CopyButton text={JSON.stringify(parsedHeaders, null, 2)} />
                            </div>
                            <pre className="rounded-lg border bg-background p-4 text-xs overflow-x-auto leading-relaxed">
{JSON.stringify(parsedHeaders, null, 2)}
                            </pre>
                          </div>

                          {/* Query Parameters */}
                          {parsedQuery && Object.keys(parsedQuery).length > 0 && (
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-medium text-muted-foreground">
                                  Query Parameters
                                </label>
                                <CopyButton text={JSON.stringify(parsedQuery, null, 2)} />
                              </div>
                              <pre className="rounded-lg border bg-background p-4 text-xs overflow-x-auto leading-relaxed">
{JSON.stringify(parsedQuery, null, 2)}
                              </pre>
                            </div>
                          )}

                          {/* Body */}
                          {log.body && (
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-medium text-muted-foreground">
                                  Request Body
                                </label>
                                <CopyButton text={typeof parsedBody === 'string' ? parsedBody : JSON.stringify(parsedBody, null, 2)} />
                              </div>
                              <pre className="rounded-lg border bg-background p-4 text-xs overflow-x-auto leading-relaxed">
{typeof parsedBody === 'string' ? parsedBody : JSON.stringify(parsedBody, null, 2)}
                              </pre>
                            </div>
                          )}

                          {/* Full Request Copy */}
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-medium text-muted-foreground">
                                Complete Request
                              </label>
                              <CopyButton text={JSON.stringify(fullRequest, null, 2)} />
                            </div>
                          </div>

                          {/* Delete Log */}
                          <div className="pt-3 border-t flex justify-between items-center">
                            <button
                              onClick={() => handleDelete(log.id)}
                              disabled={deletingId === log.id}
                              className="text-xs text-destructive hover:underline disabled:opacity-50"
                            >
                              {deletingId === log.id ? "Deleting..." : "Delete this log"}
                            </button>
                          </div>
                        </div>
                      </details>
                    );
                  })
                )}
              </div>
            </div>

            {/* Dialog Footer */}
            <div className="p-6 border-t flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2.5 rounded-md border text-sm font-medium hover:bg-muted transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
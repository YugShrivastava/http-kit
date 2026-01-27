-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RequestLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "binId" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "headers" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    CONSTRAINT "RequestLog_binId_fkey" FOREIGN KEY ("binId") REFERENCES "Bin" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_RequestLog" ("binId", "body", "headers", "id", "method", "query", "timestamp") SELECT "binId", "body", "headers", "id", "method", "query", "timestamp" FROM "RequestLog";
DROP TABLE "RequestLog";
ALTER TABLE "new_RequestLog" RENAME TO "RequestLog";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

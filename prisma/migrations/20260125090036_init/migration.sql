-- CreateTable
CREATE TABLE "Api" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "routeId" TEXT NOT NULL,
    "name" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Api_routeId_key" ON "Api"("routeId");

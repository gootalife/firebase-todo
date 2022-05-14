-- CreateTable
CREATE TABLE "tasks" (
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "created_at" TEXT NOT NULL,
    "updated_at" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL
);

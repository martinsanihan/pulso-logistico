/*
  Warnings:

  - A unique constraint covering the columns `[web]` on the table `auspiciadores` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "auspiciadores_web_key" ON "auspiciadores"("web");

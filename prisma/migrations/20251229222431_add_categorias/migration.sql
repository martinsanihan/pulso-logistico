/*
  Warnings:

  - You are about to drop the `Categoria` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Categoria";

-- CreateTable
CREATE TABLE "categorias" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "desc" TEXT,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

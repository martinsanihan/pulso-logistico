/*
  Warnings:

  - You are about to drop the `Contenido` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Contenido" DROP CONSTRAINT "Contenido_productoId_fkey";

-- DropTable
DROP TABLE "Contenido";

-- CreateTable
CREATE TABLE "contenidos_productos" (
    "id" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "cuerpo" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "tipoRequerido" INTEGER NOT NULL,
    "orden" INTEGER NOT NULL,

    CONSTRAINT "contenidos_productos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "contenidos_productos" ADD CONSTRAINT "contenidos_productos_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `stock` on the `productos` table. All the data in the column will be lost.
  - You are about to drop the column `subcategoria` on the `productos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "productos" DROP COLUMN "stock",
DROP COLUMN "subcategoria",
ADD COLUMN     "archivo" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "type" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Contenido" (
    "id" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "cuerpo" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "tipoRequerido" INTEGER NOT NULL,
    "orden" INTEGER NOT NULL,

    CONSTRAINT "Contenido_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Contenido" ADD CONSTRAINT "Contenido_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

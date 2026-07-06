/*
  Warnings:

  - Changed the type of `tipo` on the `movimentacao` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TipoMovimentacao" AS ENUM ('ENTRADA', 'SAIDA', 'AJUSTE');

-- DropForeignKey
ALTER TABLE "movimentacao" DROP CONSTRAINT "movimentacao_produtoId_fkey";

-- AlterTable
ALTER TABLE "movimentacao" DROP COLUMN "tipo",
ADD COLUMN     "tipo" "TipoMovimentacao" NOT NULL;

-- AddForeignKey
ALTER TABLE "movimentacao" ADD CONSTRAINT "movimentacao_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

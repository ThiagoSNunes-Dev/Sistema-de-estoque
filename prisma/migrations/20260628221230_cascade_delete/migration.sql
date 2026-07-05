-- DropForeignKey
ALTER TABLE "movimentacao" DROP CONSTRAINT "movimentacao_produtoId_fkey";

-- AddForeignKey
ALTER TABLE "movimentacao" ADD CONSTRAINT "movimentacao_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

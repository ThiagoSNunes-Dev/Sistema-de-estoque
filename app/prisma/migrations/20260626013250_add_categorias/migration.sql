/*
  Warnings:

  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Product";

-- CreateTable
CREATE TABLE "fornecedor" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "contato" VARCHAR(255),
    "endereco" VARCHAR(255),

    CONSTRAINT "fornecedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produto" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "descricao" TEXT,
    "datadecompra" TIMESTAMP(6),
    "datavalidade" TIMESTAMP(6),
    "quantidade" INTEGER NOT NULL DEFAULT 0,
    "quantidademinima" INTEGER NOT NULL DEFAULT 5,
    "preco" DOUBLE PRECISION,
    "categoriaId" INTEGER,
    "fornecedorid" INTEGER,

    CONSTRAINT "produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nome_key" ON "Categoria"("nome");

-- AddForeignKey
ALTER TABLE "produto" ADD CONSTRAINT "produto_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produto" ADD CONSTRAINT "fk_fornecedor" FOREIGN KEY ("fornecedorid") REFERENCES "fornecedor"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

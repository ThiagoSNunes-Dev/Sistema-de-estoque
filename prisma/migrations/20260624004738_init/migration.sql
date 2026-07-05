-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "quantidade" INTEGER NOT NULL,
    "quantidademinima" INTEGER NOT NULL DEFAULT 5,
    "categoria" TEXT,
    "preco" DOUBLE PRECISION,
    "dataValidade" TIMESTAMP(3),

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

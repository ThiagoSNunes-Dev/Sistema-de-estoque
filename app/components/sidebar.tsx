"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Botão hambúrguer (aparece apenas no celular) */}
      <button
          onClick={() => setOpen(true)}
          className="fixed left-4 top-4 z-50 rounded-xl bg-zinc-900 p-3 text-white shadow-lg lg:hidden"
        >
        <Menu size={28} />
      </button>

      {/* Fundo escurecido */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          h-screen w-64
          bg-zinc-900 text-white p-6
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:min-h-screen
        `}
      >
        {/* Botão fechar */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Estoque</h2>

          <button
            onClick={() => setOpen(false)}
            className="text-2xl lg:hidden"
          >
            <X size={28} />
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="rounded-lg p-3 hover:bg-zinc-800 transition"
          >
            Dashboard
          </Link>

          <div className="my-2 border-t border-zinc-700" />

          <Link
            href="/estoque"
            onClick={() => setOpen(false)}
            className="rounded-lg p-3 hover:bg-zinc-800 transition"
          >
            Produtos
          </Link>

          <Link
            href="/movimentacoes"
            onClick={() => setOpen(false)}
            className="rounded-lg p-3 hover:bg-zinc-800 transition"
          >
            Movimentações
          </Link>

          <div className="my-2 border-t border-zinc-700" />

          <Link
            href="/alertas"
            onClick={() => setOpen(false)}
            className="rounded-lg p-3 hover:bg-zinc-800 transition"
          >
            Alertas
          </Link>

          <Link
            href="/relatorios"
            onClick={() => setOpen(false)}
            className="rounded-lg p-3 hover:bg-zinc-800 transition"
          >
            Relatórios
          </Link>

          <Link
            href="/categorias"
            onClick={() => setOpen(false)}
            className="rounded-lg p-3 hover:bg-zinc-800 transition"
          >
            Categorias
          </Link>
        </nav>
      </aside>
    </>
  );
}
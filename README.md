# 📦 Sistema de Gerenciamento de Estoque

Sistema web para gerenciamento de estoque desenvolvido com **Next.js**, **React**, **TypeScript**, **Prisma ORM** e **PostgreSQL**. O projeto tem como objetivo facilitar o controle de produtos, categorias e fornecedores, oferecendo uma interface moderna e intuitiva para pequenos e médios negócios.

## ✨ Funcionalidades

- 📋 Cadastro, edição e exclusão de produtos
- 📦 Controle da quantidade em estoque
- ⚠️ Definição de estoque mínimo
- 🗂️ Gerenciamento de categorias
- 🚚 Cadastro de fornecedores
- 📅 Controle de data de compra e validade
- 💰 Registro do preço dos produtos
- 🔍 Pesquisa e organização dos itens
- 📱 Interface responsiva

## 🛠️ Tecnologias Utilizadas

- Next.js
- React
- TypeScript
- Prisma ORM
- PostgreSQL
- Tailwind CSS
- Zod

## 📂 Estrutura do Projeto

```
app/
components/
lib/
prisma/
public/
```

## 🚀 Como executar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
```

### 2. Entre na pasta

```bash
cd seu-repositorio
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="sua-string-de-conexao"
```

### 5. Execute as migrações

```bash
npx prisma migrate dev
```

### 6. Inicie o projeto

```bash
npm run dev
```

A aplicação estará disponível em:

```
http://localhost:3000
```

## 🗄️ Banco de Dados

O sistema utiliza **PostgreSQL** como banco de dados e o **Prisma ORM** para manipulação das informações.

As principais entidades são:

- Produto
- Categoria
- Fornecedor

## 🎯 Objetivo

O projeto foi desenvolvido com foco em fornecer uma solução simples, eficiente e de baixo custo para o gerenciamento de estoque, permitindo maior organização dos produtos e redução de perdas por falta de controle.

## 📸 Demonstração

Adicione aqui imagens ou GIFs do sistema.

Exemplo:

```
/public/images/home.png
/public/images/produtos.png
/public/images/categorias.png
```

## 🔮 Melhorias Futuras

- Sistema de autenticação
- Controle de usuários
- Dashboard com gráficos
- Relatórios em PDF
- Exportação para Excel
- Histórico de movimentações
- Controle de vendas

## 👨‍💻 Autor

Desenvolvido por **Thiago**.

---

⭐ Caso este projeto seja útil, deixe uma estrela no repositório!

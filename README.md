<img width="1901" height="944" alt="image" src="https://github.com/user-attachments/assets/5e7c6205-48d1-4d72-9efb-3636965e4a16" /># 📦 Sistema de Gerenciamento de Estoque

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

Exemplo:

```
<img width="1920" height="951" alt="image" src="https://github.com/user-attachments/assets/9866ac77-c8f2-4331-b92d-ee2c76b0a985" />
<img width="1903" height="948" alt="image" src="https://github.com/user-attachments/assets/8534b1a2-5339-4a43-9fdf-7db0e9367833" />
<img width="1895" height="947" alt="image" src="https://github.com/user-attachments/assets/c2523c7c-7627-414a-99a6-655798933655" />
<img width="1901" height="944" alt="image" src="https://github.com/user-attachments/assets/12b01902-fe7b-4484-bc56-325fae38d877" />
<img width="1899" height="944" alt="image" src="https://github.com/user-attachments/assets/9f73f325-ed21-4550-aaf1-a1bd3a00198f" />
<img width="1919" height="949" alt="image" src="https://github.com/user-attachments/assets/69e03cc3-3b7b-4840-a663-1810db96ddec" />

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

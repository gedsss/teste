# AgroVendas API

API REST para o marketplace de veículos **AgroVendas**, construída com Node.js + Fastify + TypeScript + Prisma + PostgreSQL.

## Stack

- **Node.js** — Runtime JavaScript
- **Fastify** — Framework web rápido e de baixo overhead
- **TypeScript** — Tipagem estática
- **Prisma** — ORM moderno para PostgreSQL
- **PostgreSQL** — Banco de dados relacional
- **Zod** — Validação de dados

## Pré-requisitos

- Node.js 18+
- PostgreSQL rodando localmente ou em nuvem (ex: Railway, Supabase, Neon)
- npm ou pnpm

## Setup

### 1. Clone o repositório

```bash
git clone https://github.com/gedsss/teste.git
cd teste
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo e edite com suas configurações:

```bash
cp .env.example .env
```

Edite o `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/agrovendas?schema=public"
PORT=3333
HOST=0.0.0.0
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

> **Dica:** Para criar o banco no PostgreSQL local:
> ```sql
> CREATE DATABASE agrovendas;
> ```

### 4. Execute as migrations do Prisma

```bash
npm run prisma:migrate
```

Isso criará todas as tabelas no banco de dados.

### 5. Popule o banco com dados de exemplo (seed)

```bash
npm run prisma:seed
```

Isso criará 8 anúncios de veículos, categorias e vendedores baseados nos dados mock do frontend.

### 6. Inicie o servidor

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3333`.

## Scripts disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o servidor em modo desenvolvimento (hot reload) |
| `npm run build` | Compila TypeScript para JavaScript |
| `npm run start` | Inicia o servidor em produção (requer build) |
| `npm run prisma:migrate` | Executa as migrations do banco de dados |
| `npm run prisma:seed` | Popula o banco com dados de exemplo |
| `npm run prisma:studio` | Abre o Prisma Studio (interface gráfica do banco) |
| `npm run prisma:generate` | Gera o Prisma Client |

## Endpoints da API

### Health Check

```
GET /health
```

### Listings (Anúncios)

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/listings` | Listar anúncios com filtros e paginação |
| `GET` | `/api/listings/:id` | Detalhe de um anúncio |
| `POST` | `/api/listings` | Criar novo anúncio |
| `PUT` | `/api/listings/:id` | Atualizar anúncio completo |
| `PATCH` | `/api/listings/:id/status` | Alterar status do anúncio |
| `DELETE` | `/api/listings/:id` | Deletar anúncio |

#### Query params para GET /api/listings

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `category` | string | Filtrar por categoria (slug: carros, motos, etc.) |
| `state` | string | Filtrar por estado (UF: SP, RJ, etc.) |
| `condition` | string | Filtrar por condição (novo, seminovo, usado) |
| `fuel` | string | Filtrar por combustível |
| `transmission` | string | Filtrar por câmbio |
| `minPrice` | number | Preço mínimo |
| `maxPrice` | number | Preço máximo |
| `minYear` | number | Ano mínimo |
| `maxYear` | number | Ano máximo |
| `brand` | string | Filtrar por marca |
| `search` | string | Busca textual (título, marca, modelo, descrição) |
| `featured` | boolean | Apenas destaques |
| `status` | string | Filtrar por status (ativo, vendido, pausado) |
| `page` | number | Página (padrão: 1) |
| `limit` | number | Itens por página (padrão: 12, máximo: 100) |
| `sort` | string | Ordenar por: createdAt, price, year, km |
| `order` | string | Direção: asc, desc (padrão: desc) |

#### Resposta paginada

```json
{
  "data": [...],
  "page": 1,
  "limit": 12,
  "total": 8,
  "totalPages": 1
}
```

#### Body para POST /api/listings

```json
{
  "title": "Ford Ranger XLT 4x4 Diesel 2022",
  "category": "pickups",
  "price": 189900,
  "year": 2022,
  "brand": "Ford",
  "model": "Ranger XLT",
  "km": 35000,
  "fuel": "diesel",
  "transmission": "automatico",
  "color": "Branco",
  "location": "São Paulo",
  "state": "SP",
  "description": "Descrição detalhada do veículo com pelo menos 30 caracteres.",
  "images": ["https://exemplo.com/foto.jpg"],
  "condition": "usado",
  "sellerName": "João Silva",
  "sellerPhone": "(11) 99999-1111"
}
```

### Categories (Categorias)

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/categories` | Listar todas as categorias |

### Options (Opções)

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/options/fuels` | Listar tipos de combustível |
| `GET` | `/api/options/transmissions` | Listar tipos de câmbio |
| `GET` | `/api/options/states` | Listar estados brasileiros |

## Estrutura do projeto

```
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── README.md
├── prisma/
│   ├── schema.prisma          # Modelos: Listing, Seller, Category
│   └── seed.ts                # Seed com dados mock do frontend
└── src/
    ├── server.ts              # Entry point, registra plugins e rotas
    ├── app.ts                 # Criação da instância Fastify
    ├── config/
    │   └── env.ts             # Variáveis de ambiente tipadas com Zod
    ├── lib/
    │   └── prisma.ts          # Instância singleton do PrismaClient
    ├── modules/
    │   ├── listings/
    │   │   ├── listings.routes.ts
    │   │   ├── listings.controller.ts
    │   │   ├── listings.service.ts
    │   │   ├── listings.schema.ts
    │   │   └── listings.types.ts
    │   ├── categories/
    │   │   ├── categories.routes.ts
    │   │   └── categories.controller.ts
    │   └── options/
    │       ├── options.routes.ts
    │       └── options.controller.ts
    ├── plugins/
    │   └── cors.ts
    └── utils/
        └── formatters.ts
```

## Modelos do banco de dados

### Listing
- `id`, `title`, `type`, `price`, `priceUnit`, `year`, `brand`, `model`
- `km`, `fuel` (enum), `transmission` (enum), `color`
- `location`, `state`, `description`, `images` (array)
- `status` (enum: ativo/vendido/pausado), `featured`, `condition` (enum)
- `categoryId` → Category, `sellerId` → Seller

### Seller
- `id`, `name`, `phone`, `rating`, `since`

### Category
- `id`, `slug`, `label`, `icon`

## Integração com o Frontend (AgroVendas)

Para conectar o frontend AgroVendas a esta API:

1. Inicie esta API na porta 3333
2. No frontend, substitua as chamadas de mock pela URL da API: `http://localhost:3333`
3. Configure o `FRONTEND_URL` no `.env` com a URL do frontend para o CORS funcionar corretamente

## Licença

MIT

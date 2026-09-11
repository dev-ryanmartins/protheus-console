# Protheus Console

Painel operacional para consultas e integrações simuladas com o ERP Protheus da TOTVS.

O projeto reúne uma API REST em Node.js/TypeScript e uma interface web em React,
Vite e Tailwind CSS. A aplicação funciona localmente sem uma instância do
Protheus: os dados de demonstração ficam organizados em arquivos JSON e os
endpoints simulam consultas de cadastros, execução de rotinas e posição de
estoque.

## Funcionalidades

- Dashboard com faturamento, pedidos, clientes, taxa de sucesso e saúde das integrações
- Consultas paginadas e filtráveis de clientes, produtos e pedidos
- Execução simulada de rotinas Web Service do Protheus
- Consulta de estoque inspirada em uma API REST TLPP
- Validação de entrada com Zod
- Contratos OpenAPI e hooks React Query gerados automaticamente
- Exemplos de ponto de entrada ADVPL e API REST TLPP em `artifacts/api-server/docs`

## Estrutura

```text
artifacts/
├── api-server/          # API Express e dados locais
└── protheus-console/    # Dashboard React/Vite
lib/
├── api-spec/            # Contrato OpenAPI
├── api-client-react/    # Hooks React gerados
└── api-zod/             # Schemas Zod gerados
```

## Requisitos

- Node.js 24+
- pnpm 10+

## Executando localmente

Instale as dependências:

```bash
pnpm install
```

Em terminais separados, inicie a API e o dashboard:

```bash
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/protheus-console run dev
```

O workspace fornece `PORT` e `BASE_PATH` para o dashboard quando executado
pelos workflows do ambiente.

## API

As rotas ficam disponíveis sob `/api`:

- `GET /api/healthz`
- `GET /api/dashboard/summary`
- `GET /api/customers?page=1&pageSize=10&search=`
- `GET /api/products?page=1&pageSize=10&search=`
- `GET /api/orders?page=1&pageSize=10&search=`
- `POST /api/protheus/routines/execute`
- `GET /api/protheus/stock?productCode=`

Depois de alterar `lib/api-spec/openapi.yaml`, regenere os contratos:

```bash
pnpm --filter @workspace/api-spec run codegen
```

## Verificações

```bash
pnpm run typecheck
pnpm --filter @workspace/protheus-console run build
pnpm --filter @workspace/api-server run build
```

## Observação

Os arquivos ADVPL e TLPP são exemplos de integração e documentação. Eles não
são compilados pelo Node.js nem executam rotinas em um ambiente Protheus real.
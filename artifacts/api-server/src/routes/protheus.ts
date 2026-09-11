import { Router, type IRouter, type Request, type Response } from "express";
import {
  ExecuteProtheusRoutineBody,
  GetStockQueryParams,
  ListCustomersQueryParams,
  ListOrdersQueryParams,
  ListProductsQueryParams,
} from "@workspace/api-zod";
import customers from "../data/customers.json";
import products from "../data/products.json";
import orders from "../data/orders.json";

const router: IRouter = Router();

type Searchable = Record<string, string | number>;

function paginated<T extends Searchable>(
  items: T[],
  page: number,
  pageSize: number,
  search?: string,
) {
  const normalized = search?.trim().toLocaleLowerCase("pt-BR");
  const filtered = normalized
    ? items.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLocaleLowerCase("pt-BR").includes(normalized),
        ),
      )
    : items;
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    data: filtered.slice(start, start + pageSize),
    pagination: { page: safePage, pageSize, total, totalPages },
  };
}

function queryError(res: Response, message: string) {
  res.status(400).json({ error: { code: "VALIDATION_ERROR", message } });
}

router.get("/dashboard/summary", (_req, res) => {
  res.json({
    totalRevenue: 1842650,
    revenueChange: 12.8,
    orderCount: 248,
    customerCount: customers.length * 18,
    productCount: products.length * 34,
    successRate: 98.6,
    revenueSeries: [
      { month: "Mar", revenue: 1180000, orders: 154 },
      { month: "Abr", revenue: 1265000, orders: 169 },
      { month: "Mai", revenue: 1390000, orders: 181 },
      { month: "Jun", revenue: 1510000, orders: 204 },
      { month: "Jul", revenue: 1635000, orders: 221 },
      { month: "Ago", revenue: 1768000, orders: 236 },
      { month: "Set", revenue: 1842650, orders: 248 },
    ],
    integrations: [
      { name: "Protheus REST", status: "Operacional", latency: 128, lastSync: "há 2 min" },
      { name: "Web Service SOAP", status: "Operacional", latency: 312, lastSync: "há 5 min" },
      { name: "E-commerce B2B", status: "Atenção", latency: 890, lastSync: "há 18 min" },
      { name: "Transportadoras", status: "Operacional", latency: 204, lastSync: "há 8 min" },
    ],
    activities: [
      { id: "act-001", title: "Sincronização concluída", description: "248 pedidos importados do Protheus", timestamp: "há 2 min", tone: "success" },
      { id: "act-002", title: "Rotina executada", description: "MATA410 · Atualização de pedidos", timestamp: "há 11 min", tone: "info" },
      { id: "act-003", title: "Latência elevada", description: "E-commerce B2B acima de 800ms", timestamp: "há 18 min", tone: "warning" },
      { id: "act-004", title: "Consulta de estoque", description: "API TLPP respondeu em 94ms", timestamp: "há 26 min", tone: "success" },
    ],
  });
});

router.get("/customers", (req, res) => {
  const parsed = ListCustomersQueryParams.safeParse(req.query);
  if (!parsed.success) return queryError(res, "Parâmetros de clientes inválidos.");
  res.json(paginated(customers, parsed.data.page, parsed.data.pageSize, parsed.data.search));
});

router.get("/products", (req, res) => {
  const parsed = ListProductsQueryParams.safeParse(req.query);
  if (!parsed.success) return queryError(res, "Parâmetros de produtos inválidos.");
  res.json(paginated(products, parsed.data.page, parsed.data.pageSize, parsed.data.search));
});

router.get("/orders", (req, res) => {
  const parsed = ListOrdersQueryParams.safeParse(req.query);
  if (!parsed.success) return queryError(res, "Parâmetros de pedidos inválidos.");
  res.json(paginated(orders, parsed.data.page, parsed.data.pageSize, parsed.data.search));
});

router.post("/protheus/routines/execute", (req, res) => {
  const parsed = ExecuteProtheusRoutineBody.safeParse(req.body);
  if (!parsed.success) return queryError(res, "Código ou parâmetros da rotina inválidos.");
  const startedAt = new Date().toISOString();
  const routineCode = parsed.data.routineCode.toUpperCase();
  const knownRoutines = ["MATA010", "MATA410", "MATA461", "MATA103", "MSExecAuto"];
  const known = knownRoutines.includes(routineCode);
  req.log.info({ routineCode, known }, "Simulated Protheus routine executed");
  res.json({
    executionId: `exec-${Date.now()}`,
    routineCode,
    status: known ? "Sucesso" : "Erro",
    message: known
      ? `Rotina ${routineCode} executada com sucesso no ambiente Protheus simulado.`
      : `Rotina ${routineCode} não está disponível neste ambiente simulado.`,
    startedAt,
    durationMs: known ? 128 : 42,
  });
});

router.get("/protheus/stock", (req, res) => {
  const parsed = GetStockQueryParams.safeParse(req.query);
  if (!parsed.success) return queryError(res, "Código do produto inválido.");
  const productCode = parsed.data.productCode?.trim().toLowerCase();
  const stockItems = products
    .filter((product) => !productCode || product.code.toLowerCase().includes(productCode))
    .slice(0, 8)
    .flatMap((product) => [
      {
        productCode: product.code,
        productName: product.name,
        warehouse: "01 · Matriz",
        available: Math.round(product.stock * 0.62),
        reserved: Math.round(product.stock * 0.08),
        updatedAt: "2026-09-11T14:32:00.000Z",
      },
      {
        productCode: product.code,
        productName: product.name,
        warehouse: "02 · Filial Sul",
        available: Math.round(product.stock * 0.3),
        reserved: Math.round(product.stock * 0.04),
        updatedAt: "2026-09-11T14:29:00.000Z",
      },
    ]);
  res.json({
    items: stockItems,
    totalAvailable: stockItems.reduce((sum, item) => sum + item.available, 0),
    queriedAt: new Date().toISOString(),
  });
});

export default router;
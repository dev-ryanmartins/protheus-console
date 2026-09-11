import { ArrowDownRight, ArrowUpRight, Check, Clock3, ExternalLink, RefreshCw, ShieldCheck, Signal, TriangleAlert } from 'lucide-react';
import { Link } from 'wouter';
import { useGetDashboardSummary, useHealthCheck } from '@workspace/api-client-react';
import type { Activity, IntegrationStatus, RevenuePoint } from '@workspace/api-client-react';
import { ErrorState, PageHeader, SkeletonRows, StatusPill } from '@/components/console-layout';

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const number = new Intl.NumberFormat('pt-BR');

function RevenueChart({ points }: { points: RevenuePoint[] }) {
  if (!points.length) return <div className="flex h-[210px] items-center justify-center text-xs text-muted-foreground">Sem dados de faturamento no período.</div>;
  const max = Math.max(...points.map((point) => point.revenue), 1);
  const coords = points.map((point, index) => `${(index / Math.max(points.length - 1, 1)) * 100},${188 - (point.revenue / max) * 150}`).join(' ');
  return (
    <div className="relative h-[220px] pt-4">
      <div className="absolute inset-x-0 top-4 bottom-7 flex flex-col justify-between">
        {[0, 1, 2, 3].map((line) => <div key={line} className="border-t border-dashed border-border/70" />)}
      </div>
      <svg className="relative h-[188px] w-full overflow-visible" viewBox="0 0 100 188" preserveAspectRatio="none" aria-label="Gráfico de faturamento">
        <defs><linearGradient id="revenue-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="hsl(18 82% 55%)" stopOpacity=".25" /><stop offset="1" stopColor="hsl(18 82% 55%)" stopOpacity="0" /></linearGradient></defs>
        <polygon points={`0,188 ${coords} 100,188`} fill="url(#revenue-fill)" />
        <polyline points={coords} fill="none" stroke="hsl(18 82% 55%)" strokeWidth="1.7" vectorEffect="non-scaling-stroke" />
        {points.map((point, index) => <circle key={point.month} cx={(index / Math.max(points.length - 1, 1)) * 100} cy={188 - (point.revenue / max) * 150} r="2.5" fill="hsl(42 38% 99%)" stroke="hsl(18 82% 55%)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />)}
      </svg>
      <div className="absolute inset-x-0 bottom-0 flex justify-between font-mono-ui text-[9px] uppercase text-muted-foreground">{points.map((point) => <span key={point.month}>{point.month}</span>)}</div>
    </div>
  );
}

function Kpi({ label, value, delta, detail, accent }: { label: string; value: string; delta?: number; detail: string; accent: string }) {
  return <div className="card-surface relative overflow-hidden p-5"><div className={`absolute left-0 top-0 h-1 w-16 ${accent}`} /><div className="font-mono-ui text-[10px] uppercase tracking-[.14em] text-muted-foreground">{label}</div><div className="mt-4 flex items-end justify-between gap-2"><div data-testid={`kpi-value-${label}`} className="text-[26px] font-bold tracking-[-.05em]">{value}</div>{delta !== undefined && <span className={`mb-1 inline-flex items-center gap-0.5 font-mono-ui text-[10px] ${delta >= 0 ? 'text-[#2f806e]' : 'text-[#a14b42]'}`}>{delta >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{Math.abs(delta).toFixed(1).replace('.', ',')}%</span>}</div><div className="mt-2 text-[11px] text-muted-foreground">{detail}</div></div>;
}

function IntegrationRow({ integration }: { integration: IntegrationStatus }) {
  const tone = integration.status === 'Operacional' ? 'good' : integration.status === 'Atenção' ? 'warn' : 'bad';
  return <div className="flex items-center gap-3 border-b border-border/70 py-3.5 last:border-0"><div className={`grid h-8 w-8 place-items-center rounded-lg ${tone === 'good' ? 'bg-[#dcefe8] text-[#287866]' : tone === 'warn' ? 'bg-[#f8ebc9] text-[#80601d]' : 'bg-[#f6ded9] text-[#9a3f35]'}`}><Signal size={15} /></div><div className="min-w-0 flex-1"><div className="truncate text-[12px] font-semibold">{integration.name}</div><div className="mt-0.5 font-mono-ui text-[10px] text-muted-foreground">{integration.latency} ms · sync {integration.lastSync}</div></div><StatusPill status={integration.status} tone={tone} /></div>;
}

function ActivityRow({ activity }: { activity: Activity }) {
  const icon = activity.tone === 'success' ? <Check size={13} /> : activity.tone === 'warning' ? <TriangleAlert size={13} /> : <Clock3 size={13} />;
  const color = activity.tone === 'success' ? 'bg-[#dcefe8] text-[#287866]' : activity.tone === 'warning' ? 'bg-[#f8ebc9] text-[#80601d]' : 'bg-[#dce7ef] text-[#376278]';
  return <div className="flex gap-3 border-b border-border/70 py-3.5 last:border-0"><div className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full ${color}`}>{icon}</div><div className="min-w-0 flex-1"><div className="text-[12px] font-semibold">{activity.title}</div><div className="mt-1 text-[11px] leading-5 text-muted-foreground">{activity.description}</div></div><div className="shrink-0 font-mono-ui text-[9px] text-muted-foreground">{activity.timestamp}</div></div>;
}

export default function OverviewPage() {
  const summaryQuery = useGetDashboardSummary();
  const healthQuery = useHealthCheck();
  const summary = summaryQuery.data;
  const healthy = healthQuery.data?.status === 'ok' || healthQuery.data?.status === 'healthy';
  return (
    <>
      <PageHeader eyebrow="cockpit operacional / 01" title="Bom dia, Marina." description="O pulso da sua operação Protheus, consolidado em um só lugar." action={<button data-testid="button-refresh-dashboard" onClick={() => { void summaryQuery.refetch(); void healthQuery.refetch(); }} className="inline-flex items-center gap-2 self-start rounded-md border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:border-primary/60 md:self-end"><RefreshCw size={14} className={summaryQuery.isFetching ? 'animate-spin' : ''} /> Atualizar leitura</button>} />
      {summaryQuery.isLoading ? <div className="card-surface overflow-hidden"><SkeletonRows count={4} cols={4} /></div> : summaryQuery.isError ? <ErrorState onRetry={() => void summaryQuery.refetch()} /> : summary && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Kpi label="Faturamento acumulado" value={brl.format(summary.totalRevenue)} delta={summary.revenueChange} detail="versus período anterior" accent="bg-primary" />
            <Kpi label="Pedidos processados" value={number.format(summary.orderCount)} detail="janela dos últimos 30 dias" accent="bg-[#3b9c8a]" />
            <Kpi label="Clientes sincronizados" value={number.format(summary.customerCount)} detail="cadastro mestre disponível" accent="bg-[#355873]" />
            <Kpi label="Taxa de sucesso" value={`${summary.successRate.toFixed(1).replace('.', ',')}%`} detail="das chamadas de integração" accent="bg-[#d09b2c]" />
          </div>
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,.75fr)]">
            <section className="card-surface fade-up-delay-1 p-5 md:p-6"><div className="flex items-start justify-between"><div><div className="font-mono-ui text-[10px] uppercase tracking-[.14em] text-muted-foreground">Tendência financeira</div><h2 className="mt-2 text-lg font-bold tracking-[-.03em]">Faturamento por competência</h2></div><div className="flex items-center gap-2 font-mono-ui text-[10px] text-muted-foreground"><span className="h-2 w-2 rounded-full bg-primary" /> receita <span className="ml-2 h-2 w-2 rounded-full bg-[#3b9c8a]" /> pedidos</div></div><RevenueChart points={summary.revenueSeries} /><div className="mt-3 grid grid-cols-3 gap-3 border-t border-border pt-4"><div><div className="font-mono-ui text-[9px] uppercase text-muted-foreground">média mensal</div><div className="mt-1 text-sm font-bold">{brl.format(summary.totalRevenue / Math.max(summary.revenueSeries.length, 1))}</div></div><div><div className="font-mono-ui text-[9px] uppercase text-muted-foreground">pico do período</div><div className="mt-1 text-sm font-bold">{brl.format(Math.max(...summary.revenueSeries.map((point) => point.revenue), 0))}</div></div><div><div className="font-mono-ui text-[9px] uppercase text-muted-foreground">itens no catálogo</div><div className="mt-1 text-sm font-bold">{number.format(summary.productCount)}</div></div></div></section>
            <section className="card-surface fade-up-delay-2 p-5 md:p-6"><div className="flex items-start justify-between"><div><div className="font-mono-ui text-[10px] uppercase tracking-[.14em] text-muted-foreground">Saúde da malha</div><h2 className="mt-2 text-lg font-bold tracking-[-.03em]">Integrações ativas</h2></div><div className="flex items-center gap-1.5 font-mono-ui text-[10px] text-[#287866]"><ShieldCheck size={13} /> {healthy ? 'monitorado' : 'verificando'}</div></div><div className="mt-4">{summary.integrations.map((integration) => <IntegrationRow key={integration.name} integration={integration} />)}</div><Link href="/routines" data-testid="link-view-routines" className="mt-4 flex items-center justify-between border-t border-border pt-4 text-[11px] font-semibold text-primary hover:text-primary/75">Abrir centro de rotinas <ExternalLink size={13} /></Link></section>
          </div>
          <section className="card-surface fade-up-delay-3 p-5 md:p-6"><div className="flex items-center justify-between"><div><div className="font-mono-ui text-[10px] uppercase tracking-[.14em] text-muted-foreground">Trilha de eventos</div><h2 className="mt-2 text-lg font-bold tracking-[-.03em]">Atividade recente</h2></div><span className="font-mono-ui text-[10px] text-muted-foreground">{summary.activities.length} eventos</span></div><div className="mt-3 grid gap-x-8 md:grid-cols-2">{summary.activities.map((activity) => <ActivityRow key={activity.id} activity={activity} />)}</div></section>
        </div>
      )}
    </>
  );
}
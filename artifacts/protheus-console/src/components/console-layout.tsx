import { Activity, Boxes, ChevronRight, CircleGauge, Database, FileCode2, LayoutDashboard, PackageSearch, ServerCog, TerminalSquare, UsersRound, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import type { ReactNode } from 'react';

const navItems = [
  { href: '/', label: 'Visão geral', icon: LayoutDashboard },
  { href: '/customers', label: 'Clientes', icon: UsersRound },
  { href: '/products', label: 'Produtos', icon: Boxes },
  { href: '/orders', label: 'Pedidos', icon: FileCode2 },
  { href: '/routines', label: 'Rotinas', icon: TerminalSquare },
  { href: '/stock', label: 'Estoque', icon: PackageSearch },
];

export function ConsoleLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return (
    <div className="min-h-[100dvh] bg-background text-foreground md:flex">
      <aside className="hidden w-[248px] shrink-0 flex-col bg-sidebar text-sidebar-foreground md:flex">
        <div className="flex h-[82px] items-center gap-3 border-b border-sidebar-border px-6">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
            <CircleGauge size={20} strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-[15px] font-bold tracking-[-0.03em]">ORBITA</div>
            <div className="font-mono-ui text-[9px] uppercase tracking-[.18em] text-sidebar-foreground/55">protheus ops</div>
          </div>
        </div>
        <div className="flex-1 px-3 py-6">
          <p className="mb-3 px-3 font-mono-ui text-[10px] uppercase tracking-[.17em] text-sidebar-foreground/45">Workspace</p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = item.href === '/' ? location === '/' : location.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-testid={`link-nav-${item.label.toLowerCase()}`}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium ${active ? 'bg-sidebar-accent text-sidebar-foreground' : 'text-sidebar-foreground/65 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground'}`}
                >
                  <Icon size={17} strokeWidth={active ? 2.3 : 1.8} />
                  <span>{item.label}</span>
                  {active && <ChevronRight size={14} className="ml-auto text-sidebar-primary" />}
                </Link>
              );
            })}
          </nav>
          <div className="mt-9 border-t border-sidebar-border pt-6">
            <p className="mb-3 px-3 font-mono-ui text-[10px] uppercase tracking-[.17em] text-sidebar-foreground/45">Sistema</p>
            <div className="mx-2 rounded-lg border border-sidebar-border bg-sidebar-accent/50 p-3">
              <div className="flex items-center gap-2 text-[11px] text-sidebar-foreground/75">
                <span className="pulse-dot h-2 w-2 rounded-full bg-[#56c8ad]" />
                API operacional
              </div>
              <div className="mt-2 flex items-center justify-between font-mono-ui text-[10px] text-sidebar-foreground/45">
                <span>latência</span><span>84 ms</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-[#d5e7dd] text-[11px] font-bold text-[#1f514c]">MO</div>
            <div className="min-w-0">
              <div className="truncate text-[12px] font-semibold">Marina Oliveira</div>
              <div className="truncate text-[10px] text-sidebar-foreground/45">Operações · BR</div>
            </div>
            <button className="ml-auto text-sidebar-foreground/45 hover:text-sidebar-foreground" data-testid="button-account-menu" aria-label="Abrir menu da conta"><ServerCog size={15} /></button>
          </div>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="flex h-[70px] items-center justify-between border-b border-border bg-background/90 px-5 backdrop-blur md:px-9">
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground md:hidden"><CircleGauge size={17} /></div>
            <div className="font-mono-ui text-[10px] uppercase tracking-[.16em] text-muted-foreground">Ambiente <span className="ml-1 text-foreground">produção</span></div>
            <span className="h-1 w-1 rounded-full bg-primary" />
            <div className="font-mono-ui text-[10px] text-muted-foreground">última leitura <span className="text-foreground">agora</span></div>
          </div>
          <div className="flex items-center gap-3">
            <button data-testid="button-command-search" className="hidden items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-[11px] text-muted-foreground hover:border-primary/60 sm:flex"><Database size={13} /> Buscar <kbd className="font-mono-ui text-[9px]">⌘ K</kbd></button>
            <button data-testid="button-notifications" className="relative rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Notificações"><Activity size={17} /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" /></button>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1440px] p-5 md:p-9">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div className="fade-up">
        <div className="mb-2 font-mono-ui text-[10px] font-medium uppercase tracking-[.18em] text-primary">{eyebrow}</div>
        <h1 className="text-[30px] font-bold leading-none tracking-[-0.045em] text-foreground md:text-[38px]">{title}</h1>
        <p className="mt-3 max-w-xl text-[13px] leading-6 text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function StatusPill({ status, tone = 'neutral' }: { status: string; tone?: 'good' | 'warn' | 'bad' | 'neutral' }) {
  const colors = {
    good: 'bg-[#dcefe8] text-[#226256]',
    warn: 'bg-[#f8ebc9] text-[#80601d]',
    bad: 'bg-[#f6ded9] text-[#9a3f35]',
    neutral: 'bg-muted text-muted-foreground',
  };
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono-ui text-[10px] font-medium ${colors[tone]}`}><span className={`h-1.5 w-1.5 rounded-full ${tone === 'good' ? 'bg-[#3c9e82]' : tone === 'warn' ? 'bg-[#ce9c2b]' : tone === 'bad' ? 'bg-[#c74c3f]' : 'bg-muted-foreground/60'}`} />{status}</span>;
}

export function EmptyState({ label, detail }: { label: string; detail: string }) {
  return <div className="flex min-h-[240px] flex-col items-center justify-center border border-dashed border-border bg-card/40 p-8 text-center"><div className="mb-3 grid h-10 w-10 place-items-center rounded-full bg-muted text-muted-foreground"><Database size={17} /></div><p className="text-sm font-semibold">{label}</p><p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">{detail}</p></div>;
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return <div className="flex min-h-[240px] flex-col items-center justify-center border border-dashed border-[#e6b8b1] bg-[#fff8f6] p-8 text-center"><p className="text-sm font-semibold text-[#8f3f36]">Não foi possível ler este recurso.</p><p className="mt-1 text-xs text-[#a2645b]">Verifique a conexão com o console e tente novamente.</p>{onRetry && <button onClick={onRetry} data-testid="button-retry" className="mt-4 rounded-md bg-[#8f3f36] px-3 py-2 text-xs font-semibold text-white hover:opacity-90">Tentar novamente</button>}</div>;
}

export function SkeletonRows({ count = 5, cols = 5 }: { count?: number; cols?: number }) {
  return <div className="divide-y divide-border">{Array.from({ length: count }).map((_, index) => <div key={index} className="grid gap-4 px-5 py-4" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>{Array.from({ length: cols }).map((__, cell) => <div key={cell} className="h-3 animate-pulse rounded bg-muted" />)}</div>)}</div>;
}
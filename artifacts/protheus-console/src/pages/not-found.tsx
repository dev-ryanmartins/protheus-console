import { ArrowLeft, CircleGauge } from 'lucide-react';
import { Link } from 'wouter';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="max-w-md text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground"><CircleGauge size={25} /></div>
        <div className="mt-7 font-mono-ui text-[10px] uppercase tracking-[.18em] text-primary">sinal não encontrado · 404</div>
        <h1 className="mt-3 text-3xl font-bold tracking-[-.05em]">Esta rota não está no mapa.</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">O endereço solicitado não corresponde a nenhum módulo do cockpit operacional.</p>
        <Link href="/" data-testid="link-return-overview" className="mx-auto mt-7 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:opacity-90"><ArrowLeft size={14} /> Voltar à visão geral</Link>
      </div>
    </div>
  );
}
import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { ConsoleLayout } from '@/components/console-layout';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import OverviewPage from '@/pages/overview';
import { CustomersPage, OrdersPage, ProductsPage } from '@/pages/data-pages';
import RoutinesPage from '@/pages/routines';
import StockPage from '@/pages/stock';

const queryClient = new QueryClient();

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Router() {
  return <RoutedErrorBoundary><ConsoleLayout><Switch><Route path="/" component={OverviewPage} /><Route path="/customers" component={CustomersPage} /><Route path="/products" component={ProductsPage} /><Route path="/orders" component={OrdersPage} /><Route path="/routines" component={RoutinesPage} /><Route path="/stock" component={StockPage} /><Route component={NotFound} /></Switch></ConsoleLayout></RoutedErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;
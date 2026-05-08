'use client';

import { useUIStore } from '@/stores/ui-store';
import { cn } from '@/lib/utils';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { MobileNav } from './mobile-nav';
import { ErrorBoundary } from '@/components/error-boundary';
import { type ReactNode } from 'react';

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      <MobileNav />
      <main
        className={cn(
          'min-h-screen transition-all duration-200 ease-out',
          'pt-14 max-md:pt-0',
          sidebarCollapsed ? 'md:pl-[72px]' : 'md:pl-60'
        )}
      >
        <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
          <ErrorBoundary>{children}</ErrorBoundary>
        </div>
      </main>
    </div>
  );
}

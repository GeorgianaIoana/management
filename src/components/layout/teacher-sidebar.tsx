'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/ui-store';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  LayoutDashboard,
  Calendar,
  ClipboardCheck,
  User,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const navigationItems = [
  { name: 'Acasă', href: '/teacher', icon: LayoutDashboard },
  { name: 'Clasele Mele', href: '/teacher/clase', icon: Calendar },
  { name: 'Prezențe', href: '/teacher/prezente', icon: ClipboardCheck },
  { name: 'Profil', href: '/teacher/profil', icon: User },
];

export function TeacherSidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mounting state for hydration
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border/60 bg-sidebar transition-all duration-200 ease-out max-md:hidden',
        sidebarCollapsed ? 'w-[72px]' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className="flex h-12 items-center justify-between border-b border-border/50 px-3">
        <Link href="/teacher" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground logo-3d">
            <span className="text-xs font-bold">S</span>
          </div>
          {!sidebarCollapsed && (
            <span className="text-[14px] font-semibold tracking-tight text-foreground">
              The Square
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2 py-3">
        <nav className="flex flex-col gap-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/teacher' && pathname.startsWith(item.href));

            const linkContent = (
              <Link
                href={item.href}
                className={cn(
                  'group flex items-center gap-2.5 rounded-md border px-2.5 py-1.5 text-[12px] font-medium transition-all duration-150',
                  isActive
                    ? 'border-primary/30 bg-primary/10 text-primary shadow-sm'
                    : 'border-transparent hover:border-border hover:bg-accent hover:text-foreground text-muted-foreground'
                )}
              >
                <item.icon className={cn(
                  'h-4 w-4 shrink-0 transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                )} />
                {!sidebarCollapsed && <span>{item.name}</span>}
              </Link>
            );

            if (sidebarCollapsed) {
              return (
                <Tooltip key={item.name} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <div>{linkContent}</div>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.name}</TooltipContent>
                </Tooltip>
              );
            }

            return <div key={item.name}>{linkContent}</div>;
          })}
        </nav>
      </ScrollArea>

      {/* Bottom - Collapse Button */}
      <div className="border-t border-border/50 px-2 py-2">
        <button
          onClick={toggleSidebar}
          className="flex w-full items-center justify-center gap-2 rounded-md px-2.5 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

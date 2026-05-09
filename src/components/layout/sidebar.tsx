'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUIStore, useNotificationStore } from '@/stores/ui-store';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  LayoutDashboard,
  Users,
  UserX,
  GraduationCap,
  Calendar,
  ClipboardCheck,
  CreditCard,
  Calculator,
  FileText,
  FolderKanban,
  BookOpen,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Target,
  Compass,
  MapPin,
  Handshake,
  FlaskConical,
  Shield,
} from 'lucide-react';

const SIDEBAR_EXPANDED_GROUPS_KEY = 'sidebar-expanded-groups';

const navigationGroups = [
  {
    id: 'principal',
    label: 'Principal',
    defaultExpanded: true,
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    id: 'club',
    label: 'Club',
    defaultExpanded: true,
    items: [
      { name: 'Members', href: '/members', icon: Users },
      { name: 'Inactive Members', href: '/inactive-members', icon: UserX },
      { name: 'Teachers', href: '/teachers', icon: GraduationCap },
      { name: 'Classes', href: '/classes', icon: Calendar },
      { name: 'Prezențe', href: '/appointments', icon: ClipboardCheck },
      { name: 'Lessons', href: '/lessons', icon: BookOpen },
    ],
  },
  {
    id: 'finante',
    label: 'Finanțe',
    defaultExpanded: true,
    items: [
      { name: 'Payments', href: '/payments', icon: CreditCard, hasBadge: true },
      { name: 'Contabilitate Asociație', href: '/contabilitate', icon: Calculator },
      { name: 'Contabilitate Bloomsoft', href: '/contabilitate-bloomsoft', icon: Calculator },
      { name: 'Documente Asociație', href: '/documente-asociatie', icon: FileText },
      { name: 'Sponsorizări', href: '/sponsorships', icon: Handshake },
    ],
  },
  {
    id: 'management',
    label: 'Management',
    defaultExpanded: false,
    items: [
      { name: 'Projects', href: '/projects', icon: FolderKanban },
      { name: 'Strategy', href: '/strategy', icon: Compass },
      { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    ],
  },
  {
    id: 'altele',
    label: 'Altele',
    defaultExpanded: false,
    items: [
      { name: 'Dragașani', href: '/dragasani', icon: MapPin },
      { name: 'Research', href: '/research', icon: FlaskConical },
    ],
  },
];

const bottomNavigation = [
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Admin', href: '/admin', icon: Shield },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const { pendingPaymentsCount, overduePaymentsCount } = useNotificationStore();

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    const defaults: Record<string, boolean> = {};
    navigationGroups.forEach(g => { defaults[g.id] = g.defaultExpanded; });
    return defaults;
  });

  useEffect(() => {
    const saved = localStorage.getItem(SIDEBAR_EXPANDED_GROUPS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // eslint-disable-next-line react-hooks/set-state-in-effect -- restore state from localStorage
        setExpandedGroups(parsed);
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const newState = { ...prev, [groupId]: !prev[groupId] };
      localStorage.setItem(SIDEBAR_EXPANDED_GROUPS_KEY, JSON.stringify(newState));
      return newState;
    });
  };

  const totalPaymentAlerts = pendingPaymentsCount + overduePaymentsCount;

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border/60 bg-sidebar transition-all duration-200 ease-out max-md:hidden',
        sidebarCollapsed ? 'w-[72px]' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className="flex h-12 items-center justify-between border-b border-border/50 px-3">
        <Link href="/dashboard" className="flex items-center gap-2">
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
      <ScrollArea className="flex-1 px-2 py-1">
        <nav className="flex flex-col gap-1">
          {navigationGroups.map((group) => {
            const isExpanded = expandedGroups[group.id];
            const hasActiveItem = group.items.some(item => pathname.startsWith(item.href));

            return (
              <div key={group.id}>
                {/* Group Header - Clickable */}
                {!sidebarCollapsed ? (
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className={cn(
                      'flex w-full items-center justify-between px-2 py-1 text-[10px] font-semibold uppercase tracking-wider transition-colors',
                      hasActiveItem && !isExpanded
                        ? 'text-primary'
                        : 'text-muted-foreground/60 hover:text-muted-foreground'
                    )}
                  >
                    <span>{group.label}</span>
                    {isExpanded ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )}
                  </button>
                ) : (
                  <div className="my-1 mx-2 border-t border-border/30" />
                )}

                {/* Group Items - Collapsible */}
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-200 ease-out',
                    sidebarCollapsed
                      ? 'max-h-[500px] opacity-100'
                      : isExpanded
                        ? 'max-h-[500px] opacity-100'
                        : 'max-h-0 opacity-0'
                  )}
                >
                  <div className="flex flex-col gap-0.5">
                    {group.items.map((item) => {
                      const isActive = pathname.startsWith(item.href);
                      const showBadge = item.hasBadge && totalPaymentAlerts > 0;

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
                          {!sidebarCollapsed && (
                            <>
                              <span className="flex-1">{item.name}</span>
                              {showBadge && (
                                <span className={cn(
                                  'flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold',
                                  overduePaymentsCount > 0
                                    ? 'bg-destructive text-white'
                                    : 'bg-primary/15 text-primary'
                                )}>
                                  {totalPaymentAlerts}
                                </span>
                              )}
                            </>
                          )}
                          {sidebarCollapsed && showBadge && (
                            <span className="absolute right-2 top-1.5 h-2 w-2 rounded-full bg-destructive" />
                          )}
                        </Link>
                      );

                      if (sidebarCollapsed) {
                        return (
                          <Tooltip key={item.name} delayDuration={0}>
                            <TooltipTrigger asChild>
                              <div className="relative">{linkContent}</div>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="flex items-center gap-2">
                              {item.name}
                              {showBadge && (
                                <span className={cn(
                                  'flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold',
                                  overduePaymentsCount > 0
                                    ? 'bg-destructive text-white'
                                    : 'bg-primary/15 text-primary'
                                )}>
                                  {totalPaymentAlerts}
                                </span>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        );
                      }

                      return <div key={item.name}>{linkContent}</div>;
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Bottom Navigation */}
      <div className="border-t border-border/50 px-2 py-2">
        <nav className="flex flex-col gap-0.5">
          {bottomNavigation.map((item) => {
            const isActive = pathname.startsWith(item.href);

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
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right">{item.name}</TooltipContent>
                </Tooltip>
              );
            }

            return <div key={item.name}>{linkContent}</div>;
          })}
        </nav>

        {/* Collapse Button */}
        <button
          onClick={toggleSidebar}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-md px-2.5 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
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

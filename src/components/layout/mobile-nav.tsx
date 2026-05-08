'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useNotificationStore } from '@/stores/ui-store';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Calendar,
  CreditCard,
  Calculator,
  FileText,
  FolderKanban,
  BookOpen,
  BarChart3,
  Settings,
  Menu,
  Target,
  MapPin,
  Handshake,
  FlaskConical,
  Trophy,
} from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Members', href: '/members', icon: Users },
  { name: 'Teachers', href: '/teachers', icon: GraduationCap },
  { name: 'Classes', href: '/classes', icon: Calendar },
  { name: 'Payments', href: '/payments', icon: CreditCard, hasBadge: true },
  { name: 'Contabilitate Asociație', href: '/contabilitate', icon: Calculator },
  { name: 'Contabilitate Bloomsoft', href: '/contabilitate-bloomsoft', icon: Calculator },
  { name: 'Documente Asociație', href: '/documente-asociatie', icon: FileText },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Lessons', href: '/lessons', icon: BookOpen },
  { name: 'Competiții', href: '/competitions', icon: Trophy },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Productivity', href: '/productivity', icon: Target },
  { name: 'Dragașani', href: '/dragasani', icon: MapPin },
  { name: 'Sponsorizări', href: '/sponsorships', icon: Handshake },
  { name: 'Research', href: '/research', icon: FlaskConical },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { pendingPaymentsCount, overduePaymentsCount } = useNotificationStore();

  const totalPaymentAlerts = pendingPaymentsCount + overduePaymentsCount;

  return (
    <div className="fixed left-4 top-3 z-50 md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon-sm" className="bg-background/80 backdrop-blur-sm shadow-sm border border-border/50">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <div className="flex h-14 items-center border-b border-border/50 px-5">
            <Link
              href="/dashboard"
              className="flex items-center gap-3"
              onClick={() => setOpen(false)}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-sm">
                <span className="text-sm font-bold">S</span>
              </div>
              <span className="text-[15px] font-semibold tracking-tight">The Square</span>
            </Link>
          </div>
          <ScrollArea className="h-[calc(100vh-3.5rem)]">
            <nav className="flex flex-col gap-0.5 p-3">
              {navigation.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const showBadge = item.hasBadge && totalPaymentAlerts > 0;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-150',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    )}
                  >
                    <item.icon className={cn(
                      'h-[18px] w-[18px] shrink-0',
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    )} />
                    <span className="flex-1">{item.name}</span>
                    {showBadge && (
                      <span className={cn(
                        'flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold',
                        overduePaymentsCount > 0
                          ? 'bg-destructive text-white'
                          : 'bg-primary/15 text-primary'
                      )}>
                        {totalPaymentAlerts}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}

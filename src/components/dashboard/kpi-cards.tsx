'use client';

import { useDashboardStats } from '@/hooks/use-dashboard';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Icon3D } from '@/components/ui/icon-3d';
import { Users, Calendar, Clock, TrendingUp } from 'lucide-react';

export function KPICards() {
  const { data, isLoading } = useDashboardStats();

  const cards = [
    {
      title: 'Total Members',
      value: data?.totalMembers ?? 0,
      icon: Users,
      description: 'Active club members',
      color: 'from-blue-500/10 to-blue-600/5',
      iconColor: 'blue' as const,
    },
    {
      title: 'Active Classes',
      value: data?.activeClasses ?? 0,
      icon: Calendar,
      description: 'Running this week',
      color: 'from-green-500/10 to-green-600/5',
      iconColor: 'green' as const,
    },
    {
      title: 'Monthly Revenue',
      value: `${(data?.monthlyRevenue ?? 0).toLocaleString()} RON`,
      icon: TrendingUp,
      description: 'Collected this month',
      color: 'from-primary/10 to-primary/5',
      iconColor: 'primary' as const,
    },
    {
      title: 'Pending Payments',
      value: `${(data?.pendingPayments ?? 0).toLocaleString()} RON`,
      icon: Clock,
      description: 'Awaiting collection',
      color: 'from-orange-500/10 to-orange-600/5',
      iconColor: 'orange' as const,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="group relative overflow-hidden rounded-2xl bg-card p-5 shadow-sm border border-border/50 transition-all duration-200 hover:shadow-md"
        >
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-200 group-hover:opacity-100",
            card.color
          )} />

          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-medium text-muted-foreground">
                {card.title}
              </span>
              <Icon3D color={card.iconColor} size="md">
                <card.icon className="h-4 w-4" />
              </Icon3D>
            </div>

            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-semibold tracking-tight">{card.value}</div>
                <p className="mt-1 text-[12px] text-muted-foreground">{card.description}</p>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

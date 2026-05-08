'use client';

import { useProductivityStats } from '@/hooks/use-productivity';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Flame, CheckCircle2, TrendingUp, Sparkles, Target } from 'lucide-react';

function getStreakMessage(streak: number): string {
  if (streak === 0) return 'Începe azi!';
  if (streak === 1) return 'Bun început!';
  if (streak < 7) return 'Continuă așa!';
  if (streak < 30) return 'Impresionant!';
  return 'Legendar!';
}

function getCompletionMessage(rate: number): string {
  if (rate === 0) return 'Hai să începem';
  if (rate < 50) return 'În progres';
  if (rate < 80) return 'Bine!';
  if (rate < 100) return 'Foarte bine!';
  return 'Perfect!';
}

export function StatsCards() {
  const { data, isLoading } = useProductivityStats();

  const todayProgress = data?.todayTotal && data.todayTotal > 0
    ? Math.round(((data.todayCompleted ?? 0) / data.todayTotal) * 100)
    : 0;
  const todayComplete = (data?.todayCompleted ?? 0) === (data?.todayTotal ?? 0) && (data?.todayTotal ?? 0) > 0;

  const cards = [
    {
      title: 'Streak',
      value: data?.streak ?? 0,
      suffix: 'zile',
      icon: data?.streak && data.streak >= 7 ? Sparkles : Flame,
      description: getStreakMessage(data?.streak ?? 0),
      color: 'from-orange-500/10 to-orange-600/5',
      iconColor: 'text-orange-500',
      highlight: data?.streak && data.streak >= 7,
    },
    {
      title: 'Azi',
      value: `${data?.todayCompleted ?? 0}/${data?.todayTotal ?? 0}`,
      suffix: 'tasks',
      icon: todayComplete ? Sparkles : CheckCircle2,
      description: todayComplete ? 'Totul gata!' : `${todayProgress}% completat`,
      color: 'from-green-500/10 to-green-600/5',
      iconColor: 'text-green-500',
      progress: todayProgress,
      highlight: todayComplete,
    },
    {
      title: 'Săptămâna',
      value: data?.weeklyCompletionRate ?? 0,
      suffix: '%',
      icon: data?.weeklyCompletionRate && data.weeklyCompletionRate >= 80 ? Target : TrendingUp,
      description: getCompletionMessage(data?.weeklyCompletionRate ?? 0),
      color: 'from-blue-500/10 to-blue-600/5',
      iconColor: 'text-blue-500',
      highlight: data?.weeklyCompletionRate && data.weeklyCompletionRate >= 80,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.title}
          className={cn(
            "group relative overflow-hidden rounded-2xl bg-card p-5 shadow-sm border transition-all duration-300 hover:shadow-md",
            card.highlight
              ? "border-primary/30 ring-2 ring-primary/10"
              : "border-border/50"
          )}
        >
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br transition-opacity duration-200",
            card.highlight ? "opacity-100" : "opacity-0 group-hover:opacity-100",
            card.color
          )} />

          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-medium text-muted-foreground">
                {card.title}
              </span>
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-300",
                card.highlight ? "bg-primary/20 scale-110" : "bg-muted/50",
                card.iconColor
              )}>
                <card.icon className={cn("h-4 w-4", card.highlight && "animate-pulse")} />
              </div>
            </div>

            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-semibold tracking-tight">
                  {card.value}
                  <span className="ml-1 text-sm font-normal text-muted-foreground">
                    {card.suffix}
                  </span>
                </div>
                <p className={cn(
                  "mt-1 text-[12px]",
                  card.highlight ? "text-primary font-medium" : "text-muted-foreground"
                )}>
                  {card.description}
                </p>

                {/* Progress bar for "Azi" card */}
                {'progress' in card && typeof card.progress === 'number' && (
                  <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full transition-all duration-500",
                        card.highlight ? "bg-green-500" : "bg-primary"
                      )}
                      style={{ width: `${card.progress}%` }}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

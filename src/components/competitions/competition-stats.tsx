'use client';

import { useCompetitionStats } from '@/hooks/use-competitions';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Calendar, CheckCircle, Users } from 'lucide-react';

export function CompetitionStats() {
  const { data: stats, isLoading } = useCompetitionStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const kpis = [
    {
      title: 'Total competiții',
      value: stats?.total ?? 0,
      icon: Trophy,
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
    },
    {
      title: 'Viitoare',
      value: stats?.planned ?? 0,
      icon: Calendar,
      color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30',
    },
    {
      title: 'Finalizate',
      value: stats?.completed ?? 0,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-100 dark:bg-green-900/30',
    },
    {
      title: 'Total participanți',
      value: stats?.totalParticipants ?? 0,
      icon: Users,
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <Card key={kpi.title}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-2 ${kpi.color}`}>
                <kpi.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{kpi.title}</p>
                <p className="text-2xl font-bold">{kpi.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

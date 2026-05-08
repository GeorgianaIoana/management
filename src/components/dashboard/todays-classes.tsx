'use client';

import Link from 'next/link';
import { useTodaysClasses } from '@/hooks/use-classes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, getClassName } from '@/lib/utils';
import { ageGroupLabels } from '@/lib/validations/class';
import { Clock, Users } from 'lucide-react';

export function TodaysClasses() {
  const { data: classes, isLoading } = useTodaysClasses();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Classes</CardTitle>
          <CardDescription>Classes scheduled for today</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today&apos;s Classes</CardTitle>
        <CardDescription>Classes scheduled for today</CardDescription>
      </CardHeader>
      <CardContent>
        {classes && classes.length > 0 ? (
          <div className="space-y-2">
            {classes.map((cls) => (
              <Link
                key={cls.id}
                href={`/classes/${cls.id}`}
                className="group flex items-center justify-between rounded-xl bg-muted/30 px-4 py-3 transition-all duration-150 hover:bg-muted/50"
              >
                <div className="space-y-1">
                  <p className="text-[14px] font-medium group-hover:text-primary transition-colors">
                    {getClassName(cls.day_of_week, cls.target_age_group)}
                  </p>
                  <div className="flex items-center gap-3 text-[12px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {cls.start_time.slice(0, 5)} - {cls.end_time.slice(0, 5)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {cls.max_students} max
                    </span>
                  </div>
                </div>
                <span
                  className={cn(
                    'rounded-full px-2.5 py-1 text-[11px] font-medium',
                    cls.target_age_group === 'kids'
                      ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      : cls.target_age_group === 'adults'
                        ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                        : 'bg-green-500/10 text-green-600 dark:text-green-400'
                  )}
                >
                  {ageGroupLabels[cls.target_age_group] || cls.target_age_group}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted/50 p-3 mb-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-[13px] text-muted-foreground">
              No classes scheduled for today
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

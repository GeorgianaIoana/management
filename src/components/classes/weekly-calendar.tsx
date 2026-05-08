'use client';

import { useWeeklySchedule } from '@/hooks/use-classes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import type { Class } from '@/types';
import { ageGroupLabels } from '@/lib/validations/class';

const dayNames = ['Duminica', 'Luni', 'Marti', 'Miercuri', 'Joi', 'Vineri', 'Sambata'];
const shortDayNames = ['Dum', 'Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sam'];

export function WeeklyCalendar() {
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());

  const { data: classes, isLoading } = useWeeklySchedule(weekStart.toISOString().split('T')[0]);

  const classesByDay: Record<number, Class[]> = {};
  for (let i = 0; i < 7; i++) {
    classesByDay[i] = [];
  }

  classes?.forEach((cls) => {
    classesByDay[cls.day_of_week].push(cls);
  });

  // Sort classes by start time within each day
  Object.keys(classesByDay).forEach((day) => {
    classesByDay[parseInt(day)].sort((a, b) =>
      a.start_time.localeCompare(b.start_time)
    );
  });

  const getAgeGroupColor = (group: string) => {
    const colors: Record<string, string> = {
      kids: 'bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700',
      adults: 'bg-purple-100 border-purple-300 dark:bg-purple-900/30 dark:border-purple-700',
      all: 'bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-700',
    };
    return colors[group] ?? 'bg-gray-100 border-gray-300';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {dayNames.map((day, index) => {
            const isToday = today.getDay() === index;
            const dayClasses = classesByDay[index];

            return (
              <div key={day} className="min-h-32">
                <div
                  className={cn(
                    'mb-2 rounded-lg p-2 text-center text-sm font-medium',
                    isToday
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  <span className="hidden sm:inline">{day}</span>
                  <span className="sm:hidden">{shortDayNames[index]}</span>
                </div>
                <div className="space-y-1">
                  {dayClasses.length === 0 ? (
                    <p className="text-center text-xs text-muted-foreground py-2">
                      No classes
                    </p>
                  ) : (
                    dayClasses.map((cls) => (
                      <Link
                        key={cls.id}
                        href={`/classes/${cls.id}`}
                        className={cn(
                          'block rounded-md border p-2 text-xs transition-colors hover:opacity-80',
                          getAgeGroupColor(cls.target_age_group)
                        )}
                      >
                        <p className="font-medium truncate">{ageGroupLabels[cls.target_age_group] || cls.target_age_group}</p>
                        <p className="text-muted-foreground">
                          {cls.start_time.slice(0, 5)} - {cls.end_time.slice(0, 5)}
                        </p>
                        {cls.teacher && (
                          <p className="text-muted-foreground truncate">
                            {cls.teacher.first_name} {cls.teacher.last_name[0]}.
                          </p>
                        )}
                      </Link>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs">
            <div className="h-3 w-3 rounded bg-blue-100 border border-blue-300" />
            <span>Copii</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="h-3 w-3 rounded bg-purple-100 border border-purple-300" />
            <span>Adulti</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="h-3 w-3 rounded bg-green-100 border border-green-300" />
            <span>Toti</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

import { useRecentActivity } from '@/hooks/use-dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  UserPlus,
  UserMinus,
  CreditCard,
  BookOpen,
  GraduationCap,
  Calendar,
  Pencil,
  Trash2,
  Activity,
} from 'lucide-react';

const activityConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  'member:created': { icon: <UserPlus className="h-3.5 w-3.5" />, color: 'bg-green-500/10 text-green-600' },
  'member:updated': { icon: <Pencil className="h-3.5 w-3.5" />, color: 'bg-blue-500/10 text-blue-600' },
  'member:deleted': { icon: <UserMinus className="h-3.5 w-3.5" />, color: 'bg-red-500/10 text-red-600' },
  'teacher:created': { icon: <GraduationCap className="h-3.5 w-3.5" />, color: 'bg-green-500/10 text-green-600' },
  'teacher:updated': { icon: <Pencil className="h-3.5 w-3.5" />, color: 'bg-blue-500/10 text-blue-600' },
  'teacher:deleted': { icon: <Trash2 className="h-3.5 w-3.5" />, color: 'bg-red-500/10 text-red-600' },
  'class:created': { icon: <Calendar className="h-3.5 w-3.5" />, color: 'bg-green-500/10 text-green-600' },
  'class:updated': { icon: <Pencil className="h-3.5 w-3.5" />, color: 'bg-blue-500/10 text-blue-600' },
  'class:deleted': { icon: <Trash2 className="h-3.5 w-3.5" />, color: 'bg-red-500/10 text-red-600' },
  'payment:created': { icon: <CreditCard className="h-3.5 w-3.5" />, color: 'bg-green-500/10 text-green-600' },
  'payment:paid': { icon: <CreditCard className="h-3.5 w-3.5" />, color: 'bg-green-500/10 text-green-600' },
  'payment:updated': { icon: <Pencil className="h-3.5 w-3.5" />, color: 'bg-blue-500/10 text-blue-600' },
  'lesson:created': { icon: <BookOpen className="h-3.5 w-3.5" />, color: 'bg-green-500/10 text-green-600' },
  'lesson:updated': { icon: <Pencil className="h-3.5 w-3.5" />, color: 'bg-blue-500/10 text-blue-600' },
  'lesson:deleted': { icon: <Trash2 className="h-3.5 w-3.5" />, color: 'bg-red-500/10 text-red-600' },
};

const defaultConfig = { icon: <Activity className="h-3.5 w-3.5" />, color: 'bg-muted text-muted-foreground' };

export function RecentActivity() {
  const { data: activities, isLoading } = useRecentActivity(10);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions in your club</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-2.5 w-1/3" />
                </div>
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
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions in your club</CardDescription>
      </CardHeader>
      <CardContent>
        {activities && activities.length > 0 ? (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-3">
              {activities.map((activity) => {
                const key = `${activity.entity_type}:${activity.action}`;
                const config = activityConfig[key] ?? defaultConfig;

                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 py-1"
                  >
                    <div className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                      config.color
                    )}>
                      {config.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] leading-snug line-clamp-2">
                        {activity.description}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.created_at), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted/50 p-3 mb-3">
              <Activity className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-[13px] text-muted-foreground">
              No recent activity
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

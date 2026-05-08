'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Users, ClipboardCheck, Clock } from 'lucide-react';
import { cn, getClassName, getDayName, formatTime } from '@/lib/utils';
import Link from 'next/link';
import type { Class, ClassSession } from '@/types';

interface SessionWithClass extends ClassSession {
  class: Class;
  attendance_count?: number;
}

export default function TeacherDashboardPage() {
  const { teacherId } = useAuthStore();
  const [teacher, setTeacher] = useState<{ first_name: string; last_name: string } | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [recentSessions, setRecentSessions] = useState<SessionWithClass[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      if (!teacherId) return;

      setLoading(true);

      // Fetch teacher info
      const { data: teacherData } = await supabase
        .from('teachers')
        .select('first_name, last_name')
        .eq('id', teacherId)
        .single();

      if (teacherData) {
        setTeacher(teacherData);
      }

      // Fetch teacher's classes
      const { data: classesData } = await supabase
        .from('classes')
        .select('*')
        .eq('teacher_id', teacherId)
        .eq('is_active', true)
        .order('day_of_week');

      if (classesData) {
        setClasses(classesData);
      }

      // Fetch recent sessions (last 10)
      const { data: sessionsData } = await supabase
        .from('class_sessions')
        .select('*, class:classes(*)')
        .eq('class.teacher_id', teacherId)
        .order('session_date', { ascending: false })
        .limit(10);

      if (sessionsData) {
        // Fetch attendance counts for each session
        const sessionsWithCounts = await Promise.all(
          sessionsData.map(async (session) => {
            const { count } = await supabase
              .from('attendance')
              .select('*', { count: 'exact', head: true })
              .eq('session_id', session.id)
              .eq('attended', true);

            return {
              ...session,
              attendance_count: count ?? 0,
            };
          })
        );

        setRecentSessions(sessionsWithCounts as SessionWithClass[]);
      }

      setLoading(false);
    }

    fetchData();
  }, [teacherId, supabase]);

  const today = new Date().getDay();
  const todaysClasses = classes.filter((c) => c.day_of_week === today);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Bună, {teacher?.first_name}!
        </h1>
        <p className="text-muted-foreground">
          Bine ai venit în portalul profesorilor The Square
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clasele Tale</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.length}</div>
            <p className="text-xs text-muted-foreground">
              clase active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clase Azi</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaysClasses.length}</div>
            <p className="text-xs text-muted-foreground">
              {todaysClasses.length === 1 ? 'clasă programată' : 'clase programate'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sesiuni Recente</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentSessions.length}</div>
            <p className="text-xs text-muted-foreground">
              în ultimele zile
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Classes */}
      {todaysClasses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Clasele de Azi</CardTitle>
            <CardDescription>
              {getDayName(today)}, {new Date().toLocaleDateString('ro-RO')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaysClasses.map((cls) => (
                <Link
                  key={cls.id}
                  href={`/teacher/clase`}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-lg',
                      cls.target_age_group === 'kids' ? 'bg-blue-100 text-blue-600' :
                      cls.target_age_group === 'adults' ? 'bg-purple-100 text-purple-600' :
                      'bg-green-100 text-green-600'
                    )}>
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {getClassName(cls.day_of_week, cls.target_age_group)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatTime(cls.start_time)} - {formatTime(cls.end_time)}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {cls.location || 'The Square'}
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Classes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Toate Clasele Tale</CardTitle>
          <CardDescription>
            Programul săptămânal
          </CardDescription>
        </CardHeader>
        <CardContent>
          {classes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nu ai clase asignate momentan.
            </p>
          ) : (
            <div className="space-y-3">
              {classes.map((cls) => (
                <Link
                  key={cls.id}
                  href={`/teacher/clase`}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-lg',
                      cls.target_age_group === 'kids' ? 'bg-blue-100 text-blue-600' :
                      cls.target_age_group === 'adults' ? 'bg-purple-100 text-purple-600' :
                      'bg-green-100 text-green-600'
                    )}>
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {getClassName(cls.day_of_week, cls.target_age_group)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {getDayName(cls.day_of_week)}, {formatTime(cls.start_time)} - {formatTime(cls.end_time)}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Max {cls.max_students} elevi
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Sessions */}
      {recentSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sesiuni Recente</CardTitle>
            <CardDescription>
              Ultimele sesiuni cu prezențe înregistrate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSessions.slice(0, 5).map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">
                      {session.class ? getClassName(session.class.day_of_week, session.class.target_age_group) : 'Clasă'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(session.session_date).toLocaleDateString('ro-RO')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                      session.status === 'completed' ? 'bg-green-100 text-green-700' :
                      session.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    )}>
                      {session.status === 'completed' ? 'Finalizată' :
                       session.status === 'cancelled' ? 'Anulată' : 'Programată'}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {session.attendance_count} prezenți
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/teacher/prezente"
              className="mt-4 inline-block text-sm text-primary hover:underline"
            >
              Vezi toate sesiunile →
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Calendar, Users, Clock, MapPin, User } from 'lucide-react';
import { cn, getClassName, formatTime } from '@/lib/utils';
import type { Class, Member, Enrollment } from '@/types';

interface ClassWithEnrollments extends Class {
  enrollments: Array<Enrollment & { member: Member }>;
}

export default function TeacherClassesPage() {
  const { teacherId } = useAuthStore();
  const [classes, setClasses] = useState<ClassWithEnrollments[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      if (!teacherId) return;

      setLoading(true);

      // Fetch teacher's classes with enrollments
      const { data: classesData } = await supabase
        .from('classes')
        .select('*')
        .eq('teacher_id', teacherId)
        .eq('is_active', true)
        .order('day_of_week');

      if (classesData) {
        // Fetch enrollments for each class
        const classesWithEnrollments = await Promise.all(
          classesData.map(async (cls) => {
            const { data: enrollments } = await supabase
              .from('enrollments')
              .select('*, member:members(*)')
              .eq('class_id', cls.id)
              .eq('is_active', true)
              .order('enrolled_date');

            return {
              ...cls,
              enrollments: enrollments || [],
            };
          })
        );

        setClasses(classesWithEnrollments as ClassWithEnrollments[]);
      }

      setLoading(false);
    }

    fetchData();
  }, [teacherId, supabase]);

  // Group classes by day
  const classesByDay = classes.reduce((acc, cls) => {
    const day = cls.day_of_week;
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(cls);
    return acc;
  }, {} as Record<number, ClassWithEnrollments[]>);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Clasele Mele</h1>
        <p className="text-muted-foreground">
          Vizualizează clasele și elevii înrolați
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clase</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Elevi</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {classes.reduce((sum, cls) => sum + cls.enrollments.length, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Zile Active</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(classesByDay).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Classes List */}
      {classes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nu ai clase asignate momentan.</p>
          </CardContent>
        </Card>
      ) : (
        <Accordion type="multiple" className="space-y-4">
          {classes.map((cls) => (
            <AccordionItem
              key={cls.id}
              value={cls.id}
              className="border rounded-lg px-4"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-4 text-left">
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-lg',
                      cls.target_age_group === 'kids'
                        ? 'bg-blue-100 text-blue-600'
                        : cls.target_age_group === 'adults'
                        ? 'bg-purple-100 text-purple-600'
                        : 'bg-green-100 text-green-600'
                    )}
                  >
                    <Users className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">
                      {getClassName(cls.day_of_week, cls.target_age_group)}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {formatTime(cls.start_time)} - {formatTime(cls.end_time)}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5" />
                        {cls.enrollments.length}/{cls.max_students} elevi
                      </span>
                      {cls.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {cls.location}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge
                    variant={
                      cls.enrollments.length >= cls.max_students
                        ? 'destructive'
                        : cls.enrollments.length >= cls.max_students * 0.8
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {cls.enrollments.length >= cls.max_students
                      ? 'Complet'
                      : `${cls.max_students - cls.enrollments.length} locuri libere`}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="pt-2">
                  {cls.description && (
                    <p className="text-sm text-muted-foreground mb-4">
                      {cls.description}
                    </p>
                  )}

                  <h4 className="font-medium mb-3">
                    Elevi Înrolați ({cls.enrollments.length})
                  </h4>

                  {cls.enrollments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Nu sunt elevi înrolați în această clasă.
                    </p>
                  ) : (
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {cls.enrollments.map((enrollment) => (
                        <div
                          key={enrollment.id}
                          className="flex items-center gap-3 rounded-lg border p-3"
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                            <User className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {enrollment.member.first_name} {enrollment.member.last_name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {enrollment.member.member_type === 'child'
                                ? 'Copil'
                                : 'Adult'}
                              {enrollment.member.skill_level && (
                                <> • {enrollment.member.skill_level}</>
                              )}
                            </p>
                          </div>
                          {enrollment.member.chess_rating && (
                            <Badge variant="secondary" className="text-xs">
                              {enrollment.member.chess_rating}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}

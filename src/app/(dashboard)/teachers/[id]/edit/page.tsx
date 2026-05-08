'use client';

import { useParams, useRouter } from 'next/navigation';
import { useTeacher, useUpdateTeacher } from '@/hooks/use-teachers';
import { TeacherForm } from '@/components/teachers';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { TeacherFormValues } from '@/lib/validations/teacher';

export default function EditTeacherPage() {
  const params = useParams();
  const router = useRouter();
  const teacherId = params.id as string;

  const { data: teacher, isLoading } = useTeacher(teacherId);
  const updateMutation = useUpdateTeacher();

  const handleSubmit = async (data: TeacherFormValues) => {
    const teacherData = {
      ...data,
      phone: data.phone || null,
      chess_title: data.chess_title ?? null,
      chess_rating: data.chess_rating ?? null,
      bio: data.bio ?? null,
      specializations: data.specializations ?? null,
      hourly_rate: data.hourly_rate ?? null,
      avatar_url: data.avatar_url ?? null,
    };

    await updateMutation.mutateAsync({ id: teacherId, data: teacherData });
    router.push(`/teachers/${teacherId}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32 mt-2" />
          </div>
        </div>
        <Card>
          <CardContent className="py-8">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/teachers">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Teacher Not Found</h1>
        </div>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            The teacher you are looking for does not exist.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/teachers/${teacherId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Teacher</h1>
          <p className="text-muted-foreground">
            {teacher.first_name} {teacher.last_name}
          </p>
        </div>
      </div>
      <TeacherForm
        teacher={teacher}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
      />
    </div>
  );
}

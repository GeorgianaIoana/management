'use client';

import { useParams, useRouter } from 'next/navigation';
import { useLesson, useUpdateLesson } from '@/hooks/use-lessons';
import { LessonForm } from '@/components/lessons';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { LessonFormValues } from '@/lib/validations/lesson';

export default function EditLessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.id as string;

  const { data: lesson, isLoading } = useLesson(lessonId);
  const updateMutation = useUpdateLesson();

  const handleSubmit = async (data: LessonFormValues) => {
    const lessonData = {
      ...data,
      description: data.description || null,
      category: data.category || null,
      tags: data.tags || null,
      skill_level: data.skill_level || null,
      target_age_group: data.target_age_group || null,
      file_url: data.file_url || null,
      file_name: data.file_name || null,
      file_type: data.file_type || null,
      file_size: data.file_size || null,
      class_id: data.class_id || null,
    };

    await updateMutation.mutateAsync({ id: lessonId, data: lessonData });
    router.push(`/lessons/${lessonId}`);
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

  if (!lesson) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/lessons">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Lesson Not Found</h1>
        </div>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            The lesson you are looking for does not exist.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/lessons/${lessonId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Lesson</h1>
          <p className="text-muted-foreground">{lesson.title}</p>
        </div>
      </div>
      <LessonForm
        lesson={lesson}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
      />
    </div>
  );
}

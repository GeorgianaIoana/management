'use client';

import { useRouter } from 'next/navigation';
import { useCreateLesson } from '@/hooks/use-lessons';
import { LessonForm } from '@/components/lessons';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { LessonFormValues } from '@/lib/validations/lesson';

export default function NewLessonPage() {
  const router = useRouter();
  const createMutation = useCreateLesson();

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
      uploaded_by: null,
    };

    await createMutation.mutateAsync(lessonData);
    router.push('/lessons');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/lessons">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">New Lesson</h1>
          <p className="text-muted-foreground">
            Add a new lesson to your library
          </p>
        </div>
      </div>
      <LessonForm
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
      />
    </div>
  );
}

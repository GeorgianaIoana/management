'use client';

import { useRouter } from 'next/navigation';
import { useCreateTeacher } from '@/hooks/use-teachers';
import { TeacherForm } from '@/components/teachers';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { TeacherFormValues } from '@/lib/validations/teacher';

export default function NewTeacherPage() {
  const router = useRouter();
  const createMutation = useCreateTeacher();

  const handleSubmit = async (data: TeacherFormValues) => {
    const teacherData = {
      ...data,
      phone: data.phone || null,
      chess_title: data.chess_title ?? null,
      chess_rating: data.chess_rating ?? null,
      bio: data.bio ?? null,
      specializations: data.specializations ?? null,
      teaching_levels: data.teaching_levels ?? null,
      hourly_rate: data.hourly_rate ?? null,
      avatar_url: data.avatar_url ?? null,
      auth_id: null,
    };

    await createMutation.mutateAsync(teacherData);
    router.push('/teachers');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/teachers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">New Teacher</h1>
          <p className="text-muted-foreground">
            Add a new instructor to your chess club
          </p>
        </div>
      </div>
      <TeacherForm
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
      />
    </div>
  );
}

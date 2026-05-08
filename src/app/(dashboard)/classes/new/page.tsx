'use client';

import { useRouter } from 'next/navigation';
import { useCreateClass } from '@/hooks/use-classes';
import { ClassForm } from '@/components/classes';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { ClassFormValues } from '@/lib/validations/class';

export default function NewClassPage() {
  const router = useRouter();
  const createMutation = useCreateClass();

  const handleSubmit = async (data: ClassFormValues) => {
    const classData = {
      ...data,
      name: data.name || null,
      description: data.description || null,
      price_per_session: data.price_per_session ?? null,
      price_per_month: data.price_per_month ?? null,
      teacher_id: data.teacher_id ?? null,
      location: data.location || null,
    };

    await createMutation.mutateAsync(classData);
    router.push('/classes');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/classes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">New Class</h1>
          <p className="text-muted-foreground">
            Create a new class for your chess club
          </p>
        </div>
      </div>
      <ClassForm
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
      />
    </div>
  );
}

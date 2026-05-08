'use client';

import { useParams, useRouter } from 'next/navigation';
import { useClass, useUpdateClass } from '@/hooks/use-classes';
import { ClassForm } from '@/components/classes';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { ClassFormValues } from '@/lib/validations/class';
import { getClassName } from '@/lib/utils';

export default function EditClassPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.id as string;

  const { data: classData, isLoading } = useClass(classId);
  const updateMutation = useUpdateClass();

  const handleSubmit = async (data: ClassFormValues) => {
    const updateData = {
      ...data,
      name: data.name || null,
      description: data.description || null,
      price_per_session: data.price_per_session ?? null,
      price_per_month: data.price_per_month ?? null,
      teacher_id: data.teacher_id ?? null,
      location: data.location || null,
    };

    await updateMutation.mutateAsync({ id: classId, data: updateData });
    router.push(`/classes/${classId}`);
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

  if (!classData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/classes">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Class Not Found</h1>
        </div>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            The class you are looking for does not exist.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/classes/${classId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Editeaza Clasa</h1>
          <p className="text-muted-foreground">{getClassName(classData.day_of_week, classData.target_age_group)}</p>
        </div>
      </div>
      <ClassForm
        classData={classData}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
      />
    </div>
  );
}

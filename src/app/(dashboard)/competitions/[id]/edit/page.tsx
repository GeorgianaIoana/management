'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCompetition, useUpdateCompetition } from '@/hooks/use-competitions';
import { CompetitionForm } from '@/components/competitions';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import type { CompetitionFormValues } from '@/lib/validations/competition';

interface EditCompetitionPageProps {
  params: Promise<{ id: string }>;
}

export default function EditCompetitionPage({
  params,
}: EditCompetitionPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data: competition, isLoading } = useCompetition(id);
  const updateMutation = useUpdateCompetition();

  const handleSubmit = async (data: CompetitionFormValues) => {
    await updateMutation.mutateAsync({
      id,
      data: {
        name: data.name,
        description: data.description || null,
        event_date: data.event_date,
        end_date: data.end_date || null,
        location: data.location || null,
        status: data.status,
        notes: data.notes || null,
      },
    });
    router.push(`/competitions/${id}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/competitions">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Competiție negăsită</h1>
            <p className="text-muted-foreground">
              Competiția nu există sau a fost ștearsă.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/competitions/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Editează competiția</h1>
          <p className="text-muted-foreground">{competition.name}</p>
        </div>
      </div>
      <CompetitionForm
        competition={competition}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
      />
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { useCreateCompetition } from '@/hooks/use-competitions';
import { CompetitionForm } from '@/components/competitions';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { CompetitionFormValues } from '@/lib/validations/competition';

export default function NewCompetitionPage() {
  const router = useRouter();
  const createMutation = useCreateCompetition();

  const handleSubmit = async (data: CompetitionFormValues) => {
    await createMutation.mutateAsync({
      name: data.name,
      description: data.description || null,
      event_date: data.event_date,
      end_date: data.end_date || null,
      location: data.location || null,
      status: data.status,
      notes: data.notes || null,
    });
    router.push('/competitions');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/competitions">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Competiție nouă</h1>
          <p className="text-muted-foreground">
            Creează o competiție nouă
          </p>
        </div>
      </div>
      <CompetitionForm
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
      />
    </div>
  );
}

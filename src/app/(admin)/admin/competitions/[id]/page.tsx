'use client';

import { use } from 'react';
import Link from 'next/link';
import { useCompetition } from '@/hooks/use-competitions';
import { ParticipantsList } from '@/components/competitions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Pencil, Calendar, MapPin, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';

const statusLabels: Record<string, string> = {
  planned: 'Planificat',
  ongoing: 'În desfășurare',
  completed: 'Finalizat',
  cancelled: 'Anulat',
};

const statusVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  planned: 'default',
  ongoing: 'secondary',
  completed: 'outline',
  cancelled: 'destructive',
};

interface CompetitionDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function CompetitionDetailPage({
  params,
}: CompetitionDetailPageProps) {
  const { id } = use(params);
  const { data: competition, isLoading } = useCompetition(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 bg-zinc-800" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64 bg-zinc-800" />
            <Skeleton className="h-4 w-48 bg-zinc-800" />
          </div>
        </div>
        <Skeleton className="h-48 w-full bg-zinc-800" />
        <Skeleton className="h-64 w-full bg-zinc-800" />
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="text-zinc-400 hover:text-white hover:bg-zinc-800">
            <Link href="/admin/competitions">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Competiție negăsită</h1>
            <p className="text-zinc-400">
              Competiția nu există sau a fost ștearsă.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="text-zinc-400 hover:text-white hover:bg-zinc-800">
            <Link href="/admin/competitions">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-white">{competition.name}</h1>
              <Badge variant={statusVariants[competition.status]}>
                {statusLabels[competition.status]}
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-1 text-zinc-400">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(new Date(competition.event_date), 'd MMMM yyyy', { locale: ro })}
                  {competition.end_date && competition.end_date !== competition.event_date && (
                    <> - {format(new Date(competition.end_date), 'd MMMM yyyy', { locale: ro })}</>
                  )}
                </span>
              </div>
              {competition.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  <span>{competition.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <Button asChild className="bg-amber-500 text-zinc-900 hover:bg-amber-400">
          <Link href={`/admin/competitions/${competition.id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Editează
          </Link>
        </Button>
      </div>

      {/* Details Card */}
      {(competition.description || competition.notes) && (
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <FileText className="h-5 w-5" />
              Detalii
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {competition.description && (
              <div>
                <p className="text-sm font-medium text-zinc-400 mb-1">
                  Descriere
                </p>
                <p className="whitespace-pre-wrap text-white">{competition.description}</p>
              </div>
            )}
            {competition.notes && (
              <div>
                <p className="text-sm font-medium text-zinc-400 mb-1">
                  Note
                </p>
                <p className="whitespace-pre-wrap text-zinc-400">
                  {competition.notes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Participants */}
      <ParticipantsList competitionId={competition.id} />
    </div>
  );
}

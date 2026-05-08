'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  competitionSchema,
  type CompetitionFormValues,
} from '@/lib/validations/competition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import type { Competition } from '@/types';

interface CompetitionFormProps {
  competition?: Competition | null;
  onSubmit: (data: CompetitionFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

export function CompetitionForm({
  competition,
  onSubmit,
  isSubmitting,
}: CompetitionFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CompetitionFormValues>({
    resolver: zodResolver(competitionSchema),
    defaultValues: {
      name: competition?.name ?? '',
      description: competition?.description ?? '',
      event_date: competition?.event_date ?? '',
      end_date: competition?.end_date ?? '',
      location: competition?.location ?? '',
      status: competition?.status ?? 'planned',
      notes: competition?.notes ?? '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Detalii competiție</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">Nume competiție *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Campionatul Dragașani 2026"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Descriere</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Detalii despre competiție..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event_date">Data evenimentului *</Label>
            <Input
              id="event_date"
              type="date"
              {...register('event_date')}
            />
            {errors.event_date && (
              <p className="text-sm text-destructive">
                {errors.event_date.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="end_date">Data de sfârșit</Label>
            <Input
              id="end_date"
              type="date"
              {...register('end_date')}
            />
            {errors.end_date && (
              <p className="text-sm text-destructive">
                {errors.end_date.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Locație</Label>
            <Input
              id="location"
              {...register('location')}
              placeholder="Dragașani"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={watch('status')}
              onValueChange={(value) =>
                setValue('status', value as CompetitionFormValues['status'])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planned">Planificat</SelectItem>
                <SelectItem value="ongoing">În desfășurare</SelectItem>
                <SelectItem value="completed">Finalizat</SelectItem>
                <SelectItem value="cancelled">Anulat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="notes">Note</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Note adiționale..."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {competition ? 'Actualizează competiția' : 'Creează competiția'}
        </Button>
      </div>
    </form>
  );
}

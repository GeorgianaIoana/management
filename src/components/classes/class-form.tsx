'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { classSchema, type ClassFormValues, dayOptions } from '@/lib/validations/class';
import { getClassName } from '@/lib/utils';
import { useAllTeachers } from '@/hooks/use-teachers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import type { Class } from '@/types';

interface ClassFormProps {
  classData?: Class;
  onSubmit: (data: ClassFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

export function ClassForm({ classData, onSubmit, isSubmitting }: ClassFormProps) {
  const { data: teachers } = useAllTeachers();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      name: classData?.name ?? null,
      description: classData?.description ?? '',
      target_age_group: classData?.target_age_group ?? 'all',
      day_of_week: classData?.day_of_week ?? 1,
      start_time: classData?.start_time ?? '10:00',
      end_time: classData?.end_time ?? '11:00',
      max_students: classData?.max_students ?? 10,
      price_per_session: classData?.price_per_session ?? null,
      price_per_month: classData?.price_per_month ?? null,
      teacher_id: classData?.teacher_id ?? null,
      is_active: classData?.is_active ?? true,
      location: classData?.location ?? '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informatii Clasa</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {/* Dynamic class name preview */}
          <div className="space-y-2 sm:col-span-2">
            <Label>Nume Clasa (generat automat)</Label>
            <div className="rounded-md border bg-muted/50 px-3 py-2 text-sm font-medium">
              {getClassName(watch('day_of_week'), watch('target_age_group'))}
            </div>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Descriere</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Descriere clasa..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target_age_group">Grupa de Varsta *</Label>
            <Select
              value={watch('target_age_group')}
              onValueChange={(value) => {
                if (value) setValue('target_age_group', value as 'kids' | 'adults' | 'all')
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kids">Copii</SelectItem>
                <SelectItem value="adults">Adulti</SelectItem>
                <SelectItem value="all">Toti</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="teacher_id">Instructor</Label>
            <Select
              value={watch('teacher_id') ?? ''}
              onValueChange={(value) => setValue('teacher_id', value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecteaza instructor" />
              </SelectTrigger>
              <SelectContent>
                {teachers?.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.first_name} {teacher.last_name}
                    {teacher.chess_title && ` (${teacher.chess_title})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Locatie</Label>
            <Input
              id="location"
              {...register('location')}
              placeholder="Sala 1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max_students">Nr. Max Elevi *</Label>
            <Input
              id="max_students"
              type="number"
              {...register('max_students', { valueAsNumber: true })}
              min={1}
            />
            {errors.max_students && (
              <p className="text-sm text-destructive">{errors.max_students.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2 sm:col-span-2">
            <Switch
              id="is_active"
              checked={watch('is_active')}
              onCheckedChange={(checked) => setValue('is_active', checked)}
            />
            <Label htmlFor="is_active">Activa</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Program</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="day_of_week">Zi *</Label>
            <Select
              value={watch('day_of_week').toString()}
              onValueChange={(value) => {
                if (value) setValue('day_of_week', parseInt(value))
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dayOptions.map((day) => (
                  <SelectItem key={day.value} value={day.value}>
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="start_time">Ora Start *</Label>
            <Input
              id="start_time"
              type="time"
              {...register('start_time')}
            />
            {errors.start_time && (
              <p className="text-sm text-destructive">{errors.start_time.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="end_time">Ora Final *</Label>
            <Input
              id="end_time"
              type="time"
              {...register('end_time')}
            />
            {errors.end_time && (
              <p className="text-sm text-destructive">{errors.end_time.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preturi (RON)</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="price_per_session">Pret pe Sedinta</Label>
            <Input
              id="price_per_session"
              type="number"
              {...register('price_per_session', { valueAsNumber: true })}
              placeholder="50"
              min={0}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price_per_month">Pret pe Luna</Label>
            <Input
              id="price_per_month"
              type="number"
              {...register('price_per_month', { valueAsNumber: true })}
              placeholder="200"
              min={0}
              step={1}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {classData ? 'Actualizeaza' : 'Creeaza Clasa'}
        </Button>
      </div>
    </form>
  );
}

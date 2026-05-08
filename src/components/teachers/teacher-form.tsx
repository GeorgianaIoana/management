'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { teacherSchema, type TeacherFormValues, chessTitles, defaultSpecializations } from '@/lib/validations/teacher';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, X } from 'lucide-react';
import type { Teacher } from '@/types';

interface TeacherFormProps {
  teacher?: Teacher;
  onSubmit: (data: TeacherFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

export function TeacherForm({ teacher, onSubmit, isSubmitting }: TeacherFormProps) {
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>(
    teacher?.specializations ?? []
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      first_name: teacher?.first_name ?? '',
      last_name: teacher?.last_name ?? '',
      email: teacher?.email ?? '',
      phone: teacher?.phone ?? '',
      chess_title: teacher?.chess_title ?? null,
      chess_rating: teacher?.chess_rating ?? null,
      bio: teacher?.bio ?? '',
      specializations: teacher?.specializations ?? [],
      hourly_rate: teacher?.hourly_rate ?? null,
      is_active: teacher?.is_active ?? true,
    },
  });

  const handleSpecializationToggle = (spec: string) => {
    const newSpecs = selectedSpecs.includes(spec)
      ? selectedSpecs.filter((s) => s !== spec)
      : [...selectedSpecs, spec];
    setSelectedSpecs(newSpecs);
    setValue('specializations', newSpecs);
  };

  const handleFormSubmit = (data: TeacherFormValues) => {
    onSubmit({ ...data, specializations: selectedSpecs });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name *</Label>
            <Input
              id="first_name"
              {...register('first_name')}
              placeholder="John"
            />
            {errors.first_name && (
              <p className="text-sm text-destructive">{errors.first_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name *</Label>
            <Input
              id="last_name"
              {...register('last_name')}
              placeholder="Doe"
            />
            {errors.last_name && (
              <p className="text-sm text-destructive">{errors.last_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              {...register('phone')}
              placeholder="+40 123 456 789"
            />
          </div>

          <div className="flex items-center space-x-2 sm:col-span-2">
            <Switch
              id="is_active"
              checked={watch('is_active')}
              onCheckedChange={(checked) => setValue('is_active', checked)}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chess Credentials</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="chess_title">Chess Title</Label>
            <Select
              value={watch('chess_title') ?? ''}
              onValueChange={(value) =>
                setValue('chess_title', value as TeacherFormValues['chess_title'])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select title" />
              </SelectTrigger>
              <SelectContent>
                {chessTitles.map((title) => (
                  <SelectItem key={title.value} value={title.value}>
                    {title.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="chess_rating">Chess Rating (ELO)</Label>
            <Input
              id="chess_rating"
              type="number"
              {...register('chess_rating')}
              placeholder="2200"
              min={0}
              max={3000}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hourly_rate">Hourly Rate (RON)</Label>
            <Input
              id="hourly_rate"
              type="number"
              {...register('hourly_rate')}
              placeholder="150"
              min={0}
              step={1}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Specializations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {defaultSpecializations.map((spec) => (
              <Badge
                key={spec}
                variant={selectedSpecs.includes(spec) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => handleSpecializationToggle(spec)}
              >
                {spec}
                {selectedSpecs.includes(spec) && (
                  <X className="ml-1 h-3 w-3" />
                )}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Biography</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            id="bio"
            {...register('bio')}
            placeholder="Brief biography and teaching experience..."
            rows={4}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {teacher ? 'Update Teacher' : 'Create Teacher'}
        </Button>
      </div>
    </form>
  );
}

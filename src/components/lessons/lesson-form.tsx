'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { lessonSchema, type LessonFormValues, defaultCategories, skillLevels, ageGroups } from '@/lib/validations/lesson';
import { useAllClasses } from '@/hooks/use-classes';
import { useUploadLessonFile } from '@/hooks/use-lessons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Upload, X, FileText } from 'lucide-react';
import { getClassName } from '@/lib/utils';
import type { Lesson } from '@/types';

interface LessonFormProps {
  lesson?: Lesson;
  onSubmit: (data: LessonFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

export function LessonForm({ lesson, onSubmit, isSubmitting }: LessonFormProps) {
  const { data: classes } = useAllClasses();
  const uploadMutation = useUploadLessonFile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedTags, setSelectedTags] = useState<string[]>(lesson?.tags ?? []);
  const [newTag, setNewTag] = useState('');
  const [fileInfo, setFileInfo] = useState<{
    url: string;
    name: string;
    type: string;
    size: number;
  } | null>(
    lesson?.file_url
      ? {
          url: lesson.file_url,
          name: lesson.file_name ?? '',
          type: lesson.file_type ?? '',
          size: lesson.file_size ?? 0,
        }
      : null
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: lesson?.title ?? '',
      description: lesson?.description ?? '',
      category: lesson?.category ?? '',
      tags: lesson?.tags ?? [],
      skill_level: lesson?.skill_level ?? null,
      target_age_group: lesson?.target_age_group ?? null,
      file_url: lesson?.file_url ?? '',
      file_name: lesson?.file_name ?? '',
      file_type: lesson?.file_type ?? '',
      file_size: lesson?.file_size ?? null,
      class_id: lesson?.class_id ?? null,
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadMutation.mutateAsync(file);
      setFileInfo(result);
      setValue('file_url', result.url);
      setValue('file_name', result.name);
      setValue('file_type', result.type);
      setValue('file_size', result.size);
    } catch {
      // Error is handled by mutation
    }
  };

  const handleRemoveFile = () => {
    setFileInfo(null);
    setValue('file_url', null);
    setValue('file_name', null);
    setValue('file_type', null);
    setValue('file_size', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddTag = () => {
    if (newTag && !selectedTags.includes(newTag)) {
      const newTags = [...selectedTags, newTag];
      setSelectedTags(newTags);
      setValue('tags', newTags);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    const newTags = selectedTags.filter((t) => t !== tag);
    setSelectedTags(newTags);
    setValue('tags', newTags);
  };

  const handleFormSubmit = (data: LessonFormValues) => {
    onSubmit({ ...data, tags: selectedTags });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Lesson Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Sicilian Defense: Dragon Variation"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="A comprehensive guide to the Dragon Variation..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={watch('category') ?? ''}
              onValueChange={(value) => setValue('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {defaultCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="class_id">Associated Class</Label>
            <Select
              value={watch('class_id') ?? ''}
              onValueChange={(value) => setValue('class_id', value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select class (optional)" />
              </SelectTrigger>
              <SelectContent>
                {classes?.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {getClassName(cls.day_of_week, cls.target_age_group)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="skill_level">Skill Level</Label>
            <Select
              value={watch('skill_level') ?? ''}
              onValueChange={(value) =>
                setValue('skill_level', value as LessonFormValues['skill_level'])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                {skillLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target_age_group">Target Age Group</Label>
            <Select
              value={watch('target_age_group') ?? ''}
              onValueChange={(value) =>
                setValue('target_age_group', value as LessonFormValues['target_age_group'])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select age group" />
              </SelectTrigger>
              <SelectContent>
                {ageGroups.map((group) => (
                  <SelectItem key={group.value} value={group.value}>
                    {group.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add a tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Button type="button" variant="outline" onClick={handleAddTag}>
              Add
            </Button>
          </div>
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>File Upload</CardTitle>
        </CardHeader>
        <CardContent>
          {fileInfo ? (
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <FileText className="h-10 w-10 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">{fileInfo.name}</p>
                <p className="text-sm text-muted-foreground">
                  {fileInfo.type} - {formatFileSize(fileInfo.size)}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleRemoveFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 rounded-lg border-2 border-dashed p-8">
              <Upload className="h-10 w-10 text-muted-foreground" />
              <div className="text-center">
                <p className="font-medium">Upload a file</p>
                <p className="text-sm text-muted-foreground">
                  PDF, PGN, images, or videos
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.pgn,.png,.jpg,.jpeg,.gif,.mp4,.webm"
                onChange={handleFileUpload}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadMutation.isPending}
              >
                {uploadMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Select File'
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {lesson ? 'Update Lesson' : 'Create Lesson'}
        </Button>
      </div>
    </form>
  );
}

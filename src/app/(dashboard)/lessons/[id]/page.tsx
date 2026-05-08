'use client';

import { useParams } from 'next/navigation';
import { useLesson } from '@/hooks/use-lessons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  Pencil,
  Download,
  FileText,
  Image as ImageIcon,
  Video,
  File,
  Calendar,
  BookOpen,
  Tag,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { getFileTypeIcon } from '@/lib/validations/lesson';
import { getClassName } from '@/lib/utils';

const fileIcons: Record<string, React.ReactNode> = {
  pdf: <FileText className="h-16 w-16 text-red-500" />,
  image: <ImageIcon className="h-16 w-16 text-blue-500" />,
  video: <Video className="h-16 w-16 text-purple-500" />,
  pgn: <FileText className="h-16 w-16 text-green-500" />,
  file: <File className="h-16 w-16 text-gray-500" />,
};

export default function LessonDetailPage() {
  const params = useParams();
  const lessonId = params.id as string;

  const { data: lesson, isLoading } = useLesson(lessonId);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/lessons">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Lesson Not Found</h1>
        </div>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            The lesson you are looking for does not exist.
          </CardContent>
        </Card>
      </div>
    );
  }

  const getSkillBadge = (level: string | null) => {
    if (!level) return null;
    const colors: Record<string, string> = {
      beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      intermediate: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
      advanced: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
      expert: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
      all: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
    };
    return (
      <Badge variant="outline" className={colors[level]}>
        {level === 'all' ? 'All Levels' : level}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/lessons">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Lesson Details</h1>
      </div>

      {/* Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex-shrink-0">
              {lesson.file_type
                ? fileIcons[getFileTypeIcon(lesson.file_type)]
                : fileIcons.file}
            </div>
            <div className="flex-1 space-y-3">
              <h2 className="text-2xl font-bold">{lesson.title}</h2>
              {lesson.description && (
                <p className="text-muted-foreground">{lesson.description}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {lesson.category && (
                  <Badge variant="secondary">{lesson.category}</Badge>
                )}
                {getSkillBadge(lesson.skill_level)}
                {lesson.target_age_group && (
                  <Badge variant="outline" className="capitalize">
                    {lesson.target_age_group === 'all'
                      ? 'All Ages'
                      : lesson.target_age_group}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {lesson.file_url && (
                <Button variant="outline" asChild>
                  <a href={lesson.file_url} download={lesson.file_name}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </a>
                </Button>
              )}
              <Button asChild>
                <Link href={`/lessons/${lessonId}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* File Information */}
        {lesson.file_url && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                File Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">File Name</p>
                <p className="font-medium">{lesson.file_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="font-medium">{lesson.file_type}</p>
              </div>
              {lesson.file_size && (
                <div>
                  <p className="text-sm text-muted-foreground">Size</p>
                  <p className="font-medium">{formatFileSize(lesson.file_size)}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {lesson.class && (
              <div>
                <p className="text-sm text-muted-foreground">Clasa Asociata</p>
                <Link
                  href={`/classes/${lesson.class_id}`}
                  className="font-medium text-primary hover:underline flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  {getClassName(lesson.class.day_of_week, lesson.class.target_age_group)}
                </Link>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="font-medium">
                {format(new Date(lesson.created_at), 'MMMM d, yyyy')}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="font-medium">
                {format(new Date(lesson.updated_at), 'MMMM d, yyyy')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        {lesson.tags && lesson.tags.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {lesson.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Preview Section (for images and PDFs) */}
      {lesson.file_url && lesson.file_type?.includes('image') && (
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full">
              <Image
                src={lesson.file_url}
                alt={lesson.title}
                width={800}
                height={600}
                className="max-w-full rounded-lg"
                unoptimized
              />
            </div>
          </CardContent>
        </Card>
      )}

      {lesson.file_url && lesson.file_type?.includes('pdf') && (
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <iframe
              src={lesson.file_url}
              className="w-full h-[600px] rounded-lg border"
              title={lesson.title}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

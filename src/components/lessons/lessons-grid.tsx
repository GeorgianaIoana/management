'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLessons, useDeleteLesson, useCategories } from '@/hooks/use-lessons';
import type { LessonFilters, PaginationParams, Lesson } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Search,
  Plus,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Image as ImageIcon,
  Video,
  File,
  Download,
} from 'lucide-react';
import { getFileTypeIcon } from '@/lib/validations/lesson';

const fileIcons: Record<string, React.ReactNode> = {
  pdf: <FileText className="h-10 w-10 text-red-500" />,
  image: <ImageIcon className="h-10 w-10 text-blue-500" />,
  video: <Video className="h-10 w-10 text-purple-500" />,
  pgn: <FileText className="h-10 w-10 text-green-500" />,
  file: <File className="h-10 w-10 text-gray-500" />,
};

export function LessonsGrid() {
  const [filters, setFilters] = useState<LessonFilters>({});
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    pageSize: 12,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null);

  const { data, isLoading } = useLessons(filters, pagination);
  const { data: categories } = useCategories();
  const deleteMutation = useDeleteLesson();

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (key: keyof LessonFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value === 'all' ? undefined : value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleDelete = async () => {
    if (lessonToDelete) {
      await deleteMutation.mutateAsync(lessonToDelete.id);
      setDeleteDialogOpen(false);
      setLessonToDelete(null);
    }
  };

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
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search lessons..."
              value={filters.search ?? ''}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={filters.category ?? 'all'}
            onValueChange={(value) => {
              if (value) handleFilterChange('category', value)
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.skill_level ?? 'all'}
            onValueChange={(value) => {
              if (value) handleFilterChange('skill_level', value)
            }}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Skill Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button asChild>
          <Link href="/lessons/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Lesson
          </Link>
        </Button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-16 w-16 mx-auto" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3 mt-1" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : data?.data.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No lessons found</p>
            <p className="text-sm">Get started by adding your first lesson</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data?.data.map((lesson) => (
            <Card key={lesson.id} className="group relative overflow-hidden">
              <div className="absolute right-2 top-2 z-10 opacity-0 transition-opacity group-hover:opacity-100">
                <DropdownMenu>
                  <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-background/80 hover:bg-muted hover:text-foreground">
                    <MoreVertical className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/lessons/${lesson.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/lessons/${lesson.id}/edit`}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    {lesson.file_url && (
                      <DropdownMenuItem asChild>
                        <a href={lesson.file_url} download={lesson.file_name}>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </a>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => {
                        setLessonToDelete(lesson);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Link href={`/lessons/${lesson.id}`}>
                <CardHeader className="pb-2">
                  <div className="mx-auto">
                    {lesson.file_type
                      ? fileIcons[getFileTypeIcon(lesson.file_type)]
                      : fileIcons.file}
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <h3 className="font-semibold line-clamp-2">{lesson.title}</h3>
                  {lesson.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {lesson.description}
                    </p>
                  )}
                </CardContent>
                <CardFooter className="flex flex-wrap gap-1 pt-2">
                  {lesson.category && (
                    <Badge variant="secondary" className="text-xs">
                      {lesson.category}
                    </Badge>
                  )}
                  {getSkillBadge(lesson.skill_level)}
                </CardFooter>
              </Link>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.pageSize + 1} to{' '}
            {Math.min(pagination.page * pagination.pageSize, data.total)} of{' '}
            {data.total} lessons
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === 1}
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
              }
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {pagination.page} of {data.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === data.totalPages}
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
              }
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Lesson</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{' '}
              <span className="font-medium">{lessonToDelete?.title}</span>?
              This will also delete the associated file. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

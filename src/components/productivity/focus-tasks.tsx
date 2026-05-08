'use client';

import { useState } from 'react';
import {
  usePriorityTasks,
  useToggleTask,
  useToggleTaskPriority,
  useAddCustomTask,
} from '@/hooks/use-productivity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Target, Plus, X, Sparkles, Star, CheckCircle2 } from 'lucide-react';

interface FocusTasksProps {
  date: string;
}

const MAX_PRIORITIES = 7;

const ENCOURAGEMENTS = [
  'Excelent! Primul pas e făcut!',
  'Așa da! Continui cu energie!',
  'Superb! Ești pe drumul cel bun!',
  'Bravo! Fiecare task contează!',
  'Minunat! Mai aproape de obiectiv!',
  'Fantastic! Aproape ai terminat!',
  'Incredibil! Ești de neoprit!',
];

export function FocusTasks({ date }: FocusTasksProps) {
  const { data: tasks, isLoading } = usePriorityTasks(date);
  const toggleTask = useToggleTask();
  const togglePriority = useToggleTaskPriority();
  const addTask = useAddCustomTask();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleToggle = (taskId: string, currentValue: boolean) => {
    toggleTask.mutate({ id: taskId, isCompleted: !currentValue });
  };

  const handleRemovePriority = (taskId: string) => {
    togglePriority.mutate({ id: taskId, isPriority: false });
  };

  const handleAddPriority = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addTask.mutate(
      { date, title: newTaskTitle.trim(), isPriority: true },
      {
        onSuccess: () => {
          setNewTaskTitle('');
          setShowAddForm(false);
        },
      }
    );
  };

  const pendingTasks = tasks?.filter((t) => !t.is_completed) ?? [];
  const completedTasks = tasks?.filter((t) => t.is_completed) ?? [];
  const allComplete = tasks && tasks.length > 0 && completedTasks.length === tasks.length;
  const canAddMore = (tasks?.length ?? 0) < MAX_PRIORITIES;

  if (isLoading) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/[0.02]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        'border-primary/20 bg-gradient-to-br from-primary/5 to-primary/[0.02] transition-all duration-300',
        allComplete && 'border-green-500/30 from-green-500/5 to-green-500/[0.02]'
      )}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            {allComplete ? (
              <Sparkles className="h-5 w-5 text-green-500" />
            ) : (
              <Target className="h-5 w-5 text-primary" />
            )}
            <span>Focus de azi</span>
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              (max {MAX_PRIORITIES})
            </span>
          </CardTitle>
          {tasks && tasks.length > 0 && (
            <span
              className={cn(
                'text-xs font-medium',
                allComplete ? 'text-green-600' : 'text-muted-foreground'
              )}
            >
              {tasks.filter((t) => t.is_completed).length}/{tasks.length}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* All complete celebration */}
        {allComplete && tasks && tasks.length > 0 && (
          <div className="mb-3 flex items-center justify-center gap-2 rounded-lg bg-green-500/10 py-2.5 text-sm text-green-600">
            <Sparkles className="h-4 w-4" />
            <span>Toate prioritățile completate!</span>
          </div>
        )}

        {/* Empty state */}
        {(!tasks || tasks.length === 0) && !showAddForm && (
          <div className="py-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Star className="h-6 w-6 text-primary" />
            </div>
            <p className="font-medium text-foreground">Care sunt prioritățile de azi?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Adaugă maximum {MAX_PRIORITIES} lucruri importante
            </p>
            <Button
              onClick={() => setShowAddForm(true)}
              className="mt-4"
              size="sm"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Adaugă prima prioritate
            </Button>
          </div>
        )}

        {/* Pending tasks list */}
        {pendingTasks.map((task, index) => (
          <div
            key={task.id}
            className="group flex items-center gap-3 rounded-xl bg-background/50 px-4 py-3 transition-all duration-200 hover:bg-background/80"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {index + 1}
            </span>
            <Checkbox
              checked={false}
              onCheckedChange={() => handleToggle(task.id, task.is_completed)}
              className="transition-all duration-200"
            />
            <span className="flex-1 text-sm font-medium">
              {task.title}
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
              onClick={() => handleRemovePriority(task.id)}
              title="Elimină din priorități"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}

        {/* Done section */}
        {completedTasks.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-600">Done</span>
              <span className="text-xs text-muted-foreground">({completedTasks.length})</span>
            </div>
            <div className="space-y-2">
              {completedTasks.map((task, index) => (
                <div
                  key={task.id}
                  className="group flex items-center gap-3 rounded-xl bg-green-500/5 px-4 py-3 transition-all duration-200 hover:bg-green-500/10"
                >
                  <Checkbox
                    checked={true}
                    onCheckedChange={() => handleToggle(task.id, task.is_completed)}
                    className="border-green-500 bg-green-500 text-white transition-all duration-200"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-muted-foreground line-through">
                      {task.title}
                    </span>
                    <p className="text-xs text-green-600 mt-0.5">
                      {ENCOURAGEMENTS[index % ENCOURAGEMENTS.length]}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemovePriority(task.id)}
                    title="Elimină din priorități"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add new priority form */}
        {showAddForm && (
          <form onSubmit={handleAddPriority} className="flex gap-2 pt-2">
            <Input
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Ce e important de făcut azi?"
              className="h-10"
              autoFocus
            />
            <Button type="submit" disabled={!newTaskTitle.trim() || addTask.isPending}>
              {addTask.isPending ? '...' : 'Adaugă'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowAddForm(false);
                setNewTaskTitle('');
              }}
            >
              Anulează
            </Button>
          </form>
        )}

        {/* Add more button */}
        {tasks && tasks.length > 0 && canAddMore && !showAddForm && !allComplete && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-primary/30 py-3 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-foreground"
          >
            <Plus className="h-4 w-4" />
            <span>Adaugă prioritate ({tasks.length}/{MAX_PRIORITIES})</span>
          </button>
        )}
      </CardContent>
    </Card>
  );
}

'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  useDailyTasks,
  useEnsureDailyTasks,
  useToggleTask,
  useToggleTaskPriority,
  useDeleteTask,
  useAddCustomTask,
} from '@/hooks/use-productivity';
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ClipboardList, Trash2, Plus, CheckCircle2, Sparkles, Star } from 'lucide-react';
import { AddCustomTask } from './add-custom-task';

interface DailyTasksProps {
  date: string;
}

export function DailyTasks({ date }: DailyTasksProps) {
  const { data: tasks, isLoading } = useDailyTasks(date);
  const ensureTasks = useEnsureDailyTasks();
  const toggleTask = useToggleTask();
  const togglePriority = useToggleTaskPriority();
  const deleteTask = useDeleteTask();
  const addTask = useAddCustomTask();

  const [quickAddValue, setQuickAddValue] = useState('');
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  // Ensure daily tasks exist when the component mounts
  useEffect(() => {
    ensureTasks.mutate(date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  // Calculate progress (excluding priority tasks which are shown separately)
  const progress = useMemo(() => {
    const nonPriority = tasks?.filter((t) => !t.is_priority) ?? [];
    if (nonPriority.length === 0) return { completed: 0, total: 0, percentage: 0 };
    const completed = nonPriority.filter((t) => t.is_completed).length;
    return {
      completed,
      total: nonPriority.length,
      percentage: Math.round((completed / nonPriority.length) * 100),
    };
  }, [tasks]);

  const handleToggle = (taskId: string, currentValue: boolean) => {
    toggleTask.mutate({ id: taskId, isCompleted: !currentValue });
  };

  const handleDelete = (taskId: string) => {
    deleteTask.mutate(taskId);
  };

  const handleTogglePriority = (taskId: string, isPriority: boolean) => {
    togglePriority.mutate({ id: taskId, isPriority: !isPriority });
  };

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAddValue.trim()) return;

    addTask.mutate(
      { date, title: quickAddValue.trim() },
      {
        onSuccess: () => {
          setQuickAddValue('');
          setShowQuickAdd(false);
        },
      }
    );
  };

  // Filter out priority tasks and separate recurring and custom tasks
  const nonPriorityTasks = tasks?.filter((t) => !t.is_priority) ?? [];
  const recurringTasks = nonPriorityTasks.filter((t) => !t.is_custom);
  const customTasks = nonPriorityTasks.filter((t) => t.is_custom);
  const allComplete = nonPriorityTasks.length > 0 && nonPriorityTasks.every((t) => t.is_completed);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      'transition-all duration-300',
      allComplete && 'ring-2 ring-green-500/20 bg-green-500/[0.02]'
    )}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            {allComplete ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <ClipboardList className="h-5 w-5 text-primary" />
            )}
            Taskurile de azi
          </CardTitle>
          {progress.total > 0 && (
            <span className={cn(
              'text-xs font-medium',
              allComplete ? 'text-green-600' : 'text-muted-foreground'
            )}>
              {progress.completed}/{progress.total}
            </span>
          )}
        </div>
        {/* Progress bar */}
        {progress.total > 0 && (
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                'h-full transition-all duration-500',
                allComplete ? 'bg-green-500' : 'bg-primary'
              )}
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        )}
        <CardAction>
          <AddCustomTask date={date} />
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-1">
        {nonPriorityTasks.length === 0 ? (
          <div className="py-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
              <Sparkles className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">Niciun task pentru azi</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Adaugă primul task pentru a începe
            </p>
          </div>
        ) : (
          <>
            {/* All tasks done celebration */}
            {allComplete && (
              <div className="mb-3 flex items-center justify-center gap-2 rounded-lg bg-green-500/10 py-2 text-sm text-green-600">
                <Sparkles className="h-4 w-4" />
                <span>Toate taskurile completate!</span>
              </div>
            )}

            {/* Recurring tasks */}
            {recurringTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onTogglePriority={handleTogglePriority}
                showDelete={false}
              />
            ))}

            {/* Separator if both types exist */}
            {recurringTasks.length > 0 && customTasks.length > 0 && (
              <div className="my-2 border-t border-dashed" />
            )}

            {/* Custom tasks */}
            {customTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onTogglePriority={handleTogglePriority}
                showDelete={true}
              />
            ))}
          </>
        )}

        {/* Inline quick add */}
        <div className="pt-2">
          {showQuickAdd ? (
            <form onSubmit={handleQuickAdd} className="flex gap-2">
              <Input
                value={quickAddValue}
                onChange={(e) => setQuickAddValue(e.target.value)}
                placeholder="Numele taskului..."
                className="h-9 text-sm"
                autoFocus
                onBlur={() => {
                  if (!quickAddValue.trim()) setShowQuickAdd(false);
                }}
              />
              <Button type="submit" size="sm" disabled={!quickAddValue.trim() || addTask.isPending}>
                {addTask.isPending ? '...' : 'Adaugă'}
              </Button>
            </form>
          ) : (
            <button
              onClick={() => setShowQuickAdd(true)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            >
              <Plus className="h-4 w-4" />
              <span>Adaugă rapid un task</span>
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface TaskItemProps {
  task: {
    id: string;
    title: string;
    is_completed: boolean;
    is_custom: boolean;
    is_priority: boolean;
  };
  onToggle: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
  onTogglePriority: (id: string, isPriority: boolean) => void;
  showDelete: boolean;
}

function TaskItem({ task, onToggle, onDelete, onTogglePriority, showDelete }: TaskItemProps) {
  return (
    <div
      className={cn(
        'group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200',
        'hover:bg-muted/50',
        task.is_completed && 'opacity-75'
      )}
    >
      <div className="relative">
        <Checkbox
          checked={task.is_completed}
          onCheckedChange={() => onToggle(task.id, task.is_completed)}
          className={cn(
            'transition-all duration-200',
            task.is_completed && 'border-green-500 bg-green-500 text-white'
          )}
        />
      </div>
      <span
        className={cn(
          'flex-1 text-sm transition-all duration-200',
          task.is_completed && 'text-muted-foreground line-through'
        )}
      >
        {task.title}
      </span>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon-xs"
          className="text-muted-foreground hover:text-amber-500"
          onClick={() => onTogglePriority(task.id, task.is_priority)}
          title="Marchează ca prioritate"
        >
          <Star className="h-3.5 w-3.5" />
        </Button>
        {showDelete && (
          <Button
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(task.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}

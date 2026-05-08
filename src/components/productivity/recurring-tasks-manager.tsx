'use client';

import { useState } from 'react';
import {
  useRecurringTasks,
  useCreateRecurringTask,
  useUpdateRecurringTask,
  useDeleteRecurringTask,
} from '@/hooks/use-productivity';
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, RefreshCw } from 'lucide-react';
import { frequencyOptions } from '@/lib/validations/productivity';
import type { RecurringTask, TaskFrequency } from '@/types';

export function RecurringTasksManager() {
  const { data: tasks, isLoading } = useRecurringTasks(false);
  const createTask = useCreateRecurringTask();
  const updateTask = useUpdateRecurringTask();
  const deleteTask = useDeleteRecurringTask();

  const [editingTask, setEditingTask] = useState<RecurringTask | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleToggleActive = (task: RecurringTask) => {
    updateTask.mutate({ id: task.id, data: { is_active: !task.is_active } });
  };

  const handleDelete = (id: string) => {
    if (confirm('Ești sigur că vrei să ștergi acest task?')) {
      deleteTask.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Taskuri Recurente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <RefreshCw className="h-5 w-5" />
          Taskuri Recurente
        </CardTitle>
        <CardAction>
          <TaskDialog
            open={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            onSubmit={(data) => {
              createTask.mutate(data, {
                onSuccess: () => setIsCreateOpen(false),
              });
            }}
            isPending={createTask.isPending}
          />
        </CardAction>
      </CardHeader>
      <CardContent>
        {tasks?.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Nu ai taskuri recurente. Adaugă unul nou!
          </p>
        ) : (
          <div className="space-y-2">
            {tasks?.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-xl border p-3"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{task.title}</span>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      {frequencyOptions.find((f) => f.value === task.frequency)?.label}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={task.is_active}
                    onCheckedChange={() => handleToggleActive(task)}
                  />
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setEditingTask(task)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleDelete(task.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        {editingTask && (
          <TaskDialog
            open={!!editingTask}
            onOpenChange={(open) => !open && setEditingTask(null)}
            task={editingTask}
            onSubmit={(data) => {
              updateTask.mutate(
                { id: editingTask.id, data },
                { onSuccess: () => setEditingTask(null) }
              );
            }}
            isPending={updateTask.isPending}
          />
        )}
      </CardContent>
    </Card>
  );
}

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: RecurringTask;
  onSubmit: (data: {
    title: string;
    description: string | null;
    frequency: TaskFrequency;
    is_active: boolean;
    display_order: number;
  }) => void;
  isPending: boolean;
}

function TaskDialog({ open, onOpenChange, task, onSubmit, isPending }: TaskDialogProps) {
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [frequency, setFrequency] = useState<TaskFrequency>(task?.frequency ?? 'daily');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim() || null,
      frequency,
      is_active: task?.is_active ?? true,
      display_order: task?.display_order ?? 0,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!task && (
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            <Plus className="mr-1.5 h-4 w-4" />
            Adaugă
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? 'Editează task' : 'Task recurent nou'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titlu</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Meditație"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descriere (opțional)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detalii adiționale"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequency">Frecvență</Label>
              <Select value={frequency} onValueChange={(v) => setFrequency(v as TaskFrequency)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {frequencyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Anulează
            </Button>
            <Button type="submit" disabled={!title.trim() || isPending}>
              {isPending ? 'Se salvează...' : task ? 'Salvează' : 'Adaugă'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

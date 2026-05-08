'use client';

import { useState } from 'react';
import { useAddCustomTask } from '@/hooks/use-productivity';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

interface AddCustomTaskProps {
  date: string;
}

export function AddCustomTask({ date }: AddCustomTaskProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const addTask = useAddCustomTask();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask.mutate(
      { date, title: title.trim() },
      {
        onSuccess: () => {
          setTitle('');
          setOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Plus className="mr-1.5 h-4 w-4" />
          Adaugă task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adaugă task nou</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titlu task</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ce vrei să faci azi?"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Anulează
            </Button>
            <Button type="submit" disabled={!title.trim() || addTask.isPending}>
              {addTask.isPending ? 'Se adaugă...' : 'Adaugă'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

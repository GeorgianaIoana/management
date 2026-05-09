'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Target,
  TrendingUp,
  Lightbulb,
  Flag,
  CheckCircle2,
  Circle,
  Plus,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  deadline: string;
  status: string;
}

export default function StrategyPage() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('growth');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('not_started');

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Expand to 500 members',
      description: 'Grow club membership to 500 active members',
      category: 'growth',
      deadline: '2025-12-31',
      status: 'in_progress',
    },
    {
      id: '2',
      title: 'Launch YouTube Channel',
      description: 'Create educational chess content for wider reach',
      category: 'marketing',
      deadline: '2025-05-16',
      status: 'in_progress',
    },
    {
      id: '3',
      title: 'Partner with 10 schools',
      description: 'Establish chess programs in local schools',
      category: 'partnerships',
      deadline: '2025-09-01',
      status: 'not_started',
    },
    {
      id: '4',
      title: 'Host international tournament',
      description: 'Organize a major chess tournament with international players',
      category: 'events',
      deadline: '2025-08-15',
      status: 'not_started',
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newGoal: Goal = {
      id: Date.now().toString(),
      title,
      description,
      category,
      deadline,
      status,
    };
    setGoals([...goals, newGoal]);
    toast.success('Goal added!', {
      description: `"${title}" has been added to your strategy.`,
    });
    setOpen(false);
    setTitle('');
    setDescription('');
    setCategory('growth');
    setDeadline('');
    setStatus('not_started');
  };

  const getCategoryIcon = (cat: string) => {
    const icons: Record<string, typeof Target> = {
      growth: TrendingUp,
      marketing: Lightbulb,
      partnerships: Flag,
      events: Calendar,
    };
    const Icon = icons[cat] || Target;
    return <Icon className="h-5 w-5" />;
  };

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      growth: 'Growth',
      marketing: 'Marketing',
      partnerships: 'Partnerships',
      events: 'Events',
    };
    return labels[cat] || cat;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'completed') {
      return (
        <Badge variant="default" className="bg-green-600">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Completed
        </Badge>
      );
    }
    if (status === 'in_progress') {
      return (
        <Badge variant="default" className="bg-blue-600">
          <Circle className="mr-1 h-3 w-3" />
          In Progress
        </Badge>
      );
    }
    return (
      <Badge variant="outline">
        <Circle className="mr-1 h-3 w-3" />
        Not Started
      </Badge>
    );
  };

  const completedCount = goals.filter((g) => g.status === 'completed').length;
  const inProgressCount = goals.filter((g) => g.status === 'in_progress').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Strategy</h1>
          <p className="mt-1 text-[14px] text-muted-foreground">
            Define and track your long-term goals and objectives
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Strategic Goal</DialogTitle>
              <DialogDescription>
                Define a new goal to track in your strategy.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Goal Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter goal title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the goal..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="growth">Growth</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="partnerships">Partnerships</SelectItem>
                      <SelectItem value="events">Events</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_started">Not Started</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Goal</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goals.length}</div>
            <p className="text-xs text-muted-foreground">strategic objectives</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inProgressCount}</div>
            <p className="text-xs text-muted-foreground">being worked on</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
            <p className="text-xs text-muted-foreground">goals achieved</p>
          </CardContent>
        </Card>
      </div>

      {/* Goals List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Flag className="h-5 w-5 text-primary" />
            Strategic Goals
          </CardTitle>
          <CardDescription>Your long-term objectives and milestones</CardDescription>
        </CardHeader>
        <CardContent>
          {goals.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              No goals defined. Click &quot;Add Goal&quot; to create one.
            </p>
          ) : (
            <div className="space-y-4">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className="flex items-start justify-between rounded-lg border p-4"
                >
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      {getCategoryIcon(goal.category)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{goal.title}</h3>
                        {getStatusBadge(goal.status)}
                      </div>
                      {goal.description && (
                        <p className="text-sm text-muted-foreground">{goal.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {goal.deadline ? format(new Date(goal.deadline), 'MMM d, yyyy') : 'No deadline'}
                        </span>
                        <Badge variant="secondary">{getCategoryLabel(goal.category)}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

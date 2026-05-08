'use client';

import { useState } from 'react';
import {
  useAllQuestions,
  useCreateQuestion,
  useUpdateQuestion,
  useDeleteQuestion,
} from '@/hooks/use-productivity';
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, HelpCircle, Sun, Moon } from 'lucide-react';
import { questionTypeOptions, responseTypeOptions } from '@/lib/validations/productivity';
import type { ProductivityQuestion, QuestionType, ResponseType } from '@/types';

export function QuestionsManager() {
  const { data: questions, isLoading } = useAllQuestions();
  const createQuestion = useCreateQuestion();
  const updateQuestion = useUpdateQuestion();
  const deleteQuestion = useDeleteQuestion();

  const [editingQuestion, setEditingQuestion] = useState<ProductivityQuestion | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<QuestionType>('morning');

  const handleToggleActive = (question: ProductivityQuestion) => {
    updateQuestion.mutate({ id: question.id, data: { is_active: !question.is_active } });
  };

  const handleDelete = (id: string) => {
    if (confirm('Ești sigur că vrei să ștergi această întrebare?')) {
      deleteQuestion.mutate(id);
    }
  };

  const morningQuestions = questions?.filter((q) => q.question_type === 'morning') ?? [];
  const eveningQuestions = questions?.filter((q) => q.question_type === 'evening') ?? [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Întrebări Check-in</CardTitle>
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
          <HelpCircle className="h-5 w-5" />
          Întrebări Check-in
        </CardTitle>
        <CardAction>
          <QuestionDialog
            open={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            defaultType={activeTab}
            onSubmit={(data) => {
              createQuestion.mutate(data, {
                onSuccess: () => setIsCreateOpen(false),
              });
            }}
            isPending={createQuestion.isPending}
          />
        </CardAction>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as QuestionType)}>
          <TabsList className="mb-4">
            <TabsTrigger value="morning" className="gap-1.5">
              <Sun className="h-4 w-4" />
              Dimineață ({morningQuestions.length})
            </TabsTrigger>
            <TabsTrigger value="evening" className="gap-1.5">
              <Moon className="h-4 w-4" />
              Seară ({eveningQuestions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="morning">
            <QuestionList
              questions={morningQuestions}
              onToggle={handleToggleActive}
              onEdit={setEditingQuestion}
              onDelete={handleDelete}
            />
          </TabsContent>

          <TabsContent value="evening">
            <QuestionList
              questions={eveningQuestions}
              onToggle={handleToggleActive}
              onEdit={setEditingQuestion}
              onDelete={handleDelete}
            />
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        {editingQuestion && (
          <QuestionDialog
            open={!!editingQuestion}
            onOpenChange={(open) => !open && setEditingQuestion(null)}
            question={editingQuestion}
            onSubmit={(data) => {
              updateQuestion.mutate(
                { id: editingQuestion.id, data },
                { onSuccess: () => setEditingQuestion(null) }
              );
            }}
            isPending={updateQuestion.isPending}
          />
        )}
      </CardContent>
    </Card>
  );
}

interface QuestionListProps {
  questions: ProductivityQuestion[];
  onToggle: (question: ProductivityQuestion) => void;
  onEdit: (question: ProductivityQuestion) => void;
  onDelete: (id: string) => void;
}

function QuestionList({ questions, onToggle, onEdit, onDelete }: QuestionListProps) {
  if (questions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">
        Nu ai întrebări configurate. Adaugă una nouă!
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {questions.map((question) => (
        <div
          key={question.id}
          className="flex items-center justify-between rounded-xl border p-3"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{question.question_text}</span>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                {responseTypeOptions.find((r) => r.value === question.response_type)?.label}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={question.is_active}
              onCheckedChange={() => onToggle(question)}
            />
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onEdit(question)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onDelete(question.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

interface QuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question?: ProductivityQuestion;
  defaultType?: QuestionType;
  onSubmit: (data: {
    question_text: string;
    question_type: QuestionType;
    response_type: ResponseType;
    is_active: boolean;
    display_order: number;
  }) => void;
  isPending: boolean;
}

function QuestionDialog({
  open,
  onOpenChange,
  question,
  defaultType = 'morning',
  onSubmit,
  isPending,
}: QuestionDialogProps) {
  const [questionText, setQuestionText] = useState(question?.question_text ?? '');
  const [questionType, setQuestionType] = useState<QuestionType>(
    question?.question_type ?? defaultType
  );
  const [responseType, setResponseType] = useState<ResponseType>(
    question?.response_type ?? 'text'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    onSubmit({
      question_text: questionText.trim(),
      question_type: questionType,
      response_type: responseType,
      is_active: question?.is_active ?? true,
      display_order: question?.display_order ?? 0,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!question && (
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            <Plus className="mr-1.5 h-4 w-4" />
            Adaugă
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{question ? 'Editează întrebare' : 'Întrebare nouă'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="questionText">Textul întrebării</Label>
              <Input
                id="questionText"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Ex: Cum te simți azi?"
                autoFocus
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="questionType">Tipul</Label>
                <Select
                  value={questionType}
                  onValueChange={(v) => setQuestionType(v as QuestionType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {questionTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="responseType">Tipul răspunsului</Label>
                <Select
                  value={responseType}
                  onValueChange={(v) => setResponseType(v as ResponseType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {responseTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
            <Button type="submit" disabled={!questionText.trim() || isPending}>
              {isPending ? 'Se salvează...' : question ? 'Salvează' : 'Adaugă'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

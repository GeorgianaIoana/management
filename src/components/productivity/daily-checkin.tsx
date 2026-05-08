'use client';

import { useState, useEffect, useMemo } from 'react';
import { useQuestions, useDailyResponses, useSaveResponses } from '@/hooks/use-productivity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Sun, Moon, Check, CheckCircle2, Circle } from 'lucide-react';
import { moodOptions, energyOptions } from '@/lib/validations/productivity';
import type { QuestionType } from '@/types';

interface DailyCheckinProps {
  type: QuestionType;
  date: string;
}

export function DailyCheckin({ type, date }: DailyCheckinProps) {
  const { data: questions, isLoading: questionsLoading } = useQuestions(type);
  const { data: existingResponses, isLoading: responsesLoading } = useDailyResponses(date);
  const saveResponses = useSaveResponses();

  const [responses, setResponses] = useState<Record<string, string | number>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Calculate completion status
  const completionStatus = useMemo(() => {
    if (!questions || !existingResponses) return { completed: 0, total: 0, isComplete: false };

    const relevantQuestions = questions;
    const answeredCount = relevantQuestions.filter((q) => {
      const existing = existingResponses.find((r) => r.question_id === q.id);
      if (!existing) return false;
      if (q.response_type === 'text') {
        return existing.response_text && existing.response_text.trim() !== '';
      }
      return existing.response_value !== null && existing.response_value > 0;
    }).length;

    return {
      completed: answeredCount,
      total: relevantQuestions.length,
      isComplete: answeredCount === relevantQuestions.length && relevantQuestions.length > 0,
    };
  }, [questions, existingResponses]);

  // Initialize responses from existing data
  // Initialize responses from existing data
  useEffect(() => {
    if (existingResponses && questions) {
      const initialResponses: Record<string, string | number> = {};
      for (const question of questions) {
        const existing = existingResponses.find((r) => r.question_id === question.id);
        if (existing) {
          if (question.response_type === 'text') {
            initialResponses[question.id] = existing.response_text ?? '';
          } else {
            initialResponses[question.id] = existing.response_value ?? 0;
          }
        }
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect -- initialize from existing data
      setResponses(initialResponses);
      setHasUnsavedChanges(false);
    }
  }, [existingResponses, questions]);

  const handleResponseChange = (questionId: string, value: string | number) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    if (!questions) return;

    const responsesToSave = questions.map((q) => ({
      question_id: q.id,
      response_text: q.response_type === 'text' ? (responses[q.id] as string) ?? null : null,
      response_value: q.response_type !== 'text' ? (responses[q.id] as number) ?? null : null,
    }));

    saveResponses.mutate(
      { date, responses: responsesToSave },
      { onSuccess: () => setHasUnsavedChanges(false) }
    );
  };

  const isLoading = questionsLoading || responsesLoading;
  const isMorning = type === 'morning';
  const hasAnyResponse = Object.values(responses).some((v) => v !== '' && v !== 0);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      'transition-all duration-300',
      completionStatus.isComplete && 'ring-2 ring-green-500/20 bg-green-500/[0.02]'
    )}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            {isMorning ? (
              <Sun className="h-5 w-5 text-amber-500" />
            ) : (
              <Moon className="h-5 w-5 text-indigo-500" />
            )}
            {isMorning ? 'Check-in Dimineață' : 'Reflecție Seară'}
          </CardTitle>
          {completionStatus.total > 0 && (
            <div className="flex items-center gap-2">
              {completionStatus.isComplete ? (
                <Badge variant="outline" className="gap-1 border-green-500/30 bg-green-500/10 text-green-600">
                  <CheckCircle2 className="h-3 w-3" />
                  Completat
                </Badge>
              ) : (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Circle className="h-3 w-3" />
                  {completionStatus.completed}/{completionStatus.total}
                </span>
              )}
            </div>
          )}
        </div>
        {/* Progress bar */}
        {completionStatus.total > 0 && !completionStatus.isComplete && (
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(completionStatus.completed / completionStatus.total) * 100}%` }}
            />
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-5">
        {questions?.map((question) => (
          <div key={question.id} className="space-y-2">
            <label className="text-sm font-medium">{question.question_text}</label>

            {question.response_type === 'mood' && (
              <div className="flex gap-2">
                {moodOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleResponseChange(question.id, option.value)}
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-xl text-xl transition-all',
                      responses[question.id] === option.value
                        ? 'bg-primary/10 ring-2 ring-primary scale-110'
                        : 'bg-muted/50 hover:bg-muted'
                    )}
                    title={option.label}
                  >
                    {option.emoji}
                  </button>
                ))}
              </div>
            )}

            {question.response_type === 'energy' && (
              <div className="flex gap-2">
                {energyOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleResponseChange(question.id, option.value)}
                    className={cn(
                      'flex h-9 items-center justify-center rounded-xl px-3 text-sm transition-all',
                      responses[question.id] === option.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50 hover:bg-muted'
                    )}
                  >
                    <span className="mr-1.5">{'⚡'.repeat(option.value)}</span>
                    <span className="hidden sm:inline">{option.label}</span>
                  </button>
                ))}
              </div>
            )}

            {question.response_type === 'scale' && (
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleResponseChange(question.id, value)}
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium transition-all',
                      responses[question.id] === value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50 hover:bg-muted'
                    )}
                  >
                    {value}
                  </button>
                ))}
              </div>
            )}

            {question.response_type === 'text' && (
              <Textarea
                value={(responses[question.id] as string) ?? ''}
                onChange={(e) => handleResponseChange(question.id, e.target.value)}
                placeholder="Scrie răspunsul tău aici..."
                className="min-h-[80px] resize-none"
              />
            )}
          </div>
        ))}

        <Button
          onClick={handleSave}
          disabled={saveResponses.isPending || !hasAnyResponse}
          className={cn(
            'w-full transition-all',
            completionStatus.isComplete && !hasUnsavedChanges && 'bg-green-600 hover:bg-green-700'
          )}
        >
          {saveResponses.isPending ? (
            'Se salvează...'
          ) : completionStatus.isComplete && !hasUnsavedChanges ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Salvat
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              {hasUnsavedChanges ? 'Salvează modificările' : 'Salvează'}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  RecurringTasksManager,
  QuestionsManager,
} from '@/components/productivity';
import { ArrowLeft } from 'lucide-react';

export default function ProductivitySettingsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/productivity">
          <Button variant="ghost" size="icon-sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Setări Productivity
          </h1>
          <p className="mt-1 text-[14px] text-muted-foreground">
            Gestionează întrebările și taskurile recurente
          </p>
        </div>
      </div>

      {/* Questions Manager */}
      <QuestionsManager />

      {/* Recurring Tasks Manager */}
      <RecurringTasksManager />
    </div>
  );
}

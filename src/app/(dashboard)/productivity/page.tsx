'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  StatsCards,
  FocusTasks,
  DailyCheckin,
  DailyTasks,
  MoodEnergyChart,
} from '@/components/productivity';
import { formatDisplayDate, shouldShowEveningCheckin } from '@/services/productivity';
import { Settings, Sparkles, Moon, Clock } from 'lucide-react';

function getGreeting(): { text: string; emoji: string } {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'Bună dimineața', emoji: '☀️' };
  if (hour < 18) return { text: 'Bună ziua', emoji: '🌤️' };
  return { text: 'Bună seara', emoji: '🌙' };
}

function getTimeUntilEvening(): string {
  const now = new Date();
  const evening = new Date();
  evening.setHours(18, 0, 0, 0);

  if (now >= evening) return '';

  const diff = evening.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes} minute`;
}

export default function ProductivityPage() {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const showEvening = shouldShowEveningCheckin();
  const greeting = getGreeting();
  const timeUntilEvening = getTimeUntilEvening();

  return (
    <div className="space-y-8">
      {/* Header with greeting */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{greeting.emoji}</span>
            <h1 className="text-2xl font-semibold tracking-tight">{greeting.text}!</h1>
          </div>
          <p className="text-[14px] text-muted-foreground">
            {formatDisplayDate(today)}
          </p>
        </div>
        <Link href="/productivity/settings">
          <Button variant="outline" size="sm">
            <Settings className="mr-1.5 h-4 w-4" />
            Settings
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Focus/Priority Tasks - Most Important Section */}
      <FocusTasks date={todayStr} />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Morning Check-in */}
        <DailyCheckin type="morning" date={todayStr} />

        {/* Daily Tasks */}
        <DailyTasks date={todayStr} />
      </div>

      {/* Mood & Energy Chart */}
      <MoodEnergyChart days={7} />

      {/* Evening Reflection */}
      {showEvening ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-indigo-500" />
            <span>Este timpul pentru reflecția de seară</span>
          </div>
          <DailyCheckin type="evening" date={todayStr} />
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl border border-dashed bg-gradient-to-br from-indigo-500/5 to-purple-500/5 p-8 text-center">
          <div className="relative z-10">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10">
              <Moon className="h-6 w-6 text-indigo-500" />
            </div>
            <h3 className="font-medium text-foreground">Reflecția de seară</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Disponibilă după ora 18:00
            </p>
            {timeUntilEvening && (
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>În {timeUntilEvening}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useMoodEnergyHistory } from '@/hooks/use-productivity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, ChevronDown, ChevronUp, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MoodEnergyChartProps {
  days?: number;
}

export function MoodEnergyChart({ days = 7 }: MoodEnergyChartProps) {
  const { data, isLoading } = useMoodEnergyHistory(days);
  const [isExpanded, setIsExpanded] = useState(true);

  // Format data for the chart
  const chartData = data?.map((d) => ({
    date: formatShortDate(d.date),
    'Mood Dimineață': d.morning_mood,
    'Mood Seară': d.evening_mood,
    'Energie Dimineață': d.morning_energy,
    'Energie Seară': d.evening_energy,
  })) ?? [];

  // Calculate averages for collapsed preview
  const averages = chartData.length > 0
    ? {
        mood: Math.round(
          chartData.reduce((sum, d) => sum + ((d['Mood Dimineață'] ?? 0) + (d['Mood Seară'] ?? 0)) / 2, 0) /
          chartData.filter(d => d['Mood Dimineață'] || d['Mood Seară']).length || 1
        ),
        energy: Math.round(
          chartData.reduce((sum, d) => sum + ((d['Energie Dimineață'] ?? 0) + (d['Energie Seară'] ?? 0)) / 2, 0) /
          chartData.filter(d => d['Energie Dimineață'] || d['Energie Seară']).length || 1
        ),
      }
    : null;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-48" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-5 w-5 text-primary" />
            Mood & Energy
            <span className="text-sm font-normal text-muted-foreground">
              ultimele {days} zile
            </span>
          </CardTitle>
          {chartData.length > 0 && (
            <div className="flex items-center gap-3">
              {/* Quick stats preview */}
              {!isExpanded && averages && (
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-muted-foreground">
                    Mood: <span className="font-medium text-foreground">{averages.mood}/5</span>
                  </span>
                  <span className="text-muted-foreground">
                    Energie: <span className="font-medium text-foreground">{averages.energy}/5</span>
                  </span>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="gap-1"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    Ascunde
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Detalii
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className={cn(
        'overflow-hidden transition-all duration-300',
        isExpanded ? 'max-h-[400px] opacity-100' : 'max-h-0 py-0 opacity-0'
      )}>
        {chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted/50">
              <BarChart3 className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="font-medium text-foreground">Încă nu ai date</p>
            <p className="mt-1 max-w-[280px] text-sm text-muted-foreground">
              Completează check-in-urile de dimineață și seară pentru a vedea evoluția ta
            </p>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[1, 5]}
                  ticks={[1, 2, 3, 4, 5]}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-3 shadow-lg">
                          <p className="font-medium mb-2">{label}</p>
                          {payload.map((entry, index) => (
                            <p
                              key={index}
                              style={{ color: entry.color }}
                              className="text-sm"
                            >
                              {entry.name}: {entry.value ?? '-'}
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Mood Dimineață"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="Mood Seară"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="Energie Dimineață"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 4 }}
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="Energie Seară"
                  stroke="hsl(var(--chart-4))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 4 }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr);
  const days = ['Dum', 'Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm'];
  return `${days[date.getDay()]} ${date.getDate()}`;
}

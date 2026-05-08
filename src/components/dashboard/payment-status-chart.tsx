'use client';

import { usePaymentStats } from '@/hooks/use-payments';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['hsl(var(--chart-2))', 'hsl(var(--chart-4))', 'hsl(var(--destructive))'];

export function PaymentStatusChart() {
  const { data, isLoading } = usePaymentStats();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Status</CardTitle>
          <CardDescription>Distribution of payment statuses</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  const chartData = [
    { name: 'Paid', value: data?.collected ?? 0, color: COLORS[0] },
    { name: 'Pending', value: data?.pending ?? 0, color: COLORS[1] },
    { name: 'Overdue', value: data?.overdue ?? 0, color: COLORS[2] },
  ].filter((d) => d.value > 0);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Status</CardTitle>
          <CardDescription>Distribution of payment statuses</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64 text-[13px] text-muted-foreground">
          No payment data available
        </CardContent>
      </Card>
    );
  }

  const total = chartData.reduce((acc, d) => acc + d.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Status</CardTitle>
        <CardDescription>Distribution of payment statuses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex">
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-xl border bg-card/95 backdrop-blur-sm px-4 py-3 shadow-lg">
                          <p className="text-[13px] font-medium">{payload[0].name}</p>
                          <p className="text-[13px] font-semibold">
                            {(payload[0].value as number).toLocaleString()} RON
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col justify-center gap-3 pr-2">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <div className="text-[12px]">
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="ml-2 font-medium">
                    {((item.value / total) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

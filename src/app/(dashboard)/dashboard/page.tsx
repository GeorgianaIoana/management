'use client';

import { usePaymentCounts } from '@/hooks/use-payments';
import {
  KPICards,
  PaymentStatusChart,
  TodaysClasses,
  RecentActivity,
  RevenueTrend,
} from '@/components/dashboard';

export default function DashboardPage() {
  // Initialize payment counts for sidebar badges
  usePaymentCounts();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-[14px] text-muted-foreground">
          Welcome to THE SQUARE Chess Club
        </p>
      </div>

      <KPICards />

      <div className="grid gap-6 lg:grid-cols-3">
        <RevenueTrend />
        <PaymentStatusChart />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TodaysClasses />
        <RecentActivity />
      </div>
    </div>
  );
}

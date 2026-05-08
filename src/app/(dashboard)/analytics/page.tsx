'use client';

import {
  RevenueChart,
  MemberGrowthChart,
  MemberDistributionChart,
} from '@/components/analytics';
import {
  useYearOverYearComparison,
  useAttendanceRates,
  useExportCSV,
} from '@/hooks/use-analytics';
import { usePaymentStats } from '@/hooks/use-payments';
import { useMemberStats } from '@/hooks/use-members';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  TrendingUp,
  TrendingDown,
  Download,
  DollarSign,
  Users,
  Calendar,
  Percent,
} from 'lucide-react';

export default function AnalyticsPage() {
  const { data: yoyData, isLoading: yoyLoading } = useYearOverYearComparison();
  const { data: paymentStats, isLoading: paymentLoading } = usePaymentStats();
  const { data: memberStats, isLoading: memberLoading } = useMemberStats();
  const { data: attendanceData, isLoading: attendanceLoading } = useAttendanceRates();
  const exportMutation = useExportCSV();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Club performance metrics and insights
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
          >
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => exportMutation.mutate('members')}
              disabled={exportMutation.isPending}
            >
              Export Members
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => exportMutation.mutate('payments')}
              disabled={exportMutation.isPending}
            >
              Export Payments
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => exportMutation.mutate('classes')}
              disabled={exportMutation.isPending}
            >
              Export Classes
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {paymentLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {paymentStats?.totalRevenue.toLocaleString()} RON
                </div>
                <p className="text-xs text-muted-foreground">
                  {paymentStats?.collectionRate.toFixed(1)}% collection rate
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Year over Year</CardTitle>
            {yoyData && yoyData.change >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            {yoyLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : yoyData ? (
              <>
                <div className="text-2xl font-bold">
                  {yoyData.change >= 0 ? '+' : ''}{yoyData.change.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  vs {yoyData.previousYear.toLocaleString()} RON last year
                </p>
              </>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {memberLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">{memberStats?.active}</div>
                <p className="text-xs text-muted-foreground">
                  +{memberStats?.newThisMonth} this month
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {attendanceLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {attendanceData?.overall.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Last 30 days average
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <RevenueChart />

      <div className="grid gap-6 lg:grid-cols-2">
        <MemberGrowthChart />

        <Card>
          <CardHeader>
            <CardTitle>Collection Metrics</CardTitle>
            <CardDescription>Payment collection breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {paymentLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Collected</span>
                    <span className="font-medium">
                      {paymentStats?.collected.toLocaleString()} RON
                    </span>
                  </div>
                  <Progress
                    value={
                      paymentStats?.totalRevenue
                        ? (paymentStats.collected / paymentStats.totalRevenue) * 100
                        : 0
                    }
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Pending</span>
                    <span className="font-medium">
                      {paymentStats?.pending.toLocaleString()} RON
                    </span>
                  </div>
                  <Progress
                    value={
                      paymentStats?.totalRevenue
                        ? (paymentStats.pending / paymentStats.totalRevenue) * 100
                        : 0
                    }
                    className="h-2 [&>div]:bg-yellow-500"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overdue</span>
                    <span className="font-medium text-destructive">
                      {paymentStats?.overdue.toLocaleString()} RON
                    </span>
                  </div>
                  <Progress
                    value={
                      paymentStats?.totalRevenue
                        ? (paymentStats.overdue / paymentStats.totalRevenue) * 100
                        : 0
                    }
                    className="h-2 [&>div]:bg-destructive"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <MemberDistributionChart />

      {/* Attendance by Class */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Attendance by Class
          </CardTitle>
          <CardDescription>
            Attendance rates for each class (last 30 days)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {attendanceLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : attendanceData?.byClass && attendanceData.byClass.length > 0 ? (
            <div className="space-y-4">
              {attendanceData.byClass.map((cls) => (
                <div key={cls.className} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{cls.className}</span>
                    <span className="font-medium">{cls.rate.toFixed(1)}%</span>
                  </div>
                  <Progress value={cls.rate} className="h-2" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">
              No attendance data available
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

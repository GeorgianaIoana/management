'use client';

import { PaymentsTable } from '@/components/payments';
import { usePaymentCounts, useOverduePayments, useDueThisWeekPayments } from '@/hooks/use-payments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Clock, Calendar } from 'lucide-react';

export default function PaymentsPage() {
  const { data: counts } = usePaymentCounts();
  const { data: overduePayments } = useOverduePayments();
  const { data: dueThisWeek } = useDueThisWeekPayments();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payments</h1>
        <p className="text-muted-foreground">
          Manage payment records and track collections
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts?.pending ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              payments awaiting collection
            </p>
          </CardContent>
        </Card>
        <Card className="border-destructive/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-destructive">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {counts?.overdue ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              payments past due date
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Due This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dueThisWeek?.length ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              payments due in 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Payments</TabsTrigger>
          <TabsTrigger value="overdue" className="flex items-center gap-2">
            Overdue
            {(counts?.overdue ?? 0) > 0 && (
              <Badge variant="destructive" className="h-5 px-1.5">
                {counts?.overdue}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="due-week">Due This Week</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <PaymentsTable />
        </TabsContent>
        <TabsContent value="overdue" className="mt-4">
          {overduePayments && overduePayments.length > 0 ? (
            <div className="rounded-lg border bg-card">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="p-4 text-left text-sm font-medium">Member</th>
                    <th className="p-4 text-left text-sm font-medium">Amount</th>
                    <th className="p-4 text-left text-sm font-medium">Due Date</th>
                    <th className="p-4 text-left text-sm font-medium">Days Overdue</th>
                  </tr>
                </thead>
                <tbody>
                  {overduePayments.map((payment) => {
                    const daysOverdue = Math.floor(
                      (new Date().getTime() - new Date(payment.due_date).getTime()) /
                        (1000 * 60 * 60 * 24)
                    );
                    return (
                      <tr key={payment.id} className="border-b last:border-0">
                        <td className="p-4">
                          <span className="font-medium">
                            {payment.member?.first_name} {payment.member?.last_name}
                          </span>
                        </td>
                        <td className="p-4 font-medium">
                          {payment.amount} {payment.currency}
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {new Date(payment.due_date).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <Badge variant="destructive">{daysOverdue} days</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No overdue payments
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="due-week" className="mt-4">
          {dueThisWeek && dueThisWeek.length > 0 ? (
            <div className="rounded-lg border bg-card">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="p-4 text-left text-sm font-medium">Member</th>
                    <th className="p-4 text-left text-sm font-medium">Amount</th>
                    <th className="p-4 text-left text-sm font-medium">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {dueThisWeek.map((payment) => (
                    <tr key={payment.id} className="border-b last:border-0">
                      <td className="p-4">
                        <span className="font-medium">
                          {payment.member?.first_name} {payment.member?.last_name}
                        </span>
                      </td>
                      <td className="p-4 font-medium">
                        {payment.amount} {payment.currency}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {new Date(payment.due_date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No payments due this week
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

'use client';

import { useParams } from 'next/navigation';
import { usePayment, useMarkPaymentPaid } from '@/hooks/use-payments';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Pencil,
  CheckCircle,
  AlertTriangle,
  Clock,
  CreditCard,
  Calendar,
  User,
  BookOpen,
  FileText,
} from 'lucide-react';
import Link from 'next/link';
import { format, isAfter, parseISO } from 'date-fns';
import { getClassName } from '@/lib/utils';

export default function PaymentDetailPage() {
  const params = useParams();
  const paymentId = params.id as string;

  const { data: payment, isLoading } = usePayment(paymentId);
  const markPaidMutation = useMarkPaymentPaid();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/payments">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Payment Not Found</h1>
        </div>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            The payment you are looking for does not exist.
          </CardContent>
        </Card>
      </div>
    );
  }

  const isOverdue =
    payment.status === 'pending' &&
    isAfter(new Date(), parseISO(payment.due_date));

  const getStatusBadge = () => {
    if (isOverdue || payment.status === 'overdue') {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Overdue
        </Badge>
      );
    }

    const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
      paid: 'default',
      pending: 'outline',
      cancelled: 'secondary',
    };

    const icons: Record<string, React.ReactNode> = {
      paid: <CheckCircle className="h-3 w-3" />,
      pending: <Clock className="h-3 w-3" />,
    };

    return (
      <Badge variant={variants[payment.status]} className="flex items-center gap-1">
        {icons[payment.status]}
        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/payments">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Payment Details</h1>
      </div>

      {/* Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold">
                  {payment.amount.toLocaleString()} {payment.currency}
                </h2>
                {getStatusBadge()}
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <Link
                    href={`/members/${payment.member_id}`}
                    className="text-primary hover:underline"
                  >
                    {payment.member?.first_name} {payment.member?.last_name}
                  </Link>
                </div>
                {payment.class && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <Link
                      href={`/classes/${payment.class_id}`}
                      className="text-primary hover:underline"
                    >
                      {getClassName(payment.class.day_of_week, payment.class.target_age_group)}
                    </Link>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Due: {format(new Date(payment.due_date), 'MMMM d, yyyy')}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {payment.status !== 'paid' && (
                <Button
                  onClick={() => markPaidMutation.mutate(paymentId)}
                  disabled={markPaidMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark as Paid
                </Button>
              )}
              <Button variant="outline" asChild>
                <Link href={`/payments/${paymentId}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="font-medium">
                  {payment.amount.toLocaleString()} {payment.currency}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                {getStatusBadge()}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-medium capitalize">
                  {payment.payment_method ?? '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className="font-medium">
                  {format(new Date(payment.due_date), 'MMMM d, yyyy')}
                </p>
              </div>
              {payment.paid_date && (
                <div>
                  <p className="text-sm text-muted-foreground">Paid Date</p>
                  <p className="font-medium">
                    {format(new Date(payment.paid_date), 'MMMM d, yyyy')}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Period & Invoice */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Period & Invoice
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {payment.invoice_number && (
              <div>
                <p className="text-sm text-muted-foreground">Invoice Number</p>
                <p className="font-medium">{payment.invoice_number}</p>
              </div>
            )}
            {(payment.period_start || payment.period_end) && (
              <div>
                <p className="text-sm text-muted-foreground">Period</p>
                <p className="font-medium">
                  {payment.period_start
                    ? format(new Date(payment.period_start), 'MMM d, yyyy')
                    : '-'}{' '}
                  to{' '}
                  {payment.period_end
                    ? format(new Date(payment.period_end), 'MMM d, yyyy')
                    : '-'}
                </p>
              </div>
            )}
            {payment.notes && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="whitespace-pre-wrap">{payment.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

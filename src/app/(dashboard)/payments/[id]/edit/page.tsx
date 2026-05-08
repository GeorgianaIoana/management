'use client';

import { useParams, useRouter } from 'next/navigation';
import { usePayment, useUpdatePayment } from '@/hooks/use-payments';
import { PaymentForm } from '@/components/payments';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { PaymentFormValues } from '@/lib/validations/payment';

export default function EditPaymentPage() {
  const params = useParams();
  const router = useRouter();
  const paymentId = params.id as string;

  const { data: payment, isLoading } = usePayment(paymentId);
  const updateMutation = useUpdatePayment();

  const handleSubmit = async (data: PaymentFormValues) => {
    const paymentData = {
      ...data,
      class_id: data.class_id || null,
      payment_method: data.payment_method || null,
      period_start: data.period_start || null,
      period_end: data.period_end || null,
      paid_date: data.paid_date || null,
      invoice_number: data.invoice_number || null,
      notes: data.notes || null,
    };

    await updateMutation.mutateAsync({ id: paymentId, data: paymentData });
    router.push(`/payments/${paymentId}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32 mt-2" />
          </div>
        </div>
        <Card>
          <CardContent className="py-8">
            <Skeleton className="h-64 w-full" />
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/payments/${paymentId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Payment</h1>
          <p className="text-muted-foreground">
            {payment.amount} {payment.currency} - {payment.member?.first_name} {payment.member?.last_name}
          </p>
        </div>
      </div>
      <PaymentForm
        payment={payment}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
      />
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { useCreatePayment } from '@/hooks/use-payments';
import { PaymentForm } from '@/components/payments';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { PaymentFormValues } from '@/lib/validations/payment';

export default function NewPaymentPage() {
  const router = useRouter();
  const createMutation = useCreatePayment();

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

    await createMutation.mutateAsync(paymentData);
    router.push('/payments');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/payments">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">New Payment</h1>
          <p className="text-muted-foreground">
            Record a new payment
          </p>
        </div>
      </div>
      <PaymentForm
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
      />
    </div>
  );
}

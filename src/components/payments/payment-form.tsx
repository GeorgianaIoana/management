'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { paymentSchema, type PaymentFormValues, paymentMethods } from '@/lib/validations/payment';
import { useMembers } from '@/hooks/use-members';
import { useAllClasses } from '@/hooks/use-classes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { getClassName } from '@/lib/utils';
import type { Payment } from '@/types';

interface PaymentFormProps {
  payment?: Payment;
  onSubmit: (data: PaymentFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

export function PaymentForm({ payment, onSubmit, isSubmitting }: PaymentFormProps) {
  const { data: membersData } = useMembers({ status: 'active' }, { page: 1, pageSize: 100 });
  const { data: classes } = useAllClasses();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      member_id: payment?.member_id ?? '',
      class_id: payment?.class_id ?? null,
      amount: payment?.amount ?? 0,
      currency: payment?.currency ?? 'RON',
      payment_method: payment?.payment_method ?? null,
      period_start: payment?.period_start ?? '',
      period_end: payment?.period_end ?? '',
      status: payment?.status ?? 'pending',
      due_date: payment?.due_date ?? new Date().toISOString().split('T')[0],
      paid_date: payment?.paid_date ?? null,
      invoice_number: payment?.invoice_number ?? '',
      notes: payment?.notes ?? '',
    },
  });

  const status = watch('status');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="member_id">Member *</Label>
            <Select
              value={watch('member_id')}
              onValueChange={(value) => {
                if (value) setValue('member_id', value)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select member" />
              </SelectTrigger>
              <SelectContent>
                {membersData?.data.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.first_name} {member.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.member_id && (
              <p className="text-sm text-destructive">{errors.member_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="class_id">Class (Optional)</Label>
            <Select
              value={watch('class_id') ?? ''}
              onValueChange={(value) => setValue('class_id', value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {classes?.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {getClassName(cls.day_of_week, cls.target_age_group)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount *</Label>
            <Input
              id="amount"
              type="number"
              {...register('amount')}
              placeholder="200"
              min={0}
              step={1}
            />
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={watch('currency')}
              onValueChange={(value) => {
                if (value) setValue('currency', value)
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RON">RON</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="due_date">Due Date *</Label>
            <Input
              id="due_date"
              type="date"
              {...register('due_date')}
            />
            {errors.due_date && (
              <p className="text-sm text-destructive">{errors.due_date.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={(value) => {
                if (value) setValue('status', value as PaymentFormValues['status'])
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_method">Payment Method</Label>
            <Select
              value={watch('payment_method') ?? ''}
              onValueChange={(value) =>
                setValue('payment_method', value as PaymentFormValues['payment_method'])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {status === 'paid' && (
            <div className="space-y-2">
              <Label htmlFor="paid_date">Paid Date</Label>
              <Input
                id="paid_date"
                type="date"
                {...register('paid_date')}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Period & Invoice</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="period_start">Period Start</Label>
            <Input
              id="period_start"
              type="date"
              {...register('period_start')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="period_end">Period End</Label>
            <Input
              id="period_end"
              type="date"
              {...register('period_end')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="invoice_number">Invoice Number</Label>
            <Input
              id="invoice_number"
              {...register('invoice_number')}
              placeholder="INV-001"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {payment ? 'Update Payment' : 'Create Payment'}
        </Button>
      </div>
    </form>
  );
}

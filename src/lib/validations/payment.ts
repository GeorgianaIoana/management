import { z } from 'zod';

export const paymentSchema = z.object({
  member_id: z.string().uuid('Please select a member'),
  class_id: z.string().uuid().nullable().optional(),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  currency: z.string(),
  payment_method: z.enum(['cash', 'card', 'transfer', 'other']).nullable().optional(),
  period_start: z.string().nullable().optional(),
  period_end: z.string().nullable().optional(),
  status: z.enum(['pending', 'paid', 'overdue', 'cancelled']),
  due_date: z.string().min(1, 'Due date is required'),
  paid_date: z.string().nullable().optional(),
  invoice_number: z.string().max(50).nullable().optional(),
  notes: z.string().nullable().optional(),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;

export const paymentMethods = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card' },
  { value: 'transfer', label: 'Bank Transfer' },
  { value: 'other', label: 'Other' },
];

export const paymentStatuses = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'paid', label: 'Paid', color: 'bg-green-100 text-green-800' },
  { value: 'overdue', label: 'Overdue', color: 'bg-red-100 text-red-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-gray-100 text-gray-800' },
];

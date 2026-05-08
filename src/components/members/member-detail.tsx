'use client';

import { useMember, useMemberPayments, useMemberEnrollments } from '@/hooks/use-members';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Mail,
  Phone,
  Calendar,
  Users,
  Baby,
  Crown,
  Pencil,
  CreditCard,
  BookOpen,
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import type { Payment, Enrollment } from '@/types';

interface MemberDetailProps {
  memberId: string;
}

export function MemberDetail({ memberId }: MemberDetailProps) {
  const { data: member, isLoading } = useMember(memberId);
  const { data: payments } = useMemberPayments(memberId);
  const { data: enrollments } = useMemberEnrollments(memberId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!member) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Member not found
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      active: 'default',
      inactive: 'secondary',
      suspended: 'destructive',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      paid: 'default',
      pending: 'outline',
      overdue: 'destructive',
      cancelled: 'secondary',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={member.avatar_url ?? undefined} />
                <AvatarFallback className="text-2xl">
                  {member.first_name[0]}{member.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold">
                    {member.first_name} {member.last_name}
                  </h2>
                  {getStatusBadge(member.status)}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {member.member_type === 'child' ? (
                    <span className="flex items-center gap-1">
                      <Baby className="h-4 w-4" /> Child
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" /> Adult
                    </span>
                  )}
                  {member.chess_rating && (
                    <span className="flex items-center gap-1">
                      <Crown className="h-4 w-4" /> ELO: {member.chess_rating}
                    </span>
                  )}
                  {member.skill_level && (
                    <Badge variant="outline" className="capitalize">
                      {member.skill_level}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button asChild>
              <Link href={`/members/${memberId}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {member.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${member.email}`} className="text-primary hover:underline">
                  {member.email}
                </a>
              </div>
            )}
            {member.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${member.phone}`} className="hover:underline">
                  {member.phone}
                </a>
              </div>
            )}
            {member.date_of_birth && (
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{format(new Date(member.date_of_birth), 'MMMM d, yyyy')}</span>
              </div>
            )}
            <Separator />
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                Member since {format(new Date(member.join_date), 'MMMM d, yyyy')}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Guardian Information (for children) */}
        {member.member_type === 'child' && (
          <Card>
            <CardHeader>
              <CardTitle>Guardian Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {member.guardian_name && (
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{member.guardian_name}</p>
                </div>
              )}
              {member.guardian_phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${member.guardian_phone}`} className="hover:underline">
                    {member.guardian_phone}
                  </a>
                </div>
              )}
              {member.guardian_email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${member.guardian_email}`} className="text-primary hover:underline">
                    {member.guardian_email}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        {member.notes && (
          <Card className={member.member_type === 'adult' ? '' : 'lg:col-span-2'}>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{member.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Class Enrollments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Class Enrollments
          </CardTitle>
          <CardDescription>Active class enrollments for this member</CardDescription>
        </CardHeader>
        <CardContent>
          {enrollments && enrollments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Enrolled</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollments.map((enrollment: Enrollment) => (
                  <TableRow key={enrollment.id}>
                    <TableCell className="font-medium">
                      {enrollment.class?.name}
                    </TableCell>
                    <TableCell>
                      {enrollment.class?.teacher
                        ? `${enrollment.class.teacher.first_name} ${enrollment.class.teacher.last_name}`
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {enrollment.class && (
                        <>
                          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][enrollment.class.day_of_week]}{' '}
                          {enrollment.class.start_time.slice(0, 5)} - {enrollment.class.end_time.slice(0, 5)}
                        </>
                      )}
                    </TableCell>
                    <TableCell>
                      {format(new Date(enrollment.enrolled_date), 'MMM d, yyyy')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4 text-muted-foreground">
              No active class enrollments
            </p>
          )}
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment History
          </CardTitle>
          <CardDescription>Recent payments for this member</CardDescription>
        </CardHeader>
        <CardContent>
          {payments && payments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.slice(0, 10).map((payment: Payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      {format(new Date(payment.due_date), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>{payment.class?.name ?? '-'}</TableCell>
                    <TableCell className="font-medium">
                      {payment.amount.toLocaleString()} {payment.currency}
                    </TableCell>
                    <TableCell>{getPaymentStatusBadge(payment.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4 text-muted-foreground">
              No payment history
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

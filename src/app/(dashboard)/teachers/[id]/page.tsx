'use client';

import { useParams } from 'next/navigation';
import { useTeacher, useTeacherClasses } from '@/hooks/use-teachers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  Crown,
  Pencil,
  Calendar,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { getClassName } from '@/lib/utils';
import { dayNames } from '@/lib/validations/class';
import type { Class } from '@/types';

export default function TeacherDetailPage() {
  const params = useParams();
  const teacherId = params.id as string;

  const { data: teacher, isLoading } = useTeacher(teacherId);
  const { data: classes } = useTeacherClasses(teacherId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/teachers">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Teacher Not Found</h1>
        </div>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            The teacher you are looking for does not exist.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/teachers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Teacher Details</h1>
      </div>

      {/* Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={teacher.avatar_url ?? undefined} />
                <AvatarFallback className="text-2xl">
                  {teacher.first_name[0]}{teacher.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold">
                    {teacher.first_name} {teacher.last_name}
                  </h2>
                  <Badge variant={teacher.is_active ? 'default' : 'secondary'}>
                    {teacher.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {teacher.chess_title && (
                    <span className="flex items-center gap-1">
                      <Crown className="h-4 w-4" /> {teacher.chess_title}
                    </span>
                  )}
                  {teacher.chess_rating && (
                    <span>ELO: {teacher.chess_rating}</span>
                  )}
                  {teacher.hourly_rate && (
                    <span className="font-medium text-foreground">
                      {teacher.hourly_rate} RON/hr
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Button asChild>
              <Link href={`/teachers/${teacherId}/edit`}>
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
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href={`mailto:${teacher.email}`} className="text-primary hover:underline">
                {teacher.email}
              </a>
            </div>
            {teacher.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${teacher.phone}`} className="hover:underline">
                  {teacher.phone}
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Specializations */}
        <Card>
          <CardHeader>
            <CardTitle>Specializations</CardTitle>
          </CardHeader>
          <CardContent>
            {teacher.specializations && teacher.specializations.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {teacher.specializations.map((spec) => (
                  <Badge key={spec} variant="secondary">
                    {spec}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No specializations listed</p>
            )}
          </CardContent>
        </Card>

        {/* Biography */}
        {teacher.bio && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Biography</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{teacher.bio}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Assigned Classes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Assigned Classes
          </CardTitle>
          <CardDescription>Classes currently taught by this instructor</CardDescription>
        </CardHeader>
        <CardContent>
          {classes && classes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class Name</TableHead>
                  <TableHead>Day</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Age Group</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.map((cls: Class) => (
                  <TableRow key={cls.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/classes/${cls.id}`}
                        className="text-primary hover:underline"
                      >
                        {getClassName(cls.day_of_week, cls.target_age_group)}
                      </Link>
                    </TableCell>
                    <TableCell>{dayNames[cls.day_of_week]}</TableCell>
                    <TableCell>
                      {cls.start_time.slice(0, 5)} - {cls.end_time.slice(0, 5)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {cls.target_age_group === 'kids' ? 'Copii' : cls.target_age_group === 'adults' ? 'Adulti' : 'Toti'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {cls.price_per_month
                        ? `${cls.price_per_month} RON/mo`
                        : cls.price_per_session
                          ? `${cls.price_per_session} RON/session`
                          : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4 text-muted-foreground">
              No classes assigned
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

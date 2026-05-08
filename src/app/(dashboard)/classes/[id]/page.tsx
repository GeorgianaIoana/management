'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import {
  useClass,
  useClassEnrollments,
  useEnrollMember,
  useUnenrollMember,
} from '@/hooks/use-classes';
import { useMembers } from '@/hooks/use-members';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Clock,
  Users,
  MapPin,
  GraduationCap,
  Pencil,
  ArrowLeft,
  Plus,
  UserMinus,
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { dayNames, ageGroupLabels } from '@/lib/validations/class';
import { getClassName } from '@/lib/utils';
import type { Enrollment } from '@/types';

export default function ClassDetailPage() {
  const params = useParams();
  const classId = params.id as string;
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');

  const { data: classData, isLoading } = useClass(classId);
  const { data: enrollments } = useClassEnrollments(classId);
  const { data: membersData } = useMembers({ status: 'active' }, { page: 1, pageSize: 100 });
  const enrollMutation = useEnrollMember();
  const unenrollMutation = useUnenrollMember();

  const enrolledMemberIds = enrollments?.map((e: Enrollment) => e.member_id) ?? [];
  const availableMembers = membersData?.data.filter(
    (m) => !enrolledMemberIds.includes(m.id)
  ) ?? [];

  const handleEnroll = async () => {
    if (selectedMemberId) {
      await enrollMutation.mutateAsync({ classId, memberId: selectedMemberId });
      setEnrollDialogOpen(false);
      setSelectedMemberId('');
    }
  };

  const handleUnenroll = async (enrollmentId: string) => {
    await unenrollMutation.mutateAsync({ enrollmentId, classId });
  };

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

  if (!classData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/classes">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Class Not Found</h1>
        </div>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            The class you are looking for does not exist.
          </CardContent>
        </Card>
      </div>
    );
  }

  const getAgeGroupBadge = (group: string) => {
    const colors: Record<string, string> = {
      kids: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
      adults: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
      all: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    };
    return (
      <Badge variant="outline" className={colors[group]}>
        {ageGroupLabels[group] || group}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/classes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Class Details</h1>
      </div>

      {/* Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold">{getClassName(classData.day_of_week, classData.target_age_group)}</h2>
                <Badge variant={classData.is_active ? 'default' : 'secondary'}>
                  {classData.is_active ? 'Active' : 'Inactive'}
                </Badge>
                {getAgeGroupBadge(classData.target_age_group)}
              </div>
              {classData.description && (
                <p className="text-muted-foreground max-w-2xl">
                  {classData.description}
                </p>
              )}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {dayNames[classData.day_of_week]} {classData.start_time.slice(0, 5)} - {classData.end_time.slice(0, 5)}
                  </span>
                </div>
                {classData.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{classData.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {enrollments?.length ?? 0} / {classData.max_students} students
                  </span>
                </div>
                {classData.teacher && (
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <Link
                      href={`/teachers/${classData.teacher.id}`}
                      className="text-primary hover:underline"
                    >
                      {classData.teacher.first_name} {classData.teacher.last_name}
                    </Link>
                  </div>
                )}
              </div>
              {(classData.price_per_month || classData.price_per_session) && (
                <div className="flex gap-4 text-sm">
                  {classData.price_per_month && (
                    <span className="font-medium">
                      {classData.price_per_month} RON/month
                    </span>
                  )}
                  {classData.price_per_session && (
                    <span className="font-medium">
                      {classData.price_per_session} RON/session
                    </span>
                  )}
                </div>
              )}
            </div>
            <Button asChild>
              <Link href={`/classes/${classId}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enrollments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Enrolled Students
            </CardTitle>
            <CardDescription>
              {enrollments?.length ?? 0} of {classData.max_students} spots filled
            </CardDescription>
          </div>
          <Dialog open={enrollDialogOpen} onOpenChange={setEnrollDialogOpen}>
            <DialogTrigger asChild>
              <Button
                disabled={(enrollments?.length ?? 0) >= classData.max_students}
              >
                <Plus className="mr-2 h-4 w-4" />
                Enroll Student
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enroll Student</DialogTitle>
                <DialogDescription>
                  Select a member to enroll in this class.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Select
                  value={selectedMemberId}
                  onValueChange={(value) => setSelectedMemberId(value ?? '')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select member" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.first_name} {member.last_name}
                        {member.member_type === 'child' && ' (Child)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setEnrollDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEnroll}
                  disabled={!selectedMemberId || enrollMutation.isPending}
                >
                  Enroll
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {enrollments && enrollments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Enrolled</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollments.map((enrollment: Enrollment) => (
                  <TableRow key={enrollment.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={enrollment.member?.avatar_url ?? undefined} />
                          <AvatarFallback>
                            {enrollment.member?.first_name[0]}
                            {enrollment.member?.last_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <Link
                          href={`/members/${enrollment.member_id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {enrollment.member?.first_name} {enrollment.member?.last_name}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {enrollment.member?.member_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(enrollment.enrolled_date), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleUnenroll(enrollment.id)}
                        disabled={unenrollMutation.isPending}
                      >
                        <UserMinus className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-8 text-muted-foreground">
              No students enrolled yet
            </p>
          )}
        </CardContent>
      </Card>

    </div>
  );
}

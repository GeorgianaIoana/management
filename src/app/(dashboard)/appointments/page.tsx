'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import {
  useAllClasses,
  useClassEnrollments,
  useCreateClassSession,
  useSessionAttendance,
  useBulkRecordAttendance,
  useRecentSessions,
} from '@/hooks/use-classes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  ClipboardCheck,
  Plus,
  Loader2,
  Save,
  CheckCircle2,
  Users,
  ArrowLeft,
  CalendarIcon,
} from 'lucide-react';
import type { ClassSession, Enrollment } from '@/types';
import { getClassName } from '@/lib/utils';

export default function AppointmentsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentSession, setCurrentSession] = useState<ClassSession | null>(null);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [attendanceSaved, setAttendanceSaved] = useState(false);

  const { data: classes, isLoading: classesLoading } = useAllClasses();
  const { data: enrollments, isLoading: enrollmentsLoading } = useClassEnrollments(
    selectedClassId || undefined
  );
  useSessionAttendance(currentSession?.id);
  const { data: recentSessions, isLoading: sessionsLoading } = useRecentSessions(20);

  const createSession = useCreateClassSession();
  const bulkRecordAttendance = useBulkRecordAttendance();

  const selectedClass = classes?.find((c) => c.id === selectedClassId);

  // Auto-select class based on selected date's day of week (only when no active session)
  useEffect(() => {
    if (!classes || classes.length === 0 || currentSession) return;

    const dayOfWeek = selectedDate.getDay();
    const matchingClass = classes.find((c) => c.day_of_week === dayOfWeek);

    if (matchingClass) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- auto-select class based on date
      setSelectedClassId((prev) => prev !== matchingClass.id ? matchingClass.id : prev);
    }
  }, [selectedDate, classes, currentSession]);

  const handleSelectClass = (classId: string | null) => {
    setSelectedClassId(classId ?? '');
    setAttendance({});
    setCurrentSession(null);
  };

  const handleStartSession = async () => {
    if (!selectedClassId || !selectedDate) return;

    const sessionDate = format(selectedDate, 'yyyy-MM-dd');

    const session = await createSession.mutateAsync({
      class_id: selectedClassId,
      session_date: sessionDate,
      status: 'scheduled',
      teacher_id: selectedClass?.teacher_id ?? null,
      notes: null,
    });

    setCurrentSession(session);
    setDialogOpen(false);
  };

  const handleToggleAttendance = (memberId: string) => {
    setAttendance((prev) => ({
      ...prev,
      [memberId]: !prev[memberId],
    }));
  };

  const handleMarkAllPresent = () => {
    if (!enrollments) return;
    const allPresent: Record<string, boolean> = {};
    enrollments.forEach((e: Enrollment) => {
      allPresent[e.member_id] = true;
    });
    setAttendance(allPresent);
  };

  const handleSaveAttendance = async () => {
    if (!currentSession || !enrollments) return;

    const records = enrollments.map((e: Enrollment) => ({
      member_id: e.member_id,
      attended: attendance[e.member_id] ?? false,
    }));

    try {
      await bulkRecordAttendance.mutateAsync({
        sessionId: currentSession.id,
        records,
      });
      setAttendanceSaved(true);
    } catch {
      // Error handled by mutation hook
    }
  };

  const handleReset = () => {
    setSelectedClassId('');
    setSelectedDate(new Date());
    setCurrentSession(null);
    setAttendance({});
    setAttendanceSaved(false);
  };

  const presentCount = Object.values(attendance).filter(Boolean).length;
  const totalCount = enrollments?.length ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Prezențe</h1>
          <p className="text-muted-foreground">
            {format(new Date(), 'EEEE, d MMMM yyyy', { locale: ro })}
          </p>
        </div>

        {!currentSession && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Prezență nouă
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Creează prezență nouă</DialogTitle>
                <DialogDescription>
                  Selectează data și grupa pentru care vrei să marchezi prezența.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <Label>Data</Label>
                  <DatePicker
                    date={selectedDate}
                    onDateChange={(date) => setSelectedDate(date ?? new Date())}
                    placeholder="Selectează data"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Grupa</Label>
                  {classesLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Select value={selectedClassId} onValueChange={handleSelectClass}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectează grupa">
                          {selectedClass
                            ? getClassName(selectedClass.day_of_week, selectedClass.target_age_group)
                            : 'Selectează grupa'}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {classes?.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id}>
                            {getClassName(cls.day_of_week, cls.target_age_group)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {selectedClassId && (
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4" />
                      <span>
                        {enrollmentsLoading ? (
                          'Se încarcă...'
                        ) : (
                          `${enrollments?.length ?? 0} elevi înrolați`
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Anulează
                </Button>
                <Button
                  onClick={handleStartSession}
                  disabled={!selectedClassId || !selectedDate || createSession.isPending || enrollmentsLoading}
                >
                  {createSession.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Se creează...
                    </>
                  ) : (
                    'Începe prezența'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {currentSession ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5" />
                {selectedClass && getClassName(selectedClass.day_of_week, selectedClass.target_age_group)}
              </CardTitle>
              <CardDescription className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <CalendarIcon className="h-3.5 w-3.5" />
                  {format(selectedDate, 'd MMMM yyyy', { locale: ro })}
                </span>
                <span>{presentCount} din {totalCount} prezenți</span>
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Înapoi
            </Button>
          </CardHeader>
          <CardContent>
            {attendanceSaved ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <p className="text-lg font-medium mb-2">Prezența a fost salvată!</p>
                <p className="text-sm text-muted-foreground mb-6">
                  {presentCount} din {totalCount} elevi prezenți
                </p>
                <Button onClick={handleReset}>
                  <Plus className="mr-2 h-4 w-4" />
                  Prezență nouă
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" onClick={handleMarkAllPresent}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Marchează toți prezenți
                  </Button>
                </div>

                <div className="space-y-2">
                  {enrollments?.map((enrollment: Enrollment) => (
                    <label
                      key={enrollment.id}
                      className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={enrollment.member?.avatar_url ?? undefined} />
                        <AvatarFallback>
                          {enrollment.member?.first_name[0]}
                          {enrollment.member?.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="flex-1 font-medium">
                        {enrollment.member?.first_name} {enrollment.member?.last_name}
                      </span>
                      <Checkbox
                        checked={attendance[enrollment.member_id] ?? false}
                        onCheckedChange={() => handleToggleAttendance(enrollment.member_id)}
                      />
                    </label>
                  ))}
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button
                    onClick={handleSaveAttendance}
                    disabled={bulkRecordAttendance.isPending}
                  >
                    {bulkRecordAttendance.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Se salvează...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Salvează prezența
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <ClipboardCheck className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Nicio prezență activă</p>
              <p className="text-sm">
                Apasă &quot;Prezență nouă&quot; pentru a începe marcarea prezenței la o grupă.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Istoric Prezențe */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Istoric Prezențe
          </CardTitle>
          <CardDescription>
            Ultimele sesiuni de prezență înregistrate
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sessionsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : recentSessions && recentSessions.length > 0 ? (
            <div className="space-y-3">
              {recentSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-4 rounded-lg border bg-card"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold">
                        {session.class
                          ? getClassName(session.class.day_of_week, session.class.target_age_group)
                          : 'Clasă ștearsă'}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <CalendarIcon className="h-3.5 w-3.5" />
                        {format(new Date(session.session_date), 'EEEE, d MMMM yyyy', { locale: ro })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">
                        {session.attendanceDetails.present.length}/{session.attendanceDetails.present.length + session.attendanceDetails.absent.length}
                      </p>
                      <p className="text-xs text-muted-foreground">prezenți</p>
                    </div>
                  </div>

                  {session.attendanceDetails.present.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">
                        ✓ Prezenți ({session.attendanceDetails.present.length})
                      </p>
                      <p className="text-sm">
                        {session.attendanceDetails.present.map(m => m.name).join(', ')}
                      </p>
                    </div>
                  )}

                  {session.attendanceDetails.absent.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-1">
                        ✗ Absenți ({session.attendanceDetails.absent.length})
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {session.attendanceDetails.absent.map(m => m.name).join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">
              Nu există încă sesiuni de prezență înregistrate.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

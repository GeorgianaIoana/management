'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
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
} from '@/components/ui/dialog';
import { Calendar, Plus, Save, Check, X } from 'lucide-react';
import { cn, getClassName, formatTime } from '@/lib/utils';
import { toast } from 'sonner';
import type { Class, ClassSession, Member, Enrollment } from '@/types';

interface SessionWithDetails extends Omit<ClassSession, 'class' | 'attendance'> {
  class: Class | null;
  attendance: Array<{
    id: string;
    member_id: string;
    attended: boolean;
    member: Member | null;
  }>;
}

export default function TeacherAttendancePage() {
  const { teacherId } = useAuthStore();
  const [classes, setClasses] = useState<Class[]>([]);
  const [sessions, setSessions] = useState<SessionWithDetails[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [showNewSessionDialog, setShowNewSessionDialog] = useState(false);
  const [newSessionClassId, setNewSessionClassId] = useState<string>('');
  const [newSessionDate, setNewSessionDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [savingSession, setSavingSession] = useState(false);
  const [editingSession, setEditingSession] = useState<string | null>(null);
  const [attendanceChanges, setAttendanceChanges] = useState<Record<string, boolean>>({});
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [enrolledMembers, setEnrolledMembers] = useState<Map<string, Enrollment[]>>(new Map());

  const supabase = useMemo(() => createClient(), []);

  const fetchSessions = useCallback(async () => {
    if (!teacherId) return;

    const { data: sessionsData } = await supabase
      .from('class_sessions')
      .select(`
        *,
        class:classes(*),
        attendance(*, member:members(*))
      `)
      .order('session_date', { ascending: false })
      .limit(50);

    // Filter sessions for teacher's classes on client side
    // (RLS should handle this, but extra safety)
    const filteredSessions = (sessionsData || []).filter(
      (s) => s.class?.teacher_id === teacherId
    );

    setSessions(filteredSessions as SessionWithDetails[]);
  }, [teacherId, supabase]);

  useEffect(() => {
    async function fetchData() {
      if (!teacherId) return;

      setLoading(true);

      // Fetch teacher's classes
      const { data: classesData } = await supabase
        .from('classes')
        .select('*')
        .eq('teacher_id', teacherId)
        .eq('is_active', true)
        .order('day_of_week');

      if (classesData) {
        setClasses(classesData);

        // Fetch enrolled members for each class
        const membersMap = new Map<string, Enrollment[]>();
        for (const cls of classesData) {
          const { data: enrollments } = await supabase
            .from('enrollments')
            .select('*, member:members(*)')
            .eq('class_id', cls.id)
            .eq('is_active', true);

          if (enrollments) {
            membersMap.set(cls.id, enrollments);
          }
        }
        setEnrolledMembers(membersMap);
      }

      // Fetch sessions
      await fetchSessions();

      setLoading(false);
    }

    fetchData();
  }, [teacherId, supabase, fetchSessions]);

  const filteredSessions = selectedClassId === 'all'
    ? sessions
    : sessions.filter((s) => s.class_id === selectedClassId);

  async function handleCreateSession() {
    if (!newSessionClassId || !newSessionDate) {
      toast.error('Selectează clasa și data');
      return;
    }

    setSavingSession(true);

    try {
      // Create session
      const { data: newSession, error } = await supabase
        .from('class_sessions')
        .insert({
          class_id: newSessionClassId,
          session_date: newSessionDate,
          teacher_id: teacherId,
          status: 'scheduled',
        })
        .select()
        .single();

      if (error) throw error;

      // Create attendance records for all enrolled members
      const classEnrollments = enrolledMembers.get(newSessionClassId) || [];
      if (classEnrollments.length > 0) {
        const attendanceRecords = classEnrollments.map((e) => ({
          session_id: newSession.id,
          member_id: e.member_id,
          attended: false,
        }));

        await supabase.from('attendance').insert(attendanceRecords);
      }

      toast.success('Sesiune creată cu succes');
      setShowNewSessionDialog(false);
      setNewSessionClassId('');
      setNewSessionDate(new Date().toISOString().split('T')[0]);

      // Refresh sessions
      await fetchSessions();
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error('Eroare la crearea sesiunii');
    } finally {
      setSavingSession(false);
    }
  }

  function startEditingSession(sessionId: string, attendance: Array<{ member_id: string; attended: boolean }>) {
    setEditingSession(sessionId);
    const changes: Record<string, boolean> = {};
    attendance.forEach((a) => {
      changes[a.member_id] = a.attended;
    });
    setAttendanceChanges(changes);
  }

  function toggleAttendance(memberId: string) {
    setAttendanceChanges((prev) => ({
      ...prev,
      [memberId]: !prev[memberId],
    }));
  }

  async function saveAttendance(sessionId: string) {
    setSavingAttendance(true);

    try {
      const updates = Object.entries(attendanceChanges).map(([memberId, attended]) => ({
        session_id: sessionId,
        member_id: memberId,
        attended,
      }));

      const { error } = await supabase
        .from('attendance')
        .upsert(updates, {
          onConflict: 'session_id,member_id',
        });

      if (error) throw error;

      // Update session status to completed if there are any present
      const hasPresent = Object.values(attendanceChanges).some((v) => v);
      if (hasPresent) {
        await supabase
          .from('class_sessions')
          .update({ status: 'completed' })
          .eq('id', sessionId);
      }

      toast.success('Prezențe salvate cu succes');
      setEditingSession(null);
      setAttendanceChanges({});

      // Refresh sessions
      await fetchSessions();
    } catch (error) {
      console.error('Error saving attendance:', error);
      toast.error('Eroare la salvarea prezențelor');
    } finally {
      setSavingAttendance(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-64" />
        <div className="space-y-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Prezențe</h1>
          <p className="text-muted-foreground">
            Gestionează prezențele la clasele tale
          </p>
        </div>
        <Button onClick={() => setShowNewSessionDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Sesiune Nouă
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={selectedClassId} onValueChange={(v) => setSelectedClassId(v ?? 'all')}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Filtrează după clasă" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toate clasele</SelectItem>
            {classes.map((cls) => (
              <SelectItem key={cls.id} value={cls.id}>
                {getClassName(cls.day_of_week, cls.target_age_group)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sessions List */}
      {filteredSessions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nu ai sesiuni înregistrate.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setShowNewSessionDialog(true)}
            >
              Creează prima sesiune
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredSessions.map((session) => (
            <Card key={session.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">
                      {session.class
                        ? getClassName(session.class.day_of_week, session.class.target_age_group)
                        : 'Clasă'}
                    </CardTitle>
                    <CardDescription>
                      {new Date(session.session_date).toLocaleDateString('ro-RO', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                      {session.class && ` • ${formatTime(session.class.start_time)} - ${formatTime(session.class.end_time)}`}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                        session.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : session.status === 'cancelled'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      )}
                    >
                      {session.status === 'completed'
                        ? 'Finalizată'
                        : session.status === 'cancelled'
                        ? 'Anulată'
                        : 'Programată'}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {editingSession === session.id ? (
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      {session.attendance.map((a) => (
                        <label
                          key={a.member_id}
                          className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50"
                        >
                          <Checkbox
                            checked={attendanceChanges[a.member_id] ?? a.attended}
                            onCheckedChange={() => toggleAttendance(a.member_id)}
                          />
                          <span className="flex-1">
                            {a.member
                              ? `${a.member.first_name} ${a.member.last_name}`
                              : 'Membru necunoscut'}
                          </span>
                        </label>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => saveAttendance(session.id)}
                        disabled={savingAttendance}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Salvează
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingSession(null);
                          setAttendanceChanges({});
                        }}
                      >
                        Anulează
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {session.attendance.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Nu sunt elevi înregistrați pentru această sesiune.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {session.attendance.map((a) => (
                          <div
                            key={a.member_id}
                            className={cn(
                              'flex items-center gap-1.5 rounded-full px-3 py-1 text-sm',
                              a.attended
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-500'
                            )}
                          >
                            {a.attended ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <X className="h-3 w-3" />
                            )}
                            {a.member
                              ? `${a.member.first_name} ${a.member.last_name}`
                              : 'Membru'}
                          </div>
                        ))}
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        startEditingSession(session.id, session.attendance)
                      }
                    >
                      Editează prezențe
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* New Session Dialog */}
      <Dialog open={showNewSessionDialog} onOpenChange={setShowNewSessionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sesiune Nouă</DialogTitle>
            <DialogDescription>
              Creează o nouă sesiune pentru una din clasele tale
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Clasă</label>
              <Select value={newSessionClassId} onValueChange={(v) => setNewSessionClassId(v ?? '')}>
                <SelectTrigger>
                  <SelectValue placeholder="Selectează clasa" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {getClassName(cls.day_of_week, cls.target_age_group)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Data</label>
              <input
                type="date"
                value={newSessionDate}
                onChange={(e) => setNewSessionDate(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNewSessionDialog(false)}
            >
              Anulează
            </Button>
            <Button onClick={handleCreateSession} disabled={savingSession}>
              {savingSession ? 'Se creează...' : 'Creează Sesiune'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

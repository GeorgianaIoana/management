'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { User, Save, Lock, X } from 'lucide-react';
import { toast } from 'sonner';
import { validatePassword } from '@/lib/validations/password';
import type { Teacher, ChessTitle } from '@/types';

const chessTitles: ChessTitle[] = ['GM', 'IM', 'FM', 'CM', 'NM', 'WGM', 'WIM', 'WFM', 'WCM', null];
const teachingLevels = ['beginner', 'intermediary', 'advanced'];

const teachingLevelLabels: Record<string, string> = {
  beginner: 'Începător',
  intermediary: 'Intermediar',
  advanced: 'Avansat',
};

export default function TeacherProfilePage() {
  const { teacherId } = useAuthStore();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [bio, setBio] = useState('');
  const [chessTitle, setChessTitle] = useState<ChessTitle>(null);
  const [chessRating, setChessRating] = useState<string>('');
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [newSpecialization, setNewSpecialization] = useState('');
  const [selectedTeachingLevels, setSelectedTeachingLevels] = useState<string[]>([]);

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function fetchTeacher() {
      if (!teacherId) return;

      setLoading(true);

      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('id', teacherId)
        .single();

      if (error) {
        console.error('Error fetching teacher:', error);
        toast.error('Eroare la încărcarea profilului');
      } else if (data) {
        setTeacher(data);
        setBio(data.bio || '');
        setChessTitle(data.chess_title);
        setChessRating(data.chess_rating?.toString() || '');
        setSpecializations(data.specializations || []);
        setSelectedTeachingLevels(data.teaching_levels || []);
      }

      setLoading(false);
    }

    fetchTeacher();
  }, [teacherId, supabase]);

  async function handleSaveProfile() {
    if (!teacherId) return;

    setSaving(true);

    try {
      const { error } = await supabase
        .from('teachers')
        .update({
          bio,
          chess_title: chessTitle,
          chess_rating: chessRating ? parseInt(chessRating) : null,
          specializations,
          teaching_levels: selectedTeachingLevels,
        })
        .eq('id', teacherId);

      if (error) throw error;

      toast.success('Profil actualizat cu succes');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Eroare la actualizarea profilului');
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword() {
    if (newPassword !== confirmPassword) {
      toast.error('Parolele nu coincid');
      return;
    }

    // Security: Strong password validation
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      toast.error('Parola nu îndeplinește cerințele de securitate', {
        description: `Lipsește: ${passwordValidation.errors.join(', ')}`,
      });
      return;
    }

    setChangingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast.success('Parola a fost schimbată cu succes');
      setShowPasswordForm(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Eroare la schimbarea parolei');
    } finally {
      setChangingPassword(false);
    }
  }

  function addSpecialization() {
    if (newSpecialization.trim() && !specializations.includes(newSpecialization.trim())) {
      setSpecializations([...specializations, newSpecialization.trim()]);
      setNewSpecialization('');
    }
  }

  function removeSpecialization(spec: string) {
    setSpecializations(specializations.filter((s) => s !== spec));
  }

  function toggleTeachingLevel(level: string) {
    if (selectedTeachingLevels.includes(level)) {
      setSelectedTeachingLevels(selectedTeachingLevels.filter((l) => l !== level));
    } else {
      setSelectedTeachingLevels([...selectedTeachingLevels, level]);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profilul Meu</h1>
        <p className="text-muted-foreground">
          Actualizează informațiile tale de profil
        </p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle>
                {teacher?.first_name} {teacher?.last_name}
              </CardTitle>
              <CardDescription>{teacher?.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Descriere</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Scrie câteva cuvinte despre tine și experiența ta în șah..."
              rows={4}
            />
          </div>

          {/* Chess Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="chess-title">Titlu Șah</Label>
              <Select
                value={chessTitle || 'none'}
                onValueChange={(v) => setChessTitle(v === 'none' ? null : (v as ChessTitle))}
              >
                <SelectTrigger id="chess-title">
                  <SelectValue placeholder="Selectează titlul" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Fără titlu</SelectItem>
                  {chessTitles.filter(t => t !== null).map((title) => (
                    <SelectItem key={title} value={title!}>
                      {title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chess-rating">Rating ELO</Label>
              <Input
                id="chess-rating"
                type="number"
                value={chessRating}
                onChange={(e) => setChessRating(e.target.value)}
                placeholder="ex: 1800"
              />
            </div>
          </div>

          {/* Teaching Levels */}
          <div className="space-y-2">
            <Label>Niveluri Predate</Label>
            <div className="flex flex-wrap gap-2">
              {teachingLevels.map((level) => (
                <Badge
                  key={level}
                  variant={selectedTeachingLevels.includes(level) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleTeachingLevel(level)}
                >
                  {teachingLevelLabels[level]}
                </Badge>
              ))}
            </div>
          </div>

          {/* Specializations */}
          <div className="space-y-2">
            <Label>Specializări</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {specializations.map((spec) => (
                <Badge key={spec} variant="secondary" className="gap-1">
                  {spec}
                  <button
                    onClick={() => removeSpecialization(spec)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newSpecialization}
                onChange={(e) => setNewSpecialization(e.target.value)}
                placeholder="ex: Deschideri, Finaluri, Tactică..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSpecialization();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addSpecialization}>
                Adaugă
              </Button>
            </div>
          </div>

          <Button onClick={handleSaveProfile} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Se salvează...' : 'Salvează Modificările'}
          </Button>
        </CardContent>
      </Card>

      {/* Password Change Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Schimbă Parola
          </CardTitle>
          <CardDescription>
            Actualizează parola contului tău
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showPasswordForm ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">Parolă Nouă</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minim 6 caractere"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmă Parola</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repetă parola"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleChangePassword} disabled={changingPassword}>
                  {changingPassword ? 'Se schimbă...' : 'Schimbă Parola'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                >
                  Anulează
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setShowPasswordForm(true)}>
              <Lock className="mr-2 h-4 w-4" />
              Schimbă Parola
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

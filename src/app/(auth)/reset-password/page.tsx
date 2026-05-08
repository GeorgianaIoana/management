'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { validatePassword } from '@/lib/validations/password';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Loader2, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);
  const supabase = createClient();

  // Check if we have a valid session from the email link
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsValidSession(!!session);
    };
    checkSession();

    // Listen for auth state changes (when user clicks email link)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsValidSession(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const passwordValidation = validatePassword(password);
  const passwordsMatch = password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordValidation.valid) {
      toast.error('Password does not meet requirements', {
        description: passwordValidation.errors.join(', '),
      });
      return;
    }

    if (!passwordsMatch) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        toast.error('Error resetting password', {
          description: error.message,
        });
        return;
      }

      setIsSuccess(true);
      toast.success('Password changed successfully!');

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while checking session
  if (isValidSession === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Invalid or expired link
  if (!isValidSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
              <XCircle className="h-10 w-10" />
            </div>
            <CardTitle className="text-2xl">Invalid or Expired Link</CardTitle>
            <CardDescription>
              The password reset link is no longer valid. Please request a new one.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/forgot-password">Request New Link</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle className="h-10 w-10" />
            </div>
            <CardTitle className="text-2xl">Password Changed!</CardTitle>
            <CardDescription>
              Your password has been updated successfully. You will be redirected to the login page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/login">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Crown className="h-10 w-10" />
          </div>
          <CardTitle className="text-2xl">New Password</CardTitle>
          <CardDescription>
            Enter your new password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password requirements */}
              {password.length > 0 && (
                <div className="mt-2 space-y-1 text-xs">
                  <p className={password.length >= 12 ? 'text-green-600' : 'text-muted-foreground'}>
                    {password.length >= 12 ? '✓' : '○'} At least 12 characters
                  </p>
                  <p className={/[A-Z]/.test(password) ? 'text-green-600' : 'text-muted-foreground'}>
                    {/[A-Z]/.test(password) ? '✓' : '○'} One uppercase letter (A-Z)
                  </p>
                  <p className={/[a-z]/.test(password) ? 'text-green-600' : 'text-muted-foreground'}>
                    {/[a-z]/.test(password) ? '✓' : '○'} One lowercase letter (a-z)
                  </p>
                  <p className={/[0-9]/.test(password) ? 'text-green-600' : 'text-muted-foreground'}>
                    {/[0-9]/.test(password) ? '✓' : '○'} One number (0-9)
                  </p>
                  <p className={/[^A-Za-z0-9]/.test(password) ? 'text-green-600' : 'text-muted-foreground'}>
                    {/[^A-Za-z0-9]/.test(password) ? '✓' : '○'} One special character (!@#$%^&*)
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="text-xs text-red-500">Passwords do not match</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !passwordValidation.valid || !passwordsMatch}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Change Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

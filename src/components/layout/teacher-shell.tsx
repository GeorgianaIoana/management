'use client';

import { useEffect, useState } from 'react';
import { useUIStore } from '@/stores/ui-store';
import { useAuthStore } from '@/stores/auth-store';
import { cn } from '@/lib/utils';
import { TeacherSidebar } from './teacher-sidebar';
import { TeacherHeader } from './teacher-header';
import { TeacherMobileNav } from './teacher-mobile-nav';
import { ErrorBoundary } from '@/components/error-boundary';
import { type ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';

interface TeacherShellProps {
  children: ReactNode;
}

export function TeacherShell({ children }: TeacherShellProps) {
  const { sidebarCollapsed } = useUIStore();
  const { teacherId } = useAuthStore();
  const [teacherName, setTeacherName] = useState<string | undefined>();
  const supabase = createClient();

  useEffect(() => {
    async function fetchTeacherName() {
      if (!teacherId) return;

      const { data: teacher } = await supabase
        .from('teachers')
        .select('first_name, last_name')
        .eq('id', teacherId)
        .single();

      if (teacher) {
        setTeacherName(`${teacher.first_name} ${teacher.last_name}`);
      }
    }

    fetchTeacherName();
  }, [teacherId, supabase]);

  return (
    <div className="min-h-screen bg-background">
      <TeacherSidebar />
      <TeacherHeader teacherName={teacherName} />
      <TeacherMobileNav />
      <main
        className={cn(
          'min-h-screen transition-all duration-200 ease-out',
          'pt-14 max-md:pt-0',
          sidebarCollapsed ? 'md:pl-[72px]' : 'md:pl-60'
        )}
      >
        <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
          <ErrorBoundary>{children}</ErrorBoundary>
        </div>
      </main>
    </div>
  );
}

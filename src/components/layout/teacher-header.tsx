'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useUIStore } from '@/stores/ui-store';
import { useAuthStore } from '@/stores/auth-store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { LogOut, Moon, Sun, User } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';

interface TeacherHeaderProps {
  teacherName?: string;
}

export function TeacherHeader({ teacherName }: TeacherHeaderProps) {
  const router = useRouter();
  const { sidebarCollapsed } = useUIStore();
  const { clear } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    clear();
    router.push('/login');
  };

  const initials = teacherName
    ? teacherName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'T';

  return (
    <header
      className={cn(
        'fixed right-0 top-0 z-30 flex h-14 items-center justify-end gap-1.5 bg-background/80 px-4 backdrop-blur-xl transition-all duration-200 max-md:hidden',
        sidebarCollapsed ? 'left-[72px]' : 'left-60'
      )}
    >
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-muted/50">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-[11px] font-semibold text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem disabled className="text-[12px] text-muted-foreground">
            {teacherName || 'Profesor'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/teacher/profil" className="flex items-center">
              <User className="mr-2 h-3.5 w-3.5" />
              Profil
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
            <LogOut className="mr-2 h-3.5 w-3.5" />
            Deconectare
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

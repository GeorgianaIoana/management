'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import { createClient } from '@/lib/supabase/client';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  Calendar,
  ClipboardCheck,
  User,
  Menu,
  LogOut,
} from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: 'Acasă', href: '/teacher', icon: LayoutDashboard },
  { name: 'Clasele Mele', href: '/teacher/clase', icon: Calendar },
  { name: 'Prezențe', href: '/teacher/prezente', icon: ClipboardCheck },
  { name: 'Profil', href: '/teacher/profil', icon: User },
];

export function TeacherMobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { clear } = useAuthStore();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    clear();
    setOpen(false);
    router.push('/login');
  };

  return (
    <div className="fixed left-4 top-3 z-50 md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon-sm" className="bg-background/80 backdrop-blur-sm shadow-sm border border-border/50">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <div className="flex h-14 items-center border-b border-border/50 px-5">
            <Link
              href="/teacher"
              className="flex items-center gap-3"
              onClick={() => setOpen(false)}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-sm">
                <span className="text-sm font-bold">S</span>
              </div>
              <span className="text-[15px] font-semibold tracking-tight">The Square</span>
            </Link>
          </div>
          <ScrollArea className="h-[calc(100vh-3.5rem)]">
            <nav className="flex flex-col gap-0.5 p-3">
              {navigation.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== '/teacher' && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-150',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    )}
                  >
                    <item.icon className={cn(
                      'h-[18px] w-[18px] shrink-0',
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    )} />
                    <span className="flex-1">{item.name}</span>
                  </Link>
                );
              })}

              <div className="my-2 border-t border-border/50" />

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-destructive transition-all duration-150 hover:bg-destructive/10"
              >
                <LogOut className="h-[18px] w-[18px] shrink-0" />
                <span>Deconectare</span>
              </button>
            </nav>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}

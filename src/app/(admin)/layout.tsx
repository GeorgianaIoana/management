'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  Trophy,
  LogOut,
  Shield,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Admin Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Competiții', href: '/admin/competitions', icon: Trophy },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  // Don't show layout on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <div className="flex min-h-screen">
      {/* Admin Sidebar */}
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col bg-zinc-900 text-white">
        {/* Logo */}
        <div className="flex h-14 items-center gap-3 px-4 border-b border-zinc-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-zinc-900">
            <Shield className="h-5 w-5" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight">
            Admin Panel
          </span>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="flex flex-col gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/admin' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Bottom */}
        <div className="border-t border-zinc-800 p-3">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-3 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </Button>
          <Link
            href="/dashboard"
            className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
          >
            ← Înapoi la Dashboard
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-60 flex-1 bg-zinc-950 min-h-screen">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

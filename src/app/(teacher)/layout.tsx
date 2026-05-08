import { TeacherShell } from '@/components/layout';

// Force dynamic rendering for all teacher pages
export const dynamic = 'force-dynamic';

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TeacherShell>{children}</TeacherShell>;
}

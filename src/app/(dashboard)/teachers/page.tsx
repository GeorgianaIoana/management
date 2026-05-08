import { TeachersTable } from '@/components/teachers';

export const metadata = {
  title: 'Teachers - THE SQUARE',
};

export default function TeachersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Teachers</h1>
        <p className="text-muted-foreground">
          Manage your chess instructors
        </p>
      </div>
      <TeachersTable />
    </div>
  );
}

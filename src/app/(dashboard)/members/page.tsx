import { MembersTable } from '@/components/members';

export const metadata = {
  title: 'Members - THE SQUARE',
};

export default function MembersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Members</h1>
        <p className="text-muted-foreground">
          Manage your chess club members
        </p>
      </div>
      <MembersTable />
    </div>
  );
}

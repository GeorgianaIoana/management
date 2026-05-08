import { InactiveMembersTable } from '@/components/members/inactive-members-table';

export const metadata = {
  title: 'Inactive Members - THE SQUARE',
};

export default function InactiveMembersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Inactive Members</h1>
        <p className="text-muted-foreground">
          Members who are no longer active in the club
        </p>
      </div>
      <InactiveMembersTable />
    </div>
  );
}

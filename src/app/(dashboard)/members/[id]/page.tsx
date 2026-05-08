import { MemberDetail } from '@/components/members';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface MemberPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: 'Member Details - THE SQUARE',
};

export default async function MemberPage({ params }: MemberPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/members">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Member Details</h1>
        </div>
      </div>
      <MemberDetail memberId={id} />
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { useCreateMember } from '@/hooks/use-members';
import { MemberForm } from '@/components/members';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { MemberFormValues } from '@/lib/validations/member';

export default function NewMemberPage() {
  const router = useRouter();
  const createMutation = useCreateMember();

  const handleSubmit = async (data: MemberFormValues) => {
    const memberData = {
      ...data,
      email: data.email || null,
      phone: data.phone || null,
      date_of_birth: data.date_of_birth || null,
      guardian_name: data.guardian_name || null,
      guardian_phone: data.guardian_phone || null,
      guardian_email: data.guardian_email || null,
      chess_rating: data.chess_rating ?? null,
      skill_level: data.skill_level ?? null,
      avatar_url: data.avatar_url ?? null,
      notes: data.notes ?? null,
      contract_signed: data.contract_signed ?? false,
      contract_file_url: data.contract_file_url ?? null,
      payment_confirmed: data.payment_confirmed ?? false,
      feedback_received: data.feedback_received ?? false,
      rating_given: data.rating_given ?? false,
      trainer_id: data.trainer_id ?? null,
    };

    await createMutation.mutateAsync(memberData);
    router.push('/members');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/members">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">New Member</h1>
          <p className="text-muted-foreground">
            Add a new member to your chess club
          </p>
        </div>
      </div>
      <MemberForm
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
      />
    </div>
  );
}

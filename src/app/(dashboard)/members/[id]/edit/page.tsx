'use client';

import { useParams, useRouter } from 'next/navigation';
import { useMember, useUpdateMember } from '@/hooks/use-members';
import { MemberForm } from '@/components/members';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { MemberFormValues } from '@/lib/validations/member';

export default function EditMemberPage() {
  const params = useParams();
  const router = useRouter();
  const memberId = params.id as string;

  const { data: member, isLoading } = useMember(memberId);
  const updateMutation = useUpdateMember();

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

    await updateMutation.mutateAsync({ id: memberId, data: memberData });
    router.push(`/members/${memberId}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32 mt-2" />
          </div>
        </div>
        <Card>
          <CardContent className="py-8">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/members">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Member Not Found</h1>
          </div>
        </div>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            The member you are looking for does not exist.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/members/${memberId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Member</h1>
          <p className="text-muted-foreground">
            {member.first_name} {member.last_name}
          </p>
        </div>
      </div>
      <MemberForm
        member={member}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
      />
    </div>
  );
}

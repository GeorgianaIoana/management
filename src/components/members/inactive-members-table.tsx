'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMembers, useUpdateMember } from '@/hooks/use-members';
import type { PaginationParams, Member } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Search,
  MoreHorizontal,
  Eye,
  Pencil,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Users,
  Baby,
} from 'lucide-react';
import { format } from 'date-fns';

export function InactiveMembersTable() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    pageSize: 10,
  });
  const [reactivateDialogOpen, setReactivateDialogOpen] = useState(false);
  const [memberToReactivate, setMemberToReactivate] = useState<Member | null>(null);

  const { data, isLoading } = useMembers(
    { search, status: 'inactive' },
    pagination
  );
  const updateMutation = useUpdateMember();

  const handleSearch = (value: string) => {
    setSearch(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleReactivate = async () => {
    if (memberToReactivate) {
      await updateMutation.mutateAsync({
        id: memberToReactivate.id,
        data: { status: 'active' },
      });
      setReactivateDialogOpen(false);
      setMemberToReactivate(null);
    }
  };

  const getSkillBadge = (level: string | null) => {
    if (!level) return null;
    const colors: Record<string, string> = {
      beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      intermediate: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
      advanced: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
      expert: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
    };
    return (
      <Badge variant="outline" className={colors[level]}>
        {level}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search inactive members..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            {data?.total ?? 0} inactive members
          </Badge>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Skill Level</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))
            ) : data?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No inactive members found
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((member) => (
                <TableRow key={member.id} className="opacity-75 hover:opacity-100">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 grayscale">
                        <AvatarImage src={member.avatar_url ?? undefined} />
                        <AvatarFallback>
                          {member.first_name[0]}{member.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {member.first_name} {member.last_name}
                        </p>
                        {member.chess_rating && (
                          <p className="text-sm text-muted-foreground">
                            ELO: {member.chess_rating}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {member.member_type === 'child' ? (
                        <Baby className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Users className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="capitalize">{member.member_type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{member.email || '-'}</p>
                      {member.phone && (
                        <p className="text-muted-foreground">{member.phone}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getSkillBadge(member.skill_level)}</TableCell>
                  <TableCell>
                    {format(new Date(member.join_date), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground line-clamp-2 max-w-48">
                      {member.notes || '-'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex items-center justify-center size-8 rounded-lg hover:bg-muted hover:text-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/members/${member.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/members/${member.id}/edit`)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-green-600"
                          onClick={() => {
                            setMemberToReactivate(member);
                            setReactivateDialogOpen(true);
                          }}
                        >
                          <UserCheck className="mr-2 h-4 w-4" />
                          Reactivate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Showing {(pagination.page - 1) * pagination.pageSize + 1} to{' '}
              {Math.min(pagination.page * pagination.pageSize, data.total)} of{' '}
              {data.total} members
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === 1}
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                }
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {pagination.page} of {data.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === data.totalPages}
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Reactivate Dialog */}
      <Dialog open={reactivateDialogOpen} onOpenChange={setReactivateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reactivate Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to reactivate{' '}
              <span className="font-medium">
                {memberToReactivate?.first_name} {memberToReactivate?.last_name}
              </span>
              ? They will be moved back to the active members list.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReactivateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReactivate}
              disabled={updateMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Reactivate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

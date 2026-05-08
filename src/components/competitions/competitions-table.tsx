'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCompetitions, useDeleteCompetition } from '@/hooks/use-competitions';
import type { CompetitionFilters, PaginationParams, Competition } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Users,
} from 'lucide-react';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';

const statusLabels: Record<string, string> = {
  planned: 'Planificat',
  ongoing: 'În desfășurare',
  completed: 'Finalizat',
  cancelled: 'Anulat',
};

interface CompetitionsTableProps {
  basePath?: string;
}

export function CompetitionsTable({ basePath = '/competitions' }: CompetitionsTableProps) {
  const router = useRouter();
  const [filters, setFilters] = useState<CompetitionFilters>({});
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    pageSize: 10,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [competitionToDelete, setCompetitionToDelete] =
    useState<Competition | null>(null);

  const { data, isLoading } = useCompetitions(filters, pagination);
  const deleteMutation = useDeleteCompetition();

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (key: keyof CompetitionFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleDelete = async () => {
    if (competitionToDelete) {
      await deleteMutation.mutateAsync(competitionToDelete.id);
      setDeleteDialogOpen(false);
      setCompetitionToDelete(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      'default' | 'secondary' | 'destructive' | 'outline'
    > = {
      planned: 'default',
      ongoing: 'secondary',
      completed: 'outline',
      cancelled: 'destructive',
    };
    return <Badge variant={variants[status] ?? 'outline'}>{statusLabels[status]}</Badge>;
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Caută competiții..."
              value={filters.search ?? ''}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={filters.status ?? 'all'}
            onValueChange={(value) => {
              if (value) handleFilterChange('status', value);
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toate statusurile</SelectItem>
              <SelectItem value="planned">Planificat</SelectItem>
              <SelectItem value="ongoing">În desfășurare</SelectItem>
              <SelectItem value="completed">Finalizat</SelectItem>
              <SelectItem value="cancelled">Anulat</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button asChild>
          <Link href={`${basePath}/new`}>
            <Plus className="mr-2 h-4 w-4" />
            Competiție nouă
          </Link>
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Competiție</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Locație</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Participanți</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8" />
                  </TableCell>
                </TableRow>
              ))
            ) : data?.data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  Nu s-au găsit competiții
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((competition) => (
                <TableRow key={competition.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{competition.name}</p>
                      {competition.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {competition.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>
                        {format(new Date(competition.event_date), 'd MMM yyyy', { locale: ro })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {competition.location ? (
                      <div className="flex items-center gap-1.5 text-sm">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{competition.location}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(competition.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{competition.participants_count ?? 0}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`${basePath}/${competition.id}`)
                          }
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Vezi
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/competitions/${competition.id}/edit`)
                          }
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Editează
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            setCompetitionToDelete(competition);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Șterge
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
              {(pagination.page - 1) * pagination.pageSize + 1} -{' '}
              {Math.min(pagination.page * pagination.pageSize, data.total)} din{' '}
              {data.total} competiții
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
                Pagina {pagination.page} din {data.totalPages}
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

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Șterge competiția</DialogTitle>
            <DialogDescription>
              Ești sigur că vrei să ștergi competiția{' '}
              <span className="font-medium">{competitionToDelete?.name}</span>?
              Această acțiune nu poate fi anulată.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Anulează
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && (
                <span className="mr-2 h-4 w-4 animate-spin">⏳</span>
              )}
              Șterge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

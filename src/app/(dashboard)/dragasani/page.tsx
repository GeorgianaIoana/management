'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MapPin,
  Users,
  Baby,
  UserPlus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  FileText,
  CreditCard,
  MessageSquare,
  Star,
} from 'lucide-react';
import {
  useDragasaniMembers,
  useDragasaniMemberStats,
  useCreateDragasaniMember,
  useUpdateDragasaniMember,
  useDeleteDragasaniMember,
} from '@/hooks/use-dragasani-members';
import type { DragasaniMember, PaginationParams } from '@/types';

type MemberFormData = Omit<DragasaniMember, 'id' | 'created_at' | 'updated_at'>;

const emptyFormData: MemberFormData = {
  first_name: '',
  last_name: '',
  email: null,
  phone: null,
  date_of_birth: null,
  member_type: 'child',
  guardian_name: null,
  guardian_phone: null,
  guardian_email: null,
  chess_rating: null,
  skill_level: null,
  status: 'active',
  join_date: new Date().toISOString().split('T')[0],
  notes: null,
  contract_signed: false,
  contract_file_url: null,
  payment_confirmed: false,
  feedback_received: false,
  rating_given: false,
};

export default function DragasaniPage() {
  const [filters, setFilters] = useState<{ search?: string; member_type?: 'child' | 'adult' | 'all'; status?: 'active' | 'inactive' | 'suspended' | 'all' }>({});
  const [pagination] = useState<PaginationParams>({ page: 1, pageSize: 50 });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<DragasaniMember | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<DragasaniMember | null>(null);
  const [formData, setFormData] = useState<MemberFormData>(emptyFormData);

  const { data: stats } = useDragasaniMemberStats();
  const { data: membersData, isLoading } = useDragasaniMembers(filters, pagination);
  const createMutation = useCreateDragasaniMember();
  const updateMutation = useUpdateDragasaniMember();
  const deleteMutation = useDeleteDragasaniMember();

  const handleOpenDialog = (member?: DragasaniMember) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        first_name: member.first_name,
        last_name: member.last_name,
        email: member.email,
        phone: member.phone,
        date_of_birth: member.date_of_birth,
        member_type: member.member_type,
        guardian_name: member.guardian_name,
        guardian_phone: member.guardian_phone,
        guardian_email: member.guardian_email,
        chess_rating: member.chess_rating,
        skill_level: member.skill_level,
        status: member.status,
        join_date: member.join_date,
        notes: member.notes,
        contract_signed: member.contract_signed,
        contract_file_url: member.contract_file_url,
        payment_confirmed: member.payment_confirmed,
        feedback_received: member.feedback_received,
        rating_given: member.rating_given,
      });
    } else {
      setEditingMember(null);
      setFormData(emptyFormData);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingMember(null);
    setFormData(emptyFormData);
  };

  const handleSubmit = async () => {
    if (!formData.first_name || !formData.last_name) return;

    if (editingMember) {
      await updateMutation.mutateAsync({ id: editingMember.id, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
    handleCloseDialog();
  };

  const handleDelete = async () => {
    if (memberToDelete) {
      await deleteMutation.mutateAsync(memberToDelete.id);
      setIsDeleteDialogOpen(false);
      setMemberToDelete(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      active: 'default',
      inactive: 'secondary',
      suspended: 'destructive',
    };
    return <Badge variant={variants[status] ?? 'secondary'}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MapPin className="h-8 w-8 text-primary" />
            The Square Dragașani
          </h1>
          <p className="text-muted-foreground">
            Gestionează membrii din locația Dragașani
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <UserPlus className="mr-2 h-4 w-4" />
          Adaugă Membru
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Membri</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Activi</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.active ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Copii</CardTitle>
            <Baby className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats?.kids ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Adulți</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats?.adults ?? 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Caută membri..."
            value={filters.search ?? ''}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="pl-9"
          />
        </div>
        <Select
          value={filters.member_type ?? 'all'}
          onValueChange={(value) => setFilters(prev => ({ ...prev, member_type: value as 'child' | 'adult' | 'all' }))}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toți</SelectItem>
            <SelectItem value="child">Copii</SelectItem>
            <SelectItem value="adult">Adulți</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.status ?? 'all'}
          onValueChange={(value) => setFilters(prev => ({ ...prev, status: value as 'active' | 'inactive' | 'suspended' | 'all' }))}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toate</SelectItem>
            <SelectItem value="active">Activ</SelectItem>
            <SelectItem value="inactive">Inactiv</SelectItem>
            <SelectItem value="suspended">Suspendat</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Members Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nume</TableHead>
                <TableHead>Tip</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead className="text-center">Contract</TableHead>
                <TableHead className="text-center">Plată</TableHead>
                <TableHead className="text-center">Feedback</TableHead>
                <TableHead className="text-center">Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-6 mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-6 mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-6 mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-6 mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : membersData?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    Nu există membri înregistrați
                  </TableCell>
                </TableRow>
              ) : (
                membersData?.data.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{member.first_name} {member.last_name}</p>
                        {member.guardian_name && (
                          <p className="text-sm text-muted-foreground">Părinte: {member.guardian_name}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {member.member_type === 'child' ? (
                          <Baby className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Users className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="capitalize">{member.member_type === 'child' ? 'Copil' : 'Adult'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {member.phone || member.guardian_phone || '-'}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className={`inline-flex p-1.5 rounded-lg transition-all ${member.contract_signed ? 'text-green-600 bg-green-100 dark:bg-green-900/30 icon-3d' : 'text-muted-foreground/40'}`}>
                        <FileText className="h-4 w-4" />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className={`inline-flex p-1.5 rounded-lg transition-all ${member.payment_confirmed ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 icon-3d' : 'text-muted-foreground/40'}`}>
                        <CreditCard className="h-4 w-4" />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className={`inline-flex p-1.5 rounded-lg transition-all ${member.feedback_received ? 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 icon-3d' : 'text-muted-foreground/40'}`}>
                        <MessageSquare className="h-4 w-4" />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className={`inline-flex p-1.5 rounded-lg transition-all ${member.rating_given ? 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 icon-3d' : 'text-muted-foreground/40'}`}>
                        <Star className="h-4 w-4" />
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(member.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center size-8 rounded-lg hover:bg-muted">
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenDialog(member)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editează
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              setMemberToDelete(member);
                              setIsDeleteDialogOpen(true);
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
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMember ? 'Editează Membru' : 'Adaugă Membru Nou'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">Prenume *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Nume *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="member_type">Tip Membru</Label>
                <Select
                  value={formData.member_type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, member_type: value as 'child' | 'adult' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="child">Copil</SelectItem>
                    <SelectItem value="adult">Adult</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  value={formData.phone ?? ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value || null }))}
                />
              </div>
            </div>
            {formData.member_type === 'child' && (
              <>
                <div className="border-t pt-4 mt-2">
                  <p className="text-sm font-medium mb-3">Informații Părinte/Tutore</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="guardian_name">Nume Părinte</Label>
                      <Input
                        id="guardian_name"
                        value={formData.guardian_name ?? ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, guardian_name: e.target.value || null }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guardian_phone">Telefon Părinte</Label>
                      <Input
                        id="guardian_phone"
                        value={formData.guardian_phone ?? ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, guardian_phone: e.target.value || null }))}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="border-t pt-4 mt-2">
              <p className="text-sm font-medium mb-3">Status</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as 'active' | 'inactive' | 'suspended' }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Activ</SelectItem>
                      <SelectItem value="inactive">Inactiv</SelectItem>
                      <SelectItem value="suspended">Suspendat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="join_date">Data Înscriere</Label>
                  <Input
                    id="join_date"
                    type="date"
                    value={formData.join_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, join_date: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Anulează
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {editingMember ? 'Salvează' : 'Adaugă'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Șterge Membru</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Ești sigur că vrei să ștergi membrul{' '}
            <span className="font-medium text-foreground">
              {memberToDelete?.first_name} {memberToDelete?.last_name}
            </span>
            ? Această acțiune nu poate fi anulată.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Anulează
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              Șterge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

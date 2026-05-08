'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { memberSchema, type MemberFormValues } from '@/lib/validations/member';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Upload, FileText, X, Check } from 'lucide-react';
import { useAllTeachers } from '@/hooks/use-teachers';
import { uploadContract } from '@/services/members';
import type { Member } from '@/types';
import { useState, useRef } from 'react';

interface MemberFormProps {
  member?: Member;
  onSubmit: (data: MemberFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

export function MemberForm({ member, onSubmit, isSubmitting }: MemberFormProps) {
  const { data: teachers } = useAllTeachers();
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [isUploadingContract, setIsUploadingContract] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MemberFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- zod resolver type mismatch
    resolver: zodResolver(memberSchema) as any,
    defaultValues: {
      first_name: member?.first_name ?? '',
      last_name: member?.last_name ?? '',
      email: member?.email ?? '',
      phone: member?.phone ?? '',
      date_of_birth: member?.date_of_birth ?? '',
      member_type: member?.member_type ?? 'adult',
      guardian_name: member?.guardian_name ?? '',
      guardian_phone: member?.guardian_phone ?? '',
      guardian_email: member?.guardian_email ?? '',
      chess_rating: member?.chess_rating ?? null,
      skill_level: member?.skill_level ?? null,
      status: member?.status ?? 'active',
      join_date: member?.join_date ?? new Date().toISOString().split('T')[0],
      notes: member?.notes ?? '',
      contract_signed: member?.contract_signed ?? false,
      contract_file_url: member?.contract_file_url ?? null,
      payment_confirmed: member?.payment_confirmed ?? false,
      feedback_received: member?.feedback_received ?? false,
      rating_given: member?.rating_given ?? false,
      trainer_id: member?.trainer_id ?? null,
    },
  });

  const memberType = watch('member_type');
  const contractSigned = watch('contract_signed');
  const paymentConfirmed = watch('payment_confirmed');
  const feedbackReceived = watch('feedback_received');
  const ratingGiven = watch('rating_given');
  const trainerId = watch('trainer_id');
  const contractFileUrl = watch('contract_file_url');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setContractFile(file);
    }
  };

  const handleRemoveFile = () => {
    setContractFile(null);
    setValue('contract_file_url', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFormSubmit = async (data: MemberFormValues) => {
    const finalData = { ...data };

    if (contractFile && member?.id) {
      setIsUploadingContract(true);
      try {
        const url = await uploadContract(member.id, contractFile);
        finalData.contract_file_url = url;
      } catch {
        // Continue without file upload
      } finally {
        setIsUploadingContract(false);
      }
    }

    await onSubmit(finalData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name *</Label>
            <Input
              id="first_name"
              {...register('first_name')}
              placeholder="John"
            />
            {errors.first_name && (
              <p className="text-sm text-destructive">{errors.first_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name *</Label>
            <Input
              id="last_name"
              {...register('last_name')}
              placeholder="Doe"
            />
            {errors.last_name && (
              <p className="text-sm text-destructive">{errors.last_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              {...register('phone')}
              placeholder="+40 123 456 789"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Date of Birth</Label>
            <Input
              id="date_of_birth"
              type="date"
              {...register('date_of_birth')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="member_type">Member Type *</Label>
            <Select
              value={memberType}
              onValueChange={(value) => {
                if (value) setValue('member_type', value as 'child' | 'adult')
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="child">Child</SelectItem>
                <SelectItem value="adult">Adult</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="join_date">Join Date *</Label>
            <Input
              id="join_date"
              type="date"
              {...register('join_date')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={watch('status')}
              onValueChange={(value) => {
                if (value) setValue('status', value as 'active' | 'inactive' | 'suspended')
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {memberType === 'child' && (
        <Card>
          <CardHeader>
            <CardTitle>Guardian Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="guardian_name">Guardian Name *</Label>
              <Input
                id="guardian_name"
                {...register('guardian_name')}
                placeholder="Parent/Guardian name"
              />
              {errors.guardian_name && (
                <p className="text-sm text-destructive">{errors.guardian_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="guardian_phone">Guardian Phone</Label>
              <Input
                id="guardian_phone"
                {...register('guardian_phone')}
                placeholder="+40 123 456 789"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="guardian_email">Guardian Email</Label>
              <Input
                id="guardian_email"
                type="email"
                {...register('guardian_email')}
                placeholder="guardian@example.com"
              />
              {errors.guardian_email && (
                <p className="text-sm text-destructive">{errors.guardian_email.message}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Chess Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="chess_rating">Chess Rating (ELO)</Label>
            <Input
              id="chess_rating"
              type="number"
              {...register('chess_rating')}
              placeholder="1200"
              min={0}
              max={3000}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skill_level">Skill Level</Label>
            <Select
              value={watch('skill_level') ?? ''}
              onValueChange={(value) =>
                setValue('skill_level', value as MemberFormValues['skill_level'])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select skill level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="trainer_id">Trainer</Label>
            <Select
              value={trainerId ?? ''}
              onValueChange={(value) => setValue('trainer_id', value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select trainer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No trainer assigned</SelectItem>
                {teachers?.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.first_name} {teacher.last_name}
                    {teacher.chess_title && ` (${teacher.chess_title})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Additional notes about the member..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status & Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-center text-sm font-medium">Activ</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Detalii</th>
                </tr>
              </thead>
              <tbody>
                {/* Contract Row */}
                <tr className="border-b">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="font-medium">Contract semnat</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Switch
                      checked={contractSigned}
                      onCheckedChange={(checked) => setValue('contract_signed', checked)}
                      className="data-[state=checked]:bg-green-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                    />
                    {contractFileUrl || contractFile ? (
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {contractFile?.name ?? 'Contract uploaded'}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveFile}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingContract}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                      </Button>
                    )}
                  </td>
                </tr>

                {/* Payment Row */}
                <tr className="border-b">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      <span className="font-medium">Plata confirmată</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Switch
                      checked={paymentConfirmed}
                      onCheckedChange={(checked) => setValue('payment_confirmed', checked)}
                      className="data-[state=checked]:bg-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    {paymentConfirmed && (
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                        <Check className="mr-1 h-3 w-3" />
                        Confirmat
                      </Badge>
                    )}
                  </td>
                </tr>

                {/* Feedback Row */}
                <tr className="border-b">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-purple-500" />
                      <span className="font-medium">Feedback primit</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Switch
                      checked={feedbackReceived}
                      onCheckedChange={(checked) => setValue('feedback_received', checked)}
                      className="data-[state=checked]:bg-purple-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    {feedbackReceived && (
                      <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                        <Check className="mr-1 h-3 w-3" />
                        Primit
                      </Badge>
                    )}
                  </td>
                </tr>

                {/* Rating Row */}
                <tr>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-orange-500" />
                      <span className="font-medium">Rating oferit</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Switch
                      checked={ratingGiven}
                      onCheckedChange={(checked) => setValue('rating_given', checked)}
                      className="data-[state=checked]:bg-orange-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    {ratingGiven && (
                      <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100">
                        <Check className="mr-1 h-3 w-3" />
                        Oferit
                      </Badge>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {member ? 'Update Member' : 'Create Member'}
        </Button>
      </div>
    </form>
  );
}

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ColumnDef } from '@tanstack/react-table';
import { EllipsisVertical } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Database } from '@kit/supabase/database';
import { Button } from '@kit/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@kit/ui/dropdown-menu';
import { DataTable } from '@kit/ui/enhanced-data-table';
import { Form, FormControl, FormField, FormItem } from '@kit/ui/form';
import { Heading } from '@kit/ui/heading';
import { If } from '@kit/ui/if';
import { Input } from '@kit/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@kit/ui/select';

import { AdminDeleteAccountDialog } from './admin-delete-account-dialog';
import { AdminDeleteUserDialog } from './admin-delete-user-dialog';
import { AdminImpersonateUserDialog } from './admin-impersonate-user-dialog';
import {Link, useSearchParams} from "@remix-run/react";

type Account = Database['public']['Tables']['accounts']['Row'];

const FiltersSchema = z.object({
  type: z.enum(['all', 'team', 'personal']),
  query: z.string().optional(),
});

export function AdminAccountsTable(
  props: React.PropsWithChildren<{
    data: Account[];
    pageCount: number;
    pageSize: number;
    page: number;
    filters: {
      type: 'all' | 'team' | 'personal';
    };
  }>,
) {
  return (
    <div className={'flex flex-col space-y-4'}>
      <AccountsTableFilters filters={props.filters} />

      <DataTable
        pageSize={props.pageSize}
        pageIndex={props.page - 1}
        pageCount={props.pageCount}
        data={props.data}
        columns={getColumns()}
      />
    </div>
  );
}

function AccountsTableFilters(props: {
  filters: z.infer<typeof FiltersSchema>;
}) {
  const form = useForm({
    resolver: zodResolver(FiltersSchema),
    defaultValues: {
      type: props.filters?.type ?? 'all',
      query: '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const [, setSearchParams] = useSearchParams();

  const onSubmit = ({ type, query }: z.infer<typeof FiltersSchema>) => {
    setSearchParams({
      account_type: type,
      query: query ?? '',
    });
  };

  return (
    <div className={'flex items-center justify-between space-x-4'}>
      <Heading level={3}>Accounts</Heading>

      <div className={'flex space-x-4'}>
        <Form {...form}>
          <form
            className={'flex space-x-4'}
            onSubmit={form.handleSubmit((data) => onSubmit(data))}
          >
            <Select
              value={form.watch('type')}
              onValueChange={(value) => {
                form.setValue(
                  'type',
                  value as z.infer<typeof FiltersSchema>['type'],
                  {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  },
                );

                return onSubmit(form.getValues());
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={'Account Type'} />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Account Type</SelectLabel>

                  <SelectItem value={'all'}>All accounts</SelectItem>
                  <SelectItem value={'team'}>Team</SelectItem>
                  <SelectItem value={'personal'}>Personal</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <FormField
              name={'query'}
              render={({ field }) => (
                <FormItem>
                  <FormControl className={'w-full min-w-36 md:min-w-72'}>
                    <Input
                      className={'w-full'}
                      placeholder={`Search account...`}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  );
}

function getColumns(): ColumnDef<Account>[] {
  return [
    {
      id: 'name',
      header: 'Name',
      cell: ({ row }) => {
        return (
          <Link
            className={'hover:underline'}
            to={`/admin/accounts/${row.original.id}`}
          >
            {row.original.name}
          </Link>
        );
      },
    },
    {
      id: 'email',
      header: 'Email',
      accessorKey: 'email',
    },
    {
      id: 'type',
      header: 'Type',
      cell: ({ row }) => {
        return row.original.is_personal_account ? 'Personal' : 'Team';
      },
    },
    {
      id: 'created_at',
      header: 'Created At',
      accessorKey: 'created_at',
    },
    {
      id: 'updated_at',
      header: 'Updated At',
      accessorKey: 'updated_at',
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const isPersonalAccount = row.original.is_personal_account;
        const userId = row.original.id;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={'ghost'}>
                <EllipsisVertical className={'h-4'} />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align={'end'}>
              <DropdownMenuGroup>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>

                <DropdownMenuItem>
                  <Link
                    className={'h-full w-full'}
                    to={`/admin/accounts/${userId}`}
                  >
                    View
                  </Link>
                </DropdownMenuItem>

                <If condition={isPersonalAccount}>
                  <AdminImpersonateUserDialog userId={userId}>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      Impersonate User
                    </DropdownMenuItem>
                  </AdminImpersonateUserDialog>

                  <AdminDeleteUserDialog userId={userId}>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      Delete Personal Account
                    </DropdownMenuItem>
                  </AdminDeleteUserDialog>
                </If>

                <If condition={!isPersonalAccount}>
                  <AdminDeleteAccountDialog accountId={row.original.id}>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      Delete Team Account
                    </DropdownMenuItem>
                  </AdminDeleteAccountDialog>
                </If>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}

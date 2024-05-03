'use client';

import { Link } from '@remix-run/react';
import { ColumnDef } from '@tanstack/react-table';

import { Database } from '@kit/supabase/database';
import { DataTable } from '@kit/ui/enhanced-data-table';
import { ProfileAvatar } from '@kit/ui/profile-avatar';

type Memberships =
  Database['public']['Functions']['get_account_members']['Returns'][number];

export function AdminMembersTable(props: { members: Memberships[] }) {
  return <DataTable data={props.members} columns={getColumns()} />;
}

function getColumns(): ColumnDef<Memberships>[] {
  return [
    {
      header: 'User ID',
      accessorKey: 'user_id',
    },
    {
      header: 'Name',
      cell: ({ row }) => {
        const name = row.original.name ?? row.original.email;

        return (
          <div className={'flex items-center space-x-2'}>
            <div>
              <ProfileAvatar
                pictureUrl={row.original.picture_url}
                displayName={name}
              />
            </div>

            <Link
              className={'hover:underline'}
              to={`/admin/accounts/${row.original.id}`}
            >
              <span>{name}</span>
            </Link>
          </div>
        );
      },
    },
    {
      header: 'Email',
      accessorKey: 'email',
    },
    {
      header: 'Role',
      cell: ({ row }) => {
        return row.original.role;
      },
    },
    {
      header: 'Created At',
      accessorKey: 'created_at',
    },
    {
      header: 'Updated At',
      accessorKey: 'updated_at',
    },
  ];
}

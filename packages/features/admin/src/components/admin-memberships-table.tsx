'use client';

import { Link } from '@remix-run/react';
import { ColumnDef } from '@tanstack/react-table';

import { Tables } from '@kit/supabase/database';
import { DataTable } from '@kit/ui/enhanced-data-table';

type Membership =
  Tables<'accounts_memberships'> & {
    account: {
      id: string;
      name: string;
    };
  };

export function AdminMembershipsTable(props: { memberships: Membership[] }) {
  return <DataTable data={props.memberships} columns={getColumns()} />;
}

function getColumns(): ColumnDef<Membership>[] {
  return [
    {
      header: 'User ID',
      accessorKey: 'user_id',
    },
    {
      header: 'Team',
      cell: ({ row }) => {
        return (
          <Link
            className={'hover:underline'}
            to={`/admin/accounts/${row.original.account_id}`}
          >
            {row.original.account.name}
          </Link>
        );
      },
    },
    {
      header: 'Role',
      accessorKey: 'account_role',
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

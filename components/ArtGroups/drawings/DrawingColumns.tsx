"use client";

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table";
import Delete from "../../custom ui/Delete";
import Link from "next/link";

export const columns: ColumnDef<DrawingType>[] = [

  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <Link
        href={`/drawings/${row.original._id}`}
        className="hover:text-red-1"
      >
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "price",
    header: "Price ($)",
  },
  {
    id: "actions",
    cell: ({ row }) => <Delete item="drawing" id={row.original._id} />,
  },
];

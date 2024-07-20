"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import StatusBadge from "../StatusBadge";
import { formatDateTime } from "@/lib/utils";
import { Doctors } from "@/constants";
import Image from "next/image";
import AppointModal from "../AppointModal";
import { Appointment } from "@/types/appwrite.types";

export const columns: ColumnDef<Appointment>[] = [
  {
    header: "ID",
    cell: ({ row }) => <p className="text-14-medium">{row.index + 1}</p>,
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => (
      <p className="text-14-regular">{row.original.patient.name}</p>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="min-w-[115px]">
        <StatusBadge status={row.original.status} />
      </div>
    ),
  },
  {
    accessorKey: "schedule",
    header: "Appointment",
    cell: ({ row }) => <p>{formatDateTime(row.original.schedule).dateTime}</p>,
  },
  {
    accessorKey: "primaryPhysician",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const doctor = Doctors.find(
        (doc) => doc.name === row.original.primaryPhysician
      );

      return (
        <div className="flex items-center gap-3">
          <Image
            src={doctor?.image || ""}
            alt={doctor?.name || ""}
            width={100}
            height={100}
            className="size-8"
          />
          <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row: { original: data } }) => {
      return (
        <div>
          <AppointModal
            type={"schedule"}
            patientId={data.id}
            userId={data.userId}
            appointment={data}
            // title="Schedule Appointment"
            // description="Please confirm the following details to scheduled an appointment."
          />
          <AppointModal
            type={"cancelled"}
            patientId={data.id}
            userId={data.userId}
            appointment={data}
            // title="Cancel Appointment"
            // description="Are you sure you want to cancel these appointment."
          />
        </div>
      );
    },
  },
];
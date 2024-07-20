"use server";
import { ID, Query } from "node-appwrite";
import {
  APPOINMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
  messaging,
} from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";

export const createAppoinment = async (appoinment: CreateAppointmentParams) => {
  try {
    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINMENT_COLLECTION_ID!,
      ID.unique(),
      appoinment
    );
    return parseStringify(newAppointment);
  } catch (error) {
    console.log(error);
  }
};

export const getAppoinment = async (appointmentId: string) => {
  try {
    const appoinment = await databases.getDocument(
      DATABASE_ID!,
      APPOINMENT_COLLECTION_ID!,
      appointmentId
    );
    return parseStringify(appoinment);
  } catch (error) {
    console.log(error);
  }
};

export const getRecentAppointmentList = async () => {
  try {
    const appoinments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINMENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = (appoinments.documents as Appointment[]).reduce(
      (acc, appoinment) => {
        if (appoinment.status === "scheduled") {
          acc.scheduledCount += 1;
        } else if (appoinment.status === "pending") {
          acc.pendingCount += 1;
        } else if (appoinment.status === "canceled") {
          acc.cancelledCount += 1;
        }
        return acc;
      },
      initialCounts
    );

    const data = {
      totalCount: appoinments.total,
      ...counts,
      documents: appoinments.documents,
    };

    return parseStringify(data);
  } catch (error) {
    console.log(error);
  }
};

export const updateAppointment = async ({
  appointmentId,
  userId,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    const updatedOppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    );

    console.log(appointmentId);

    if (!updatedOppointment) {
      throw new Error("Appointment not found");
    }

    const smsMessage = `
    Hi, it's CarePulse. ${
      type === "schedule"
        ? `Your appointment has been scheduled for ${
            formatDateTime(appointment.schedule).dateTime
          } with Dr. ${appointment.primaryPhysician}`
        : `We regret to inform you that your appointment has been cancelled.Reason:${appointment.cancellationReason}`
    }
    `;

    console.log(appointment);

    // await sendSMSNotification(userId, smsMessage);

    revalidatePath("/admin");
    return parseStringify(updatedOppointment);
  } catch (error) {
    // console.log(error);
  }
};

export const sendSMSNotification = async (userId: string, content: string) => {
  try {
    const message = await messaging.createSms(
      ID.unique(),
      content,
      [],
      [userId]
    );
    return parseStringify(message);
  } catch (error) {
    console.log(error);
  }
};

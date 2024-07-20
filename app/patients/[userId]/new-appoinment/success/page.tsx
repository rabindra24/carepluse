import { Button } from "@/components/ui/button";
import { Doctors } from "@/constants";
import { getAppoinment } from "@/lib/actions/appoinment.actions";
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import * as Sentry from "@sentry/nextjs";
import { getUser } from "@/lib/actions/patient.actions";

const Success = async ({
  params: { userId },
  searchParams,
}: SearchParamProps) => {
  const appointmentId = (searchParams.appointmentId as string) || "";
  console.log(appointmentId);
  const appointment = await getAppoinment(appointmentId);
  // console.log(appointment);
  const doctor = Doctors.find(
    (doc) => doc.name === appointment?.primaryPhysician
  );
  const user = await getUser(userId);

  Sentry.metrics.set("user_view_success", user.name);

  // console.log(doctor);

  return (
    <div className="flex h-screen max-h-screen px-[5%] ">
      <div className="success-img">
        <Link href={"/"}>
          <Image
            src={"/assets/icons/logo-full.svg"}
            height={1000}
            width={1000}
            alt="logo"
            className="h-10 w-fit mx-auto mb-10"
          />
        </Link>

        <section className="flex flex-col items-center">
          <Image
            src={"/assets/gifs/success.gif"}
            height={380}
            width={280}
            alt="success"
          />
          <h2 className="header mb-6 max-w-[600px] text-center">
            Your <span className="text-green-500">appointment request</span> has
            been succesfully submitted!
          </h2>
          <p>We will be in touch shortly to confirm.</p>
        </section>
        <section className="request-details">
          <p>Requested appointment details</p>
          <div className="flex items-center gap-3">
            <Image
              src={doctor?.image || ""}
              height={1000}
              width={1000}
              alt="logo"
              className="h-10 w-fit"
            />
            <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
            <div className="flex gap-2">
              <Image
                src={"/assets/icons/calendar.svg"}
                height={24}
                width={24}
                alt="calendar"
              />
              <p>{formatDateTime(appointment.schedule).dateTime}</p>
            </div>
          </div>
        </section>
        <Button variant={"outline"} className="shad-primary-btn" asChild>
          <Link href={`/patients/${userId}/new-appoinment`}>
            New Appoinment
          </Link>
        </Button>
        <p className="copyright">© 2024 CarePlus</p>
      </div>
    </div>
  );
};

export default Success;

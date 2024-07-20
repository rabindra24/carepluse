import AppointmentForm from "@/components/forms/AppoinmentForm";
import PatientForm from "@/components/forms/PatientForm";
import { Button } from "@/components/ui/button";
import { getPatient } from "@/lib/actions/patient.actions";
import Image from "next/image";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";

export default async function NewAppoinment({
  params: { userId },
}: SearchParamProps) {
  const patient = await getPatient(userId);

  Sentry.metrics.set("user_view_new-appointment", patient.name);

  return (
    <div className="flex h-screen max-h-screen">
      {/* Todo: OTP Varification */}
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[490px] flex-1 flex-col py-10">
          <Image
            src={"/assets/icons/logo-full.svg"}
            height={1000}
            width={1000}
            alt="patient"
            className="h-10 mb-10 w-fit"
          />
          <AppointmentForm
            type="create"
            userId={userId}
            patientId={patient?.$id}
          />

          <p className="justify-items-end text-dark-600 xl:text-left">
            © 2024 CarePlus
          </p>
        </div>
      </section>

      <Image
        src={"/assets/images/appointment-img.png"}
        height={1000}
        width={1000}
        alt="appoinment"
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
}

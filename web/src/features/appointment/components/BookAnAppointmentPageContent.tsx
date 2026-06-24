"use client";

import { useRouter } from "next/navigation";
import BookAnAppointmentPanel from "@/features/appointment/components/BookAnAppointmentPanel";

const BookAnAppointmentPageContent = () => {
  const router = useRouter();

  return (
    <BookAnAppointmentPanel
      variant="page"
      showBack
      showClose={false}
      onBack={() => router.back()}
    />
  );
};

export default BookAnAppointmentPageContent;

import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import { footerPages } from "@/features/cms/data/footerPages";
import BookAnAppointmentPageContent from "@/features/appointment/components/BookAnAppointmentPageContent";

const page = footerPages.bookAnAppointment;

export const metadata: Metadata = constructMetadata({
  title: page.title,
  description: page.description,
});

export default function Page() {
  return <BookAnAppointmentPageContent />;
}

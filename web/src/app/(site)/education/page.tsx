import { redirect } from "next/navigation";
import { learnAboutDiamondsRoute } from "@/features/education/data/content";

export default function Page() {
  redirect(learnAboutDiamondsRoute);
}

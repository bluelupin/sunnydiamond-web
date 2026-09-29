import { permanentRedirect } from "next/navigation";

/** The header used to link here before search launched (C7); old links land on the listing. */
export default function Page() {
  permanentRedirect("/jewellery");
}

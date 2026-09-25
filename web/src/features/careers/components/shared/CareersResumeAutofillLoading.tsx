import { LoaderCircle } from "lucide-react";

export default function CareersResumeAutofillLoading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/90 px-6" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-4 text-center text-darkblack">
        <LoaderCircle className="size-10 animate-spin" aria-hidden="true" />
        <p className="font-larken text-2xl">Reading your resume</p>
        <p className="font-gill text-sm">Preparing your application fields…</p>
      </div>
    </div>
  );
}

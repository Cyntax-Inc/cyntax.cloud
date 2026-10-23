import { ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import Link from "next/link";

export default function Contact() {
  return (
    <section id="contact" className="px-5 pb-24 pt-4 sm:px-8 sm:pb-28 lg:px-10 lg:pb-32">
      <div className="relative mx-auto max-w-[1240px] overflow-hidden rounded-[24px] border border-violet-300/20 bg-[linear-gradient(115deg,#252045_0%,#161b36_56%,#102034_100%)] p-7 sm:p-10 lg:px-14 lg:py-14">
        <div className="pointer-events-none absolute -right-28 -top-40 h-[470px] w-[470px] rounded-full border border-white/[0.08]" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-12 -top-24 h-[350px] w-[350px] rounded-full border border-white/[0.09]" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-1 top-0 h-[250px] w-[250px] rounded-full border border-white/[0.07]" aria-hidden="true" />
        <div className="relative flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <div className="max-w-[715px]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#baacff]">Let&apos;s build what&apos;s next</p>
            <h2 className="mt-5 text-[clamp(2.3rem,4.25vw,4.25rem)] font-semibold leading-[1.1] tracking-[-0.05em] text-white">
              Your infrastructure deserves a better plan.
            </h2>
            <p className="mt-5 max-w-[590px] text-sm leading-7 text-[#b9bfd7] sm:text-base">
              Tell us what you&apos;re running, what isn&apos;t working and where you want to go. We&apos;ll start with the right conversation.
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-3 sm:flex-row lg:flex-col lg:items-stretch">
            <a
              href="mailto:hosting@cyntax.cloud?subject=Cyntax%20Cloud%20infrastructure%20consultation"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#19162c] transition-colors hover:bg-violet-100"
            >
              <Mail className="h-4 w-4" aria-hidden="true" /> Contact our team <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <Link href="/login" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10">
              Already a client? Sign in <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

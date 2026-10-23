import { ArrowUpRight, CheckCircle2, Compass, GitPullRequest, ScanSearch, Wrench } from "lucide-react";

const steps = [
  {
    icon: ScanSearch,
    number: "01",
    name: "Understand",
    description: "Map your workloads, dependencies, operational pain points and desired outcomes.",
  },
  {
    icon: Compass,
    number: "02",
    name: "Architect",
    description: "Design the cloud foundation, security posture and deployment strategy around your needs.",
  },
  {
    icon: GitPullRequest,
    number: "03",
    name: "Implement",
    description: "Build reproducible environments, delivery workflows and usable monitoring signals.",
  },
  {
    icon: Wrench,
    number: "04",
    name: "Operate & evolve",
    description: "Refine visibility, incident response, capacity planning and infrastructure over time.",
  },
];

export default function Approach() {
  return (
    <section id="approach" className="px-5 py-24 sm:px-8 sm:py-28 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-[1240px]">
        <div className="grid gap-8 lg:grid-cols-[1.07fr_0.93fr] lg:items-end lg:gap-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-300">03 / How we work</p>
            <h2 className="mt-5 text-[clamp(2.35rem,4vw,3.8rem)] font-semibold leading-[1.12] tracking-[-0.05em] text-white">
              Built for the real world.<br /> Not just the diagram.
            </h2>
          </div>
          <p className="max-w-[480px] text-[15px] leading-[1.85] text-slate-400">
            Good infrastructure is deliberate. We connect planning, implementation and day-to-day operations, with practical choices your team can understand and build upon.
          </p>
        </div>

        <div className="mt-14 grid overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0f1420] sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, number, name, description }) => (
            <div key={number} className="flex min-h-[285px] flex-col border-b border-white/[0.09] p-6 last:border-b-0 sm:p-7 sm:[&:nth-last-child(-n+2)]:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-violet-300">{number} / 04</span>
                <Icon className="h-5 w-5 text-slate-500" strokeWidth={1.7} aria-hidden="true" />
              </div>
              <div className="mt-12 h-px w-10 bg-violet-400/60" aria-hidden="true" />
              <h3 className="mt-5 text-xl font-semibold tracking-tight text-white">{name}</h3>
              <p className="mt-3 text-[13px] leading-[1.8] text-slate-400">{description}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-xl border border-violet-400/15 bg-violet-400/[0.045] px-6 py-5 sm:flex-row sm:items-center">
          <p className="flex items-start gap-3 text-[13px] leading-6 text-slate-300">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" aria-hidden="true" />
            Cloud-neutral thinking. Security-minded architecture. Workflows your team can own.
          </p>
          <a href="#contact" className="inline-flex shrink-0 items-center gap-2 text-[13px] font-semibold text-violet-300 transition hover:text-violet-200">
            Discuss a project <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

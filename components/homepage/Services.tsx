import {
  ArrowUpRight,
  Boxes,
  BrainCircuit,
  Cloud,
  Code2,
  Gauge,
  Network,
} from "lucide-react";

const services = [
  {
    icon: Cloud,
    number: "01",
    title: "Cloud hosting & infrastructure",
    description:
      "Production-minded hosting and infrastructure foundations built around your applications, workloads and business requirements.",
    tags: ["Hosting", "Infrastructure"],
  },
  {
    icon: Network,
    number: "02",
    title: "Cloud architecture",
    description:
      "Plan and modernize cloud environments with clear technical decisions across networking, security, compute and data.",
    tags: ["Architecture", "Modernization"],
  },
  {
    icon: Boxes,
    number: "03",
    title: "Orchestration & scaling",
    description:
      "Build scalable deployment foundations with container orchestration, workload management and infrastructure design.",
    tags: ["Kubernetes", "Scaling"],
  },
  {
    icon: BrainCircuit,
    number: "04",
    title: "AIOps & incident intelligence",
    description:
      "Bring BigPanda into your IT operations strategy to correlate events, add context and improve incident workflows.",
    tags: ["BigPanda", "Event correlation"],
  },
  {
    icon: Gauge,
    number: "05",
    title: "Monitoring & observability",
    description:
      "Create visibility across infrastructure and applications using tools such as Splunk, AppDynamics and SolarWinds.",
    tags: ["Monitoring", "Telemetry"],
  },
  {
    icon: Code2,
    number: "06",
    title: "DevOps & automation",
    description:
      "Reduce manual operations with repeatable delivery pipelines, infrastructure as code and pragmatic platform engineering.",
    tags: ["CI/CD", "Terraform"],
  },
];

export default function Services() {
  return (
    <section id="services" className="relative px-5 py-24 sm:px-8 sm:py-28 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end lg:gap-16">
          <div className="max-w-[750px]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-300">01 / Core capabilities</p>
            <h2 className="mt-5 text-[clamp(2.35rem,4vw,3.8rem)] font-semibold leading-[1.12] tracking-[-0.048em] text-white">
              The expertise behind<br className="hidden sm:block" /> resilient infrastructure.
            </h2>
          </div>
          <p className="max-w-[370px] text-sm leading-7 text-slate-400 sm:text-base">
            From the first architecture decision to production operations, we help teams move with less complexity and more control.
          </p>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 xl:grid-cols-3 lg:mt-14">
          {services.map(({ icon: Icon, number, title, description, tags }) => (
            <article
              key={title}
              className="group relative flex min-h-[315px] flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-[#101521] p-6 transition-colors hover:border-violet-400/30 hover:bg-[#131929] sm:p-7"
            >
              <div className="pointer-events-none absolute -right-24 -top-28 h-56 w-56 rounded-full bg-violet-500/0 blur-[75px] transition group-hover:bg-violet-500/[0.13]" aria-hidden="true" />
              <div className="relative flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/[0.09] text-violet-200">
                  <Icon className="h-5 w-5" strokeWidth={1.7} aria-hidden="true" />
                </div>
                <span className="font-mono text-xs text-slate-600">{number}</span>
              </div>
              <h3 className="relative mt-8 max-w-[300px] text-[21px] font-semibold leading-[1.25] tracking-[-0.025em] text-white">
                {title}
              </h3>
              <p className="relative mt-3 text-[13px] leading-[1.8] text-slate-400 sm:text-sm">{description}</p>
              <div className="relative mt-auto flex items-end justify-between gap-3 pt-8">
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span key={tag} className="rounded-md border border-white/[0.09] bg-white/[0.025] px-2.5 py-1 text-[10px] font-medium text-slate-400">
                      {tag}
                    </span>
                  ))}
                </div>
                <a href="#contact" aria-label={`Discuss ${title}`} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.13] text-slate-300 transition group-hover:border-violet-400/35 group-hover:text-white">
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

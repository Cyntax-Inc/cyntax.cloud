import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Cloud,
  Database,
  GitBranch,
  Layers3,
  ShieldCheck,
} from "lucide-react";

const disciplines = [
  "Cloud architecture",
  "Infrastructure orchestration",
  "Observability & AIOps",
  "DevOps automation",
];

function ArchitectureVisual() {
  return (
    <figure className="relative mx-auto w-full max-w-[590px] overflow-hidden rounded-[20px] border border-white/[0.13] bg-[#0d1220] shadow-[0_35px_100px_rgba(0,0,0,0.4)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_38%,rgba(96,72,194,0.13),transparent_60%)]" aria-hidden="true" />
      <div className="relative flex items-center justify-between border-b border-white/[0.08] bg-white/[0.025] px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-[#ec668c]/70" />
            <span className="h-2 w-2 rounded-full bg-[#e8bf6a]/70" />
            <span className="h-2 w-2 rounded-full bg-[#65c6b4]/70" />
          </div>
          <span className="font-mono text-[10px] tracking-[0.13em] text-slate-400 sm:text-xs">
            CLOUD / REFERENCE TOPOLOGY
          </span>
        </div>
        <span className="rounded-md border border-white/10 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-slate-400 sm:text-[10px]">
          Concept
        </span>
      </div>

      <div className="relative px-4 pb-5 pt-7 sm:px-7 sm:pb-7 sm:pt-9">
        <div className="mx-auto flex w-fit items-center gap-3 rounded-xl border border-violet-400/30 bg-violet-400/[0.09] px-5 py-3 shadow-[0_0_28px_rgba(138,92,246,0.08)]">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-violet-400/20 bg-violet-400/15 text-violet-200">
            <Cloud className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[11px] font-semibold text-white sm:text-xs">Cloud foundation</p>
            <p className="mt-0.5 text-[10px] text-slate-400">Network · security · access</p>
          </div>
        </div>

        <div className="mx-auto h-7 w-px bg-gradient-to-b from-violet-400/65 to-sky-400/35" aria-hidden="true" />
        <div className="mx-auto h-px w-[67%] bg-gradient-to-r from-transparent via-sky-400/45 to-transparent" aria-hidden="true" />
        <div className="mx-auto grid grid-cols-3 gap-2 sm:gap-3">
          {[
            { icon: Boxes, title: "Workloads", detail: "Compute" },
            { icon: GitBranch, title: "Orchestration", detail: "Kubernetes" },
            { icon: Database, title: "Data", detail: "Storage" },
          ].map(({ icon: Icon, title, detail }) => (
            <div key={title} className="relative pt-5">
              <div className="absolute left-1/2 top-0 h-5 w-px -translate-x-1/2 bg-sky-400/35" aria-hidden="true" />
              <div className="flex min-h-[100px] flex-col items-center justify-center rounded-xl border border-white/[0.13] bg-[#151c2a]/80 px-1 py-3 text-center sm:min-h-[112px]">
                <Icon className="h-5 w-5 text-sky-300 sm:h-6 sm:w-6" strokeWidth={1.6} aria-hidden="true" />
                <span className="mt-2 text-[10px] font-semibold text-white sm:text-xs">{title}</span>
                <span className="mt-1 text-[9px] text-slate-400 sm:text-[10px]">{detail}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto h-6 w-px bg-gradient-to-b from-sky-400/35 to-violet-400/65" aria-hidden="true" />
        <div className="flex items-center gap-3 rounded-xl border border-violet-400/25 bg-[#171528]/85 p-3 sm:p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-400/15 text-violet-200">
            <Activity className="h-5 w-5" strokeWidth={1.6} aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white">Observability & AIOps</p>
            <p className="mt-0.5 text-[10px] text-slate-400 sm:text-[11px]">Signals → correlation → response</p>
          </div>
          <div className="flex items-end gap-1" aria-hidden="true">
            {[12, 19, 14, 28, 23, 34, 20, 30].map((height, index) => (
              <span
                key={index}
                className="w-[3px] rounded-full bg-gradient-to-t from-violet-500 to-sky-300"
                style={{ height }}
              />
            ))}
          </div>
        </div>
      </div>

      <figcaption className="flex items-center justify-between gap-3 border-t border-white/[0.08] bg-[#0b101b] px-4 py-3 sm:px-6">
        <span className="flex items-center gap-2 text-[10px] text-slate-400 sm:text-[11px]">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-300" aria-hidden="true" />
          Built around your requirements
        </span>
        <span className="font-mono text-[10px] text-slate-500">CYNTAX / CLOUD</span>
      </figcaption>
    </figure>
  );
}

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/[0.08]">
      <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:linear-gradient(rgba(134,152,182,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(134,152,182,0.045)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_94%)]" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-56 -top-40 h-[600px] w-[650px] rounded-full bg-violet-600/[0.12] blur-[130px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-44 top-10 h-[650px] w-[700px] rounded-full bg-blue-600/[0.10] blur-[125px]" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-[1320px] items-center gap-14 px-5 pb-14 pt-20 sm:px-8 sm:pb-20 sm:pt-24 lg:grid-cols-[1.02fr_0.98fr] lg:gap-11 lg:px-10 lg:pb-28 lg:pt-28">
        <div className="max-w-[700px]">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-violet-400/25 bg-violet-400/[0.07] px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-200 sm:text-[11px]">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.8)]" aria-hidden="true" />
            Engineering infrastructure for what&apos;s next
          </div>

          <h1 className="mt-7 text-[clamp(2.9rem,5.1vw,5.75rem)] font-semibold leading-[1.04] tracking-[-0.065em] text-white">
            Complex cloud.
            <br />
            <span className="bg-gradient-to-r from-[#bd9bff] via-[#8abaff] to-[#9edcf8] bg-clip-text text-transparent">
              Clear direction.
            </span>
          </h1>

          <p className="mt-7 max-w-[570px] text-base leading-[1.85] text-[#aeb9ca] sm:text-[17px]">
            Cloud architecture, hosting, orchestration, DevOps and intelligent IT operations.
            We bring the engineering and operational clarity to build, monitor and scale infrastructure with confidence.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#contact"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_35px_rgba(112,75,235,0.18)] transition hover:bg-violet-400"
            >
              Discuss your infrastructure <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="#services"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg border border-white/15 bg-white/[0.035] px-6 py-3 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/[0.07]"
            >
              Explore capabilities <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/[0.09] pt-6 text-xs text-slate-400">
            <span className="inline-flex items-center gap-2"><Layers3 className="h-4 w-4 text-violet-300" aria-hidden="true" /> Multi-cloud thinking</span>
            <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-violet-300" aria-hidden="true" /> Security-minded design</span>
            <span className="inline-flex items-center gap-2"><Activity className="h-4 w-4 text-violet-300" aria-hidden="true" /> Operational visibility</span>
          </div>
        </div>

        <ArchitectureVisual />
      </div>

      <div className="relative border-t border-white/[0.08] bg-[#0a0d16]/70">
        <div className="mx-auto grid max-w-[1320px] grid-cols-2 gap-px px-5 sm:px-8 lg:grid-cols-4 lg:px-10">
          {disciplines.map((discipline, index) => (
            <div key={discipline} className="flex min-h-[70px] items-center gap-3 border-b border-white/[0.06] py-4 pr-3 sm:pr-5 lg:border-b-0 lg:pl-3 first:lg:pl-0">
              <span className="font-mono text-[10px] text-violet-400/90">0{index + 1}</span>
              <span className="text-xs font-medium text-slate-300 sm:text-[13px]">{discipline}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import {
  Activity,
  ArrowDown,
  ArrowRight,
  BrainCircuit,
  Check,
  GitMerge,
  RadioTower,
  Workflow,
} from "lucide-react";

const benefits = [
  "Connect monitoring signals with operational context.",
  "Reduce fragmented incident investigation workflows.",
  "Create clearer paths from detection to response.",
];

export default function Observability() {
  return (
    <section id="aiops" className="relative overflow-hidden border-y border-white/[0.08] bg-[#0c111c] px-5 py-24 sm:px-8 sm:py-28 lg:px-10 lg:py-32">
      <div className="pointer-events-none absolute right-[-150px] top-[-150px] h-[550px] w-[550px] rounded-full bg-violet-500/[0.09] blur-[125px]" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-[1240px] items-center gap-12 lg:grid-cols-[0.89fr_1.11fr] lg:gap-20">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-300">02 / Intelligent operations</p>
          <h2 className="mt-5 max-w-[520px] text-[clamp(2.35rem,3.9vw,3.65rem)] font-semibold leading-[1.12] tracking-[-0.05em] text-white">
            Less alert noise.<br /> More operational clarity.
          </h2>
          <p className="mt-6 max-w-[500px] text-[15px] leading-[1.85] text-slate-400">
            Monitoring generates signals. Operations need answers. We help integrate observability tooling and build AIOps workflows around <span className="font-medium text-slate-200">BigPanda</span>, so teams can turn scattered events into actionable incident context.
          </p>
          <ul className="mt-8 space-y-4">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 text-[13px] leading-6 text-slate-300 sm:text-sm">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-violet-400/30 bg-violet-500/10 text-violet-300">
                  <Check className="h-3 w-3" aria-hidden="true" />
                </span>
                {benefit}
              </li>
            ))}
          </ul>
          <a href="#contact" className="mt-9 inline-flex items-center gap-2 text-sm font-semibold text-violet-300 transition-colors hover:text-violet-200">
            Talk about your monitoring stack <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <div className="relative overflow-hidden rounded-[20px] border border-white/[0.12] bg-[#0b101b] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.24)] sm:p-6 lg:p-7">
          <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(160,174,204,0.18)_1px,transparent_1px)] [background-size:20px_20px]" aria-hidden="true" />
          <div className="relative flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.09] pb-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-violet-300" aria-hidden="true" />
              <span className="text-xs font-semibold text-slate-200">An integrated operations workflow</span>
            </div>
            <span className="font-mono text-[10px] text-slate-500">CONCEPTUAL FLOW</span>
          </div>

          <div className="relative mt-6 rounded-xl border border-white/[0.1] bg-[#111927] p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2 text-slate-400">
              <RadioTower className="h-4 w-4 text-sky-300" aria-hidden="true" />
              <span className="font-mono text-[10px] uppercase tracking-wider">Monitoring and telemetry</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Splunk", meta: "Logs & events" },
                { label: "AppDynamics", meta: "APM" },
                { label: "SolarWinds", meta: "Infrastructure" },
              ].map(({ label, meta }) => (
                <div key={label} className="min-w-0 rounded-lg border border-white/[0.1] bg-[#192333] px-2 py-3 text-center sm:px-3">
                  <p className="break-words text-[10px] font-semibold text-white sm:text-xs">{label}</p>
                  <p className="mt-1 hidden text-[10px] text-slate-400 sm:block">{meta}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex justify-center py-3 text-violet-300" aria-hidden="true">
            <ArrowDown className="h-5 w-5" strokeWidth={1.4} />
          </div>

          <div className="relative rounded-xl border border-violet-400/35 bg-[linear-gradient(130deg,#242042,#18172c)] p-4 shadow-[0_0_38px_rgba(128,89,231,0.10)] sm:p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-violet-400/25 bg-violet-500/15 text-violet-200">
                <BrainCircuit className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">BigPanda AIOps</p>
                <p className="mt-1 text-[11px] leading-5 text-slate-300 sm:text-xs">Event normalization, correlation and enrichment</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 border-t border-violet-300/15 pt-4">
              {[
                "Aggregate",
                "Correlate",
                "Prioritize",
              ].map((tag) => (
                <span key={tag} className="rounded-md border border-violet-300/20 bg-violet-300/[0.07] px-2.5 py-1.5 font-mono text-[10px] text-violet-200">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="relative flex justify-center py-3 text-violet-300" aria-hidden="true">
            <ArrowDown className="h-5 w-5" strokeWidth={1.4} />
          </div>

          <div className="relative grid grid-cols-2 gap-2 sm:gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.1] bg-[#111927] p-3 sm:p-4">
              <GitMerge className="h-5 w-5 shrink-0 text-emerald-300" aria-hidden="true" />
              <div>
                <p className="text-[11px] font-semibold text-white sm:text-xs">Incident context</p>
                <p className="mt-0.5 text-[10px] text-slate-400">Triage and escalation</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.1] bg-[#111927] p-3 sm:p-4">
              <Workflow className="h-5 w-5 shrink-0 text-emerald-300" aria-hidden="true" />
              <div>
                <p className="text-[11px] font-semibold text-white sm:text-xs">Response workflow</p>
                <p className="mt-0.5 text-[10px] text-slate-400">Runbooks and action</p>
              </div>
            </div>
          </div>
          <p className="relative mt-5 text-[10px] leading-[1.7] text-slate-500">
            Illustrative workflow. Actual integrations and response capabilities depend on your tooling, licensing and deployment scope.
          </p>
        </div>
      </div>
    </section>
  );
}

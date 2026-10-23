import { ArrowUpRight, Check } from "lucide-react";

type HostingPlan = {
  name: string;
  category: string;
  price: string;
  description: string;
  features: readonly string[];
  limitation: string;
  custom?: boolean;
};

// Proposed retail tiers. Validate resource allocations against Cyntax Cloud's
// actual hosting capacity and support costs before publishing these as SLAs.
const plans: readonly HostingPlan[] = [
  {
    name: "Static Website",
    category: "STATIC HOSTING",
    price: "$4.99",
    description: "Simple, reliable hosting for a website that does not need a server.",
    features: [
      "1 static website (HTML, CSS or JavaScript)",
      "1 GB website storage",
      "25 GB monthly data transfer",
      "Custom domain and HTTPS",
      "Static site deployment",
    ],
    limitation: "No contact forms, server functions or database.",
  },
  {
    name: "Starter App",
    category: "LIGHTWEIGHT APPLICATION",
    price: "$7.99",
    description: "For a small Next.js website with a working contact form.",
    features: [
      "1 lightweight Next.js application",
      "Server-side contact form submissions",
      "Up to 512 MB shared application memory",
      "50 GB monthly data transfer",
      "Custom domain and HTTPS",
    ],
    limitation: "Form email delivery uses a connected email provider.",
  },
  {
    name: "Growth App",
    category: "DYNAMIC APPLICATION",
    price: "$24.99",
    description: "More capacity for interactive websites, API routes and integrations.",
    features: [
      "1 Next.js or Node.js application",
      "Multiple forms and API endpoints",
      "Up to 1 GB shared application memory",
      "100 GB monthly data transfer",
      "Git deployments and environment variables",
    ],
    limitation: "Third-party APIs and email service fees are separate.",
  },
  {
    name: "Business App",
    category: "PRODUCTION APPLICATION",
    price: "$59.99",
    description: "More resources and operational visibility for a business application.",
    features: [
      "1 production web application",
      "Up to 2 GB application memory",
      "200 GB monthly data transfer",
      "External database and API connectivity",
      "Basic uptime checks and deployment support",
    ],
    limitation: "Database hosting and application development are separate.",
  },
  {
    name: "Managed Scale",
    category: "MANAGED APPLICATION HOSTING",
    price: "$149.99",
    description: "Hosting plus scheduled operational support for growing workloads.",
    features: [
      "Production and staging environments",
      "Up to 4 GB production app memory",
      "250 GB monthly data transfer",
      "Uptime monitoring and incident alerts",
      "Planned maintenance and scaling guidance",
    ],
    limitation: "24/7 on-call response and custom SLAs are quoted separately.",
  },
  {
    name: "Enterprise Cloud",
    category: "CUSTOM INFRASTRUCTURE",
    price: "Custom",
    custom: true,
    description: "Cloud architecture, orchestration and operations built for your environment.",
    features: [
      "Dedicated or multi-cloud architecture",
      "Containers and Kubernetes orchestration",
      "Infrastructure automation and DevOps",
      "Splunk, AppDynamics and SolarWinds integrations",
      "BigPanda AIOps and incident operations",
    ],
    limitation: "Infrastructure, support coverage and SLAs are custom scoped.",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="px-5 py-24 sm:px-8 sm:py-28 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-300">
              05 / Hosting plans
            </p>
            <h2 className="mt-5 text-[clamp(2.35rem,4vw,3.65rem)] font-semibold leading-[1.12] tracking-[-0.048em] text-white">
              Start simple. Scale when you need to.
            </h2>
          </div>
          <p className="max-w-[470px] text-sm leading-7 text-slate-400 sm:text-[15px]">
            Clear hosting tiers for static sites, Next.js applications and
            production workloads, with architecture and managed operations
            available as you grow.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className="group flex h-full flex-col rounded-[22px] border border-white/[0.11] bg-[#101521] px-7 py-8 transition-colors hover:border-violet-400/40 sm:px-8 sm:py-9"
            >
              <p className="text-[11px] font-semibold uppercase leading-5 tracking-[0.14em] text-violet-300/90">
                {plan.category}
              </p>
              <h3 className="mt-3 text-[19px] font-semibold leading-7 tracking-[-0.02em] text-white">
                {plan.name}
              </h3>

              <div className="mt-7 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-[44px] font-semibold leading-[1.08] tracking-[-0.05em] text-white sm:text-[46px]">
                  {plan.price}
                </span>
                {!plan.custom && (
                  <span className="text-sm leading-6 text-slate-400">/ month</span>
                )}
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-400 xl:min-h-[72px]">
                {plan.description}
              </p>

              <div className="mt-7 border-t border-white/[0.1] pt-7">
                <p className="text-[11px] font-semibold uppercase leading-5 tracking-[0.12em] text-slate-400">
                  What&apos;s included
                </p>
                <ul className="mt-5 flex flex-col gap-4">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm leading-6 text-slate-200"
                    >
                      <Check
                        className="mt-1 h-4 w-4 shrink-0 text-violet-300"
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-7 border-l-2 border-violet-400/30 pl-3 text-xs leading-[21px] text-slate-400">
                {plan.limitation}
              </p>

              <div className="mt-auto pt-8">
                <a
                  href={`mailto:hosting@cyntax.cloud?subject=${encodeURIComponent(`Cyntax Cloud ${plan.name} hosting inquiry`)}`}
                  className="flex items-center justify-between gap-4 border-t border-white/[0.1] pt-7 text-sm font-semibold leading-6 text-violet-300 transition-colors hover:text-violet-200 focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-300"
                >
                  {plan.custom ? "Discuss your infrastructure" : "Inquire about this plan"}
                  <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-7 max-w-[1050px] text-xs leading-[22px] text-slate-400">
          Prices shown are monthly starting rates for hosting, not application
          development. The resource allowances above are proposed plan limits
          and are confirmed with each deployment. Domain registration,
          databases, email delivery, external services and third-party licenses
          are separate. Additional usage and managed support beyond the listed
          scope are quoted before activation.
        </p>
      </div>
    </section>
  );
}

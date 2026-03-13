"use client";

const plans = [
  {
    name: "Individual",
    price: "$10",
    suffix: "/mo",
    users: "1 user",
    visitors: "100 visitors/month",
    websites: "1 website",
    support: false,
    integration: false,
    featured: false,
  },
  {
    name: "Professional",
    price: "$25",
    suffix: "/mo",
    users: "1 user",
    visitors: "1000 visitors/month",
    websites: "2 websites",
    support: false,
    integration: false,
    featured: false,
  },
  {
    name: "Executive",
    price: "$99",
    suffix: "/mo",
    users: "2 users",
    visitors: "10,000 visitors/month",
    websites: "2 websites",
    support: true,
    integration: false,
    featured: true,
  },
  {
    name: "Business",
    price: "$249",
    suffix: "/mo",
    users: "5 users",
    visitors: "100,000 visitors/month",
    websites: "3 websites",
    support: true,
    integration: false,
    featured: false,
  },
  {
    name: "Enterprise",
    price: "$499",
    suffix: "/mo",
    users: "10 users",
    visitors: "1M visitors/month",
    websites: "10 websites",
    support: true,
    integration: true,
    featured: false,
  },
  {
    name: "Commercial",
    price: "$999",
    suffix: "/mo",
    users: "25 users",
    visitors: "2M visitors/month",
    websites: "25 websites",
    support: true,
    integration: true,
    featured: true,
  },
];

function FeatureRow({
  text,
  included,
  dark,
}: {
  text: string;
  included: boolean;
  dark: boolean;
}) {
  return (
    <li className="flex items-center gap-3 text-lg">
      <span
        className={`text-base font-semibold ${
          included
            ? "text-violet-500"
            : dark
            ? "text-white"
            : "text-neutral-700"
        }`}
      >
        {included ? "✓" : "×"}
      </span>
      <span className={dark ? "text-white/55" : "text-neutral-500"}>{text}</span>
    </li>
  );
}

function PricingCard({
  plan,
}: {
  plan: (typeof plans)[number];
}) {
  const dark = !plan.featured;

  return (
    <div
      className={`flex min-h-[430px] flex-col rounded-2xl border px-8 py-8 ${
        dark
          ? "border-white/5 bg-[#121319] text-white"
          : "border-neutral-200 bg-[#f3f3f3] text-black"
      }`}
    >
      <div className="mb-5">
        <p className="text-[2rem] font-semibold leading-none text-violet-600">
          {plan.name}
        </p>
      </div>

      <div className="mb-8 flex items-start gap-1">
        <span className="mt-3 text-3xl">{plan.price.startsWith("$") ? "$" : ""}</span>
        <span className="text-7xl font-light leading-none">
          {plan.price.replace("$", "")}
        </span>
        <span className="mt-3 text-3xl">{plan.suffix}</span>
      </div>

      <ul className="space-y-3">
        <FeatureRow text={plan.users} included={true} dark={dark} />
        <FeatureRow text={plan.visitors} included={true} dark={dark} />
        <FeatureRow text={plan.websites} included={true} dark={dark} />
        <FeatureRow text="support" included={plan.support} dark={dark} />
        <FeatureRow
          text="third party integration"
          included={plan.integration}
          dark={dark}
        />
      </ul>

      <div className="mt-auto pt-10">
        <button
          className={`h-14 w-full rounded-md text-lg font-medium transition ${
            plan.featured
              ? "bg-violet-600 text-white hover:bg-violet-500"
              : "bg-black text-white hover:bg-neutral-900"
          }`}
        >
          SIGN UP
        </button>
      </div>
    </div>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="container-pad py-20 lg:py-28">
      <div className="grid gap-6 xl:grid-cols-4">
        <div className="xl:col-span-2">
          <div className="max-w-3xl pt-4">
            <h2 className="text-5xl font-bold tracking-tight lg:text-6xl">
              Host Pricing
            </h2>

            <p className="mt-10 max-w-2xl text-[2rem] leading-[1.35]">
              Pricing is general and subject to change based on need and requirements.
              Additional fees and charges may apply given different infrastructure needs
              for every project. Please contact us for exact pricing.
            </p>

            <p className="mt-16 text-xl font-semibold">
              Secure, Reliable Hosting that Companies can Trust.
            </p>
          </div>
        </div>

        <PricingCard plan={plans[0]} />
        <PricingCard plan={plans[1]} />

        <PricingCard plan={plans[2]} />
        <PricingCard plan={plans[3]} />
        <PricingCard plan={plans[4]} />
        <PricingCard plan={plans[5]} />
      </div>
    </section>
  );
}
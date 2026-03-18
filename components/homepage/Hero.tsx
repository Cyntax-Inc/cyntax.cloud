import SubscribeForm from "./SubscribeForm";

export default function Hero() {
  return (
    <section className="container-pad min-h-screen grid lg:grid-cols-2">
      {/* LEFT COLUMN */}
      <div className="flex flex-col justify-center">
        <span className="inline-flex w-fit items-center rounded-full bg-indigo-600/20 px-4 py-1 text-sm text-indigo-400 mb-6">
          Cloud Hosting &nbsp; "Sentinels of The Digital Garden"
        </span>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl xl:text8xl leading-[0.95]">
          Unrivaled Security
        </h1>

        <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-6xl xl:text-7xl leading-[0.95]">
          Unmatched Privacy
        </h2>

        {/* CTA */}
        <div className="mt-10 flex max-w-md">
          <SubscribeForm
            source="hero"
            placeholder="Email"
            buttonText="Get Started"
            formClassName="flex w-full"
            inputClassName="flex-1 rounded-l-md border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-md text-white placeholder:text-neutral-400 shadow-sm focus:border-indigo-500 focus:outline-none"
            buttonClassName="rounded-r-md bg-indigo-600 px-5 py-2.5 text-md font-medium text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-70"
          />
        </div>

        <p className="mt-2 text-xs text-neutral-500">
          No credit card required. Bitcoin & Crypto Accepted
        </p>
      </div>

      {/* RIGHT COLUMN (empty for now) */}
      <div />
    </section>
  );
}
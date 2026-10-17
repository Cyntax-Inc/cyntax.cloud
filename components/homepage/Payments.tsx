"use client";

const paymentOptions = [
  { name: "Stripe", mark: "S" },
  { name: "Link", mark: "L" },
  { name: "Klarna", mark: "K" },
  { name: "Amazon Pay", mark: "A" },
  { name: "Credit Card", mark: "CC" },
  { name: "Cash App Pay", mark: "CA" },
  { name: "Crypto", mark: "₿" },
  { name: "Direct Bank Account", mark: "BA" },
];

export default function PaymentNetwork() {
  return (
    <section id="payments" className="container-pad py-20 lg:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-400">
          Payment Options
        </p>

        <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Flexible billing across trusted payment methods.
        </h2>

        <p className="mt-4 text-lg leading-8">
          Accept secure payments through modern checkout rails including
          wallets, buy now pay later, major cards, direct bank payments, and
          crypto.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4">
        {paymentOptions.map(({ name, mark }) => (
          <div key={name} className="flex flex-col items-center text-center">
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-neutral-900/80 shadow-[0_0_30px_rgba(139,92,246,0.08)] backdrop-blur transition duration-300 hover:border-violet-400/30 hover:shadow-[0_0_40px_rgba(139,92,246,0.16)] sm:h-28 sm:w-28">
              <div className="absolute inset-2 rounded-full bg-[radial-gradient(circle_at_top,rgba(167,139,250,0.18),transparent_65%)]" />
              <span className="relative text-lg font-semibold tracking-wide text-white sm:text-xl">
                {mark}
              </span>
            </div>

            <span className="mt-4 max-w-[10rem] text-sm font-medium leading-6 text-neutral-200">
              {name}
            </span>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-6 text-neutral-400">
        Payment method availability may vary by region, customer location, and
        billing configuration.
      </p>
    </section>
  );
}
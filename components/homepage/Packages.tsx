export default function HostingPackagesPreview() {
  return (
    <section className="w-full px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-7xl">
        {/* heading */}
        <div className="max-w-5xl">
          <h2 className="text-4xl font-black leading-[0.95] tracking-tight sm:text-5xl lg:text-7xl">
            Empowering businesses with
            <br />

            <span className="relative inline-block">
                Cyntax Cloud
                <span className="absolute left-0 bottom-1 h-[3px] w-full bg-violet-500" />
            </span>
            &apos;s secure,
            <br />

            private, cloud hosting
            <br />
            solutions
            </h2>
        </div>

        {/* cards */}
        <div className="mt-24 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/5 bg-[#12131a] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] sm:p-8">
            <div className="inline-flex rounded-sm bg-violet-600 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
              Individual
            </div>

            <p className="mt-12 max-w-xl text-xl leading-9 text-white/30 sm:text-2xl">
              Enabling <span className="font-semibold text-white">Individuals</span> to get
              online fast and contribute to the world wide web. Check out our
              individual packages below!
            </p>

            <div className="mt-10">
              <a
                href="/pricing"
                className="inline-flex items-center justify-center rounded-md bg-black px-7 py-3 text-sm font-medium text-white transition hover:bg-white hover:text-black"
              >
                Pricing
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#12131a] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] sm:p-8">
            <div className="inline-flex rounded-sm bg-violet-600 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
              Teams
            </div>

            <p className="mt-12 max-w-xl text-xl leading-9 text-white/30 sm:text-2xl">
              Emboldening <span className="font-semibold text-white">Teams</span> to focus on
              important goals instead of deployment issues and deadlines. Check
              out our team packages below!
            </p>

            <div className="mt-10">
              <a
                href="/pricing"
                className="inline-flex items-center justify-center rounded-md bg-black px-7 py-3 text-sm font-medium text-white transition hover:bg-white hover:text-black"
              >
                Pricing
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
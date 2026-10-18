const reviews = [
  {
    name: "David M.",
    role: "Startup Founder",
    text: "Cyntax Cloud delivered a level of reliability and performance we couldn't achieve anywhere else. Deployment was seamless and their infrastructure is rock solid.",
  },
  {
    name: "Priya S.",
    role: "Engineering Lead",
    text: "Security and uptime were critical for our platform. Cyntax Cloud provided both. Their systems feel engineered for serious workloads.",
  },
  {
    name: "Jordan L.",
    role: "Product Director",
    text: "From infrastructure to tooling, everything just works. The platform is fast, stable, and incredibly easy to scale.",
  },
];

export default function Reviews() {
  return (
    <section id="reviews" className="w-full py-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-4xl font-bold tracking-tight">
          Trusted by Builders
        </h2>

        <p className="mt-4 max-w-xl text-muted-foreground">
          Organizations rely on Cyntax Cloud for secure infrastructure, high
          availability, and performance at scale.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {reviews.map((r) => (
            <figure
              key={r.name}
              className="rounded-2xl border border-neutral-800 bg-neutral-950 p-8 shadow-sm"
            >
              <blockquote className="leading-relaxed text-white/85">
                “{r.text}”
              </blockquote>

              <figcaption className="mt-6">
                <p className="font-semibold text-white">{r.name}</p>
                <p className="text-sm text-white/50">{r.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
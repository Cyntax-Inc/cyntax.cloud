import { CloudLightning, HardDrive, Database } from "lucide-react";

const services = [
  {
    title: "Cloud Computing",
    description:
      "Discover the limitless possibilities of cloud services with cutting-edge solutions designed to optimize performance and scale seamlessly.",
    icon: CloudLightning,
  },
  {
    title: "Web Hosting",
    description:
      "Elevate user experiences while we handle the technicalities. Unleash the full potential of your online business with our web hosting solutions.",
    icon: HardDrive,
  },
  {
    title: "Data Storage",
    description:
      "Embrace a scalable infrastructure that adapts to your growing needs, ensuring your data is always within reach with unparalleled security and efficiency.",
    icon: Database,
  },
];

export default function Services() {
  return (
    <section id="services" className="container-pad py-28">
      <div className="grid gap-10 lg:grid-cols-3">
        {services.map(({ title, description, icon: Icon }) => (
          <div
            key={title}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 transition hover:border-white/20 hover:bg-white/[0.05]"
          >
            {/* icon circle */}
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
              <Icon className="h-8 w-8 text-white" />
            </div>

            {/* title */}
            <h3 className="text-2xl font-semibold text-white">
              {title}
            </h3>

            {/* description */}
            <p className="mt-4 text-white/50 leading-relaxed">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
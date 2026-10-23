import AwsIcon from "../icons/AwsIcon";
import CloudflareIcon from "../icons/CloudflareIcon";
import DigitalOceanIcon from "../icons/DigitalOceanIcon";
import DockerIcon from "../icons/DockerIcon";
import GithubIcon from "../icons/GithubIcon";
import GitlabIcon from "../icons/GitlabIcon";
import GoogleCloudIcon from "../icons/GoogleCloudIcon";
import InfluxDbIcon from "../icons/InfluxDbIcon";
import JenkinsIcon from "../icons/JenkinsIcon";
import KubernetesIcon from "../icons/KubernetesIcon";
import MongoDbIcon from "../icons/MongoDbIcon";
import TerraformIcon from "../icons/TerraformIcon";

const tools = [
  { name: "AWS", Icon: AwsIcon },
  { name: "Google Cloud", Icon: GoogleCloudIcon },
  { name: "DigitalOcean", Icon: DigitalOceanIcon },
  { name: "Cloudflare", Icon: CloudflareIcon },
  { name: "Kubernetes", Icon: KubernetesIcon },
  { name: "Docker", Icon: DockerIcon },
  { name: "Terraform", Icon: TerraformIcon },
  { name: "GitHub", Icon: GithubIcon },
  { name: "GitLab", Icon: GitlabIcon },
  { name: "Jenkins", Icon: JenkinsIcon },
  { name: "MongoDB", Icon: MongoDbIcon },
  { name: "InfluxDB", Icon: InfluxDbIcon },
];

export default function Tooling() {
  return (
    <section id="tooling" className="border-y border-white/[0.08] bg-[#0c111c] px-5 py-24 sm:px-8 sm:py-28 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-300">04 / The ecosystem</p>
            <h2 className="mt-5 max-w-[680px] text-[clamp(2.35rem,4vw,3.65rem)] font-semibold leading-[1.12] tracking-[-0.048em] text-white">
              Your stack. Our expertise.
            </h2>
          </div>
          <p className="max-w-[420px] text-sm leading-7 text-slate-400 sm:text-[15px]">
            Modern infrastructure spans providers, platforms and open-source tools. We work across established ecosystems rather than forcing a single stack.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 xl:grid-cols-6">
          {tools.map(({ name, Icon }) => (
            <div
              key={name}
              className="flex min-h-[128px] flex-col items-center justify-center gap-3 rounded-xl border border-white/[0.09] bg-[#111826] p-4 text-center transition-colors hover:border-violet-400/30 hover:bg-[#171f2f]"
            >
              <span className="flex h-10 w-12 items-center justify-center">
                <Icon className="h-9 w-9" />
              </span>
              <span className="text-xs font-medium text-slate-200">{name}</span>
            </div>
          ))}
        </div>
        <p className="mt-5 text-[11px] leading-6 text-slate-500">
          Technology names represent tooling experience and solution options; they do not imply formal vendor partnerships. Integration scope is determined per project.
        </p>
      </div>
    </section>
  );
}

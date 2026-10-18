"use client";

import TerraformIcon from "../../components/icons/TerraformIcon";
import AwsIcon from "../../components/icons/AwsIcon";
import GoogleCloudIcon from "../../components/icons/GoogleCloudIcon";
import DigitalOceanIcon from "../../components/icons/DigitalOceanIcon";
import UbuntuIcon from "../../components/icons/UbuntuIcon";
import CentosIcon from "../../components/icons/CentosIcon";
import RedHatLinuxIcon from "../../components/icons/RedHatLinuxIcon";
import CloudflareIcon from "../../components/icons/CloudflareIcon";
import KubernetesIcon from "../../components/icons/KubernetesIcon";
import DockerIcon from "../../components/icons/DockerIcon";
import PodmanIcon from "../../components/icons/PodmanIcon";
import JenkinsIcon from "../../components/icons/JenkinsIcon";
import GithubIcon from "../../components/icons/GithubIcon";
import GitlabIcon from "../../components/icons/GitlabIcon";
import SqlIcon from "../../components/icons/SqlIcon";
import InfluxDbIcon from "../../components/icons/InfluxDbIcon";
import MongoDbIcon from "../../components/icons/MongoDbIcon";
import FirebaseIcon from "../../components/icons/FirebaseIcon";

const tools = [
  { name: "Terraform", Icon: TerraformIcon },
  { name: "AWS", Icon: AwsIcon },
  { name: "Google Cloud", Icon: GoogleCloudIcon },
  { name: "DigitalOcean", Icon: DigitalOceanIcon },
  { name: "Ubuntu", Icon: UbuntuIcon },
  { name: "CentOS", Icon: CentosIcon },
  { name: "Red Hat Enterprise", Icon: RedHatLinuxIcon },
  { name: "Cloudflare", Icon: CloudflareIcon },
  { name: "Kubernetes", Icon: KubernetesIcon },
  { name: "Docker", Icon: DockerIcon },
  { name: "Podman", Icon: PodmanIcon },
  { name: "Jenkins", Icon: JenkinsIcon },
  { name: "GitHub", Icon: GithubIcon },
  { name: "GitLab", Icon: GitlabIcon },
  { name: "SQL", Icon: SqlIcon },
  { name: "InfluxDB", Icon: InfluxDbIcon },
  { name: "MongoDB", Icon: MongoDbIcon },
  { name: "Firebase", Icon: FirebaseIcon },
];

export default function ToolingNetwork() {
  return (
    <section id="tooling" className="container-pad py-20 lg:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-400">
          Tooling Capabilities
        </p>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Built on proven infrastructure and platform tooling.
        </h2>
        <p className="mt-4 text-lg leading-8">
          A modern stack for cloud infrastructure, orchestration, automation,
          containers, and data systems.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
        {tools.map(({ name, Icon }) => (
          <div
            key={name}
            className="flex flex-col items-center text-center"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-neutral-900/80 shadow-[0_0_30px_rgba(255,255,255,0.04)] backdrop-blur sm:h-28 sm:w-28">
              <Icon className="h-10 w-10 sm:h-12 sm:w-12" />
            </div>

            <span className="mt-4 text-sm font-medium">
              {name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
import type { Metadata } from "next";
import Navbar from "../components/homepage/Navbar";
import Hero from "../components/homepage/Hero";
import Services from "../components/homepage/Services";
import Observability from "../components/homepage/Observability";
import Approach from "../components/homepage/Approach";
import Tooling from "../components/homepage/Tooling";
import Pricing from "../components/homepage/Pricing";
import Contact from "../components/homepage/Contact";
import Footer from "../components/homepage/Footer";

export const metadata: Metadata = {
  title: "Cyntax Cloud | Cloud Architecture, AIOps & DevOps",
  description:
    "Cloud hosting, architecture, orchestration, infrastructure scaling, BigPanda AIOps, monitoring, observability and DevOps from Cyntax Cloud.",
};

export default function Page() {
  return (
    <main className="cloud-home min-h-screen overflow-x-clip bg-[#070a11] text-[#f4f5fa] antialiased selection:bg-violet-500/30">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-5 focus:top-5 focus:z-[100] focus:rounded-lg focus:bg-violet-500 focus:px-4 focus:py-3 focus:text-white"
      >
        Skip to content
      </a>
      <Navbar />
      <div id="main-content">
        <Hero />
        <Services />
        <Observability />
        <Approach />
        <Tooling />
        <Pricing />
        <Contact />
      </div>
      <Footer />
    </main>
  );
}

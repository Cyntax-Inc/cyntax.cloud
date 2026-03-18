"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    title: "Commanding the Digital Realm",
    description:
      "Where web hosting, security, and administration converge for unparalleled digital dominance.",
    cta: "Learn More",
    href: "#",
  },
  {
    title: "Fostering Confidentiality and Insight",
    description:
      "We prioritize privacy where our advanced systems offer valuable insights without compromising confidentiality.",
    cta: "Learn More",
    href: "#",
  },
  {
    title: "Unlocking the Power of the Cloud",
    description:
      "Experience the future with Cyntax Cloud's innovative cloud computing solutions.",
    cta: "Learn More",
    href: "#",
  },
];

export default function MessagingCarousel() {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent((p) => (p === 0 ? slides.length - 1 : p - 1));
  };

  const nextSlide = () => {
    setCurrent((p) => (p === slides.length - 1 ? 0 : p + 1));
  };

  const slide = slides[current];

  return (
    <section className="w-full py-20 lg:py-28">
      <div className="relative w-full overflow-hidden border-y border-white/10 bg-[linear-gradient(90deg,#17181f_0%,#14151b_45%,#111218_100%)] min-h-[420px] sm:min-h-[500px] lg:min-h-[560px]">

        {/* subtle side glow */}
        <div className="absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-white/[0.02] to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-white/[0.02] to-transparent pointer-events-none" />

        {/* navigation */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 text-white transition hover:border-violet-400 hover:text-violet-300"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 text-white transition hover:border-violet-400 hover:text-violet-300"
        >
          <ChevronRight size={22} />
        </button>

        {/* centered content */}
        <div className="flex h-full min-h-[420px] sm:min-h-[500px] lg:min-h-[560px] items-center justify-center text-center px-6">
          <div key={current} className="max-w-5xl animate-[fadeIn_.35s_ease]">
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl">
              {slide.title}
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-white/30 text-base sm:text-lg lg:text-xl">
              {slide.description}
            </p>

            <div className="mt-10">
              <a
                href={slide.href}
                className="inline-flex items-center justify-center rounded-md bg-violet-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
              >
                {slide.cta}
              </a>
            </div>
          </div>
        </div>

        {/* indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2.5 rounded-full transition ${
                current === i
                  ? "w-8 bg-violet-400"
                  : "w-2.5 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
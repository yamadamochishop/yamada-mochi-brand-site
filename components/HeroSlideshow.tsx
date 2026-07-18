"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  {
    src: "/images/latest-sixset-hero.webp",
    position: "object-[68%_center] md:object-center",
  },
  {
    src: "/images/latest-sixset-field.webp",
    position: "object-[72%_center] md:object-center",
  },
] as const;

export function HeroSlideshow() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

    const interval = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 6500);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0" aria-hidden="true">
      {slides.map((slide, index) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt=""
          fill
          priority={index === 0}
          sizes="100vw"
          className={`object-cover transition-opacity duration-[1400ms] ease-in-out ${slide.position} ${active === index ? "opacity-100" : "opacity-0"}`}
        />
      ))}
    </div>
  );
}

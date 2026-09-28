"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Effects() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const elements = [
      ...document.querySelectorAll<HTMLElement>("[data-reveal]"),
    ];
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    elements.forEach((el) => {
      if (el.getBoundingClientRect().top > innerHeight)
        el.classList.add("will-reveal");
      observer.observe(el);
    });
    const steps = [...document.querySelectorAll<HTMLElement>("[data-step]")];
    const stepObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) =>
          e.target.classList.toggle("step-active", e.isIntersecting),
        ),
      { rootMargin: "-18% 0px -25% 0px" },
    );
    steps.forEach((el) => stepObserver.observe(el));
    return () => {
      observer.disconnect();
      stepObserver.disconnect();
      elements.forEach((el) => el.classList.remove("will-reveal"));
    };
  }, [pathname]);
  return null;
}

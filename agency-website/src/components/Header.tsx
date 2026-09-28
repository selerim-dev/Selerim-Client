"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
const links = [
  ["/case-studies", "Concepts"],
  ["/pricing", "Offers"],
  ["/how-we-work", "Process"],
  ["/about", "Studio"],
];
export default function Header() {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const path = usePathname();
  useEffect(() => {
    if (open) {
      dialog.current?.showModal();
      const before = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = before;
      };
    }
    dialog.current?.close();
  }, [open]);
  const close = () => {
    setOpen(false);
    requestAnimationFrame(() => trigger.current?.focus());
  };
  return (
    <>
      <header className="site-header">
        <nav className="wrap nav-inner" aria-label="Main navigation">
          <Link href="/" className="wordmark" aria-label="Selerim studio home">
            <Image src="/logo.png" alt="" width={30} height={30} priority />
            <span>
              selerim <em>studio</em>
            </span>
          </Link>
          <div className="desktop-nav">
            {links.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                aria-current={path === href ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="nav-actions">
            <ThemeToggle />
            <Link href="/contact" className="nav-cta">
              Start an audit <span aria-hidden="true">↗</span>
            </Link>
            <button
              ref={trigger}
              type="button"
              aria-expanded={open}
              aria-controls="mobile-navigation"
              aria-label="Open menu"
              className="menu-toggle"
              onClick={() => setOpen(true)}
            >
              <span aria-hidden="true">☰</span>
            </button>
          </div>
        </nav>
      </header>
      <dialog
        ref={dialog}
        id="mobile-navigation"
        className="mobile-dialog"
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const items = event.currentTarget.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled])',
          );
          const first = items[0];
          const last = items[items.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClose={() => {
          if (open) setOpen(false);
        }}
        aria-label="Navigation menu"
      >
        <div className="mobile-dialog-top">
          <span className="wordmark">
            selerim <em>studio</em>
          </span>
          <button
            type="button"
            className="menu-toggle"
            aria-label="Close menu"
            onClick={close}
          >
            ✕
          </button>
        </div>
        <nav aria-label="Mobile navigation">
          {links.map(([href, label], i) => (
            <Link key={href} href={href} onClick={close}>
              <span>0{i + 1}</span>
              {label}
            </Link>
          ))}
          <Link href="/contact" onClick={close}>
            <span>05</span>Contact
          </Link>
          <Link
            href="/contact"
            className="action action-primary"
            onClick={close}
          >
            Get an AI opportunity audit ↗
          </Link>
        </nav>
        <p>Houston, TX · Founder-led · Async-first</p>
      </dialog>
    </>
  );
}

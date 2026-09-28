import Link from "next/link";
import Image from "next/image";
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-top">
          <div>
            <Link
              href="/"
              className="wordmark"
              aria-label="Selerim studio home"
            >
              <Image src="/logo.png" width={28} height={28} alt="" />
              <span>
                selerim <em>studio</em>
              </span>
            </Link>
            <p>
              AI agents for your business.
              <br />
              Secure. Confidential. Built for growth.
            </p>
          </div>
          <div>
            <p className="eyebrow">Let’s put your ideas to work</p>
            <a className="footer-email" href="mailto:admin@selerim.com">
              admin@selerim.com <span aria-hidden="true">↗</span>
            </a>
            <p>
              Houston, TX · Serving US businesses
              <br />
              Async-first. A reply within 24 hours.
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Selerim. All rights reserved.</p>
          <nav aria-label="Footer navigation">
            <Link href="/contact">Contact</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </nav>
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}

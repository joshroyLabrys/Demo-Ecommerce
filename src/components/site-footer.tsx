import Link from "next/link";

const footerLinks = {
  shop: [
    { name: "All Products", href: "/categories" },
    { name: "Electronics", href: "/categories/electronics" },
    { name: "Fashion", href: "/categories/fashion" },
    { name: "Home & Living", href: "/categories/home-living" },
    { name: "Wellness", href: "/categories/wellness" },
  ],
  company: [
    { name: "About", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Press", href: "#" },
    { name: "Sustainability", href: "#" },
  ],
  support: [
    { name: "Contact Us", href: "#" },
    { name: "FAQs", href: "#" },
    { name: "Shipping & Returns", href: "#" },
    { name: "Size Guide", href: "#" },
  ],
};

export function SiteFooter() {
  return (
    <footer className="border-t border-border/30 bg-stone-900 text-stone-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
                <span className="text-xs font-bold text-stone-900">M</span>
              </div>
              <span className="text-xl font-semibold tracking-tight text-white">MERIDIAN</span>
            </Link>
            <p className="text-sm leading-relaxed text-stone-400">
              Curated collections of premium products for the modern lifestyle. Quality, design, and intention in every detail.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-stone-500">
              Shop
            </h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-400 transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-stone-500">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-400 transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-stone-500">
              Support
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-400 transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-stone-800 pt-8 sm:flex-row">
          <p className="text-xs text-stone-500">
            &copy; {new Date().getFullYear()} MERIDIAN. All rights reserved. This is a demo store.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-stone-500 transition-colors hover:text-stone-300">
              Privacy Policy
            </Link>
            <Link href="#" className="text-xs text-stone-500 transition-colors hover:text-stone-300">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

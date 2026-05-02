"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 flex items-center justify-between"
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 group">
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="w-7 h-7 rounded-full bg-forest flex items-center justify-center"
          aria-hidden
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 1L9.5 5.5H13L10 8.5L11 13L7 10.5L3 13L4 8.5L1 5.5H4.5L7 1Z"
              fill="#F0EDE8"
              stroke="#F0EDE8"
              strokeWidth="0.5"
            />
          </svg>
        </motion.div>
        <span className="font-display font-bold text-ink text-lg tracking-tight">
          Survikit
        </span>
      </Link>

      {/* Nav links */}
      <nav className="hidden md:flex items-center gap-8">
        <NavLink href="/#scenarios" active={false}>
          Nos scénarios
        </NavLink>
        <NavLink href="/#science" active={false}>
          La science
        </NavLink>
        <NavLink href="/#histoire" active={false}>
          72 heures
        </NavLink>
        <NavLink href="/guide" active={pathname === "/guide"}>
          Guide 72h
        </NavLink>
      </nav>

      {/* CTA */}
      <Link
        href="/configurer"
        className="hidden md:inline-flex items-center gap-2 bg-forest text-paper px-5 py-2.5 rounded-full text-sm font-medium hover:bg-forest-mid transition-colors duration-200"
      >
        Composer mon kit
        <span aria-hidden>→</span>
      </Link>

      {/* Mobile CTA */}
      <Link
        href="/configurer"
        className="md:hidden text-sm font-medium text-forest border border-forest/30 px-4 py-2 rounded-full"
      >
        Mon kit
      </Link>
    </motion.header>
  );
}

function NavLink({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors duration-200 hover:text-forest relative group ${
        active ? "text-forest" : "text-ink-muted"
      }`}
    >
      {children}
      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-forest transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}

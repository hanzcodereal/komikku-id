'use client';
import { Home, Search, CalendarDays, Info } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Navbar() {
  const { pathname } = useLocation();
  if (pathname.startsWith('/read')) return null;

  const links = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/search', icon: Search, label: 'Search' },
    { href: '/jadwal', icon: CalendarDays, label: 'Jadwal' },
    { href: '/info', icon: Info, label: 'Info' },
  ];

  return (
    <nav className="fixed bottom-0 w-full max-w-5xl mx-auto bg-neutral-900/90 backdrop-blur-lg border-t border-neutral-800 flex justify-around items-center h-16 pb-safe z-40 md:left-1/2 md:-translate-x-1/2 md:border-x md:border-neutral-900/50">
      {links.map((link) => {
        const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
        return (
          <Link key={link.href} to={link.href} className="relative flex flex-col items-center justify-center w-full h-full space-y-1">
            {active && (
              <motion.div
                layoutId="nav-active-pill"
                className="absolute inset-x-2 inset-y-1 bg-yellow-400/10 rounded-xl -z-10"
                transition={{ type: "spring", stiffness: 260, damping: 32, mass: 0.8 }}
              />
            )}
            <div className={twMerge(
              "flex flex-col items-center justify-center space-y-1 transition-colors duration-300 ease-out",
              active ? "text-yellow-400" : "text-neutral-400 hover:text-neutral-100"
            )}>
              <link.icon size={20} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{link.label}</span>
            </div>
          </Link>
        )
      })}
    </nav>
  );
}

"use client";

import { ReactNode } from "react";
import Link from 'next/link';
import { LayoutDashboard, Newspaper, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import AuthButton from "@/components/auth-button";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const navLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="w-64 bg-background border-r p-4 flex flex-col justify-between">
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-primary">CV Craft Admin</h2>
            </div>
            <nav className="space-y-2">
            {navLinks.map(link => (
                <Link
                key={link.href}
                href={link.href}
                className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                    pathname === link.href && "bg-muted text-primary"
                )}
                >
                <link.icon className="h-4 w-4" />
                {link.label}
                </Link>
            ))}
            </nav>
        </div>
        <div className="flex items-center justify-between border-t pt-4">
             <AuthButton />
             <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
                Exit Admin
             </Link>
        </div>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}

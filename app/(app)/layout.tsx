"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClerkProvider, UserButton, SignInButton, SignUpButton, SignOutButton, useUser } from "@clerk/nextjs";

import { ThemeProvider, useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

import {
  Upload,
  Share2,
  Home,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
} from "lucide-react";

// Client-only theme toggle
function ThemeToggle({ collapsed }: { collapsed: boolean }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <Button
      variant="outline"
      className={`w-full gap-2 ${collapsed ? "justify-center" : ""}`}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <Sun /> : <Moon />}
      {!collapsed && (theme === "dark" ? "Light Mode" : "Dark Mode")}
    </Button>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { isSignedIn } = useUser();

  const navItems = [
    { label: "Home", href: "/home", icon: Home },
    { label: "Video Upload", href: "/video-upload", icon: Upload },
    { label: "Social Share", href: "/social-share", icon: Share2 },
  ];

  return (
    <ClerkProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <div className="flex min-h-screen bg-gradient-to-br from-zinc-50 via-zinc-100 to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 relative">
          
          {/* 🧭 Sidebar */}
          <aside
            className={`border-r border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 backdrop-blur transition-all duration-300
            ${collapsed ? "w-20" : "w-64"}`}
          >
            <div className="flex h-full flex-col justify-between p-4">
              
              {/* Top */}
              <div>
                <div className="flex items-center justify-between mb-8">
                  {!collapsed && <h2 className="text-xl font-bold">🎬 Video SaaS</h2>}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCollapsed(!collapsed)}
                  >
                    {collapsed ? <ChevronRight /> : <ChevronLeft />}
                  </Button>
                </div>

                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                      <Link key={item.href} href={item.href}>
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          className={`w-full justify-start gap-3 ${
                            collapsed && "justify-center"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          {!collapsed && item.label}
                        </Button>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom: only theme toggle */}
              <div className="mt-auto">
                <ThemeToggle collapsed={collapsed} />
              </div>
            </div>
          </aside>

          {/* 📄 Page content */}
          <main className="flex-1 p-6 relative">
            {/* 👤 Top-right user/signin buttons */}
            {/* 👤 Top-right user/signin/logout */}
          <div className="absolute top-4 right-4 flex gap-4 items-center z-50">
            {!isSignedIn ? (
            <>
            <SignInButton>
             <Button variant="outline" size="sm">Sign In</Button>
            </SignInButton>
            <SignUpButton>
             <Button variant="default" size="sm">Sign Up</Button>
            </SignUpButton>
            </>
            ) : (
           <div className="flex items-center gap-2">
            <UserButton afterSignOutUrl="/sign-in" />
             <span className="hidden sm:inline font-medium">Profile</span>
            <SignOutButton>
            <Button variant="destructive" size="sm">Logout</Button>
            </SignOutButton>
            </div>
            )}
          </div>


            {children}
          </main>
        </div>
      </ThemeProvider>
    </ClerkProvider>
  );
}

"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { mainNav, navSections, type NavItem } from "@/lib/navigation"
import { SignOutButton, UserButton } from "@clerk/nextjs"
import { LogOut, Menu, X } from "lucide-react"
import ThemeToggle from "@/components/layout/ThemeToggle"

function NavLink({ item, isActive, onClick }: { item: NavItem; isActive: boolean; onClick?: () => void }) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-blue-600 text-white"
          : "text-slate-500 hover:bg-white/20 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
      )}
    >
      <Icon className="h-4 w-4" />
      {item.label}
    </Link>
  )
}

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false)
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [])

  const close = useCallback(() => setIsOpen(false), [])

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-white/30 bg-white/80 shadow-lg backdrop-blur-xl transition-colors hover:bg-white lg:hidden dark:border-slate-700/40 dark:bg-slate-900/80 dark:hover:bg-slate-900",
          isOpen && "left-68"
        )}
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {isOpen ? <X className="h-5 w-5 text-slate-700 dark:text-slate-300" /> : <Menu className="h-5 w-5 text-slate-700 dark:text-slate-300" />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={close}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/30 bg-linear-to-br from-white/30 to-slate-100/30 backdrop-blur-xl transition-transform duration-200 ease-in-out lg:static lg:z-auto lg:translate-x-0 dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/20 px-6 dark:border-slate-700/30">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
              AD
            </div>
            <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">Analytics</span>
          </div>
          <ThemeToggle />
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          <p className="px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">General</p>
          <NavLink item={mainNav[0]} isActive={pathname === mainNav[0].href} onClick={close} />

          {navSections.map((section) => (
            <div key={section.title}>
              <p className="mt-6 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                {section.title}
              </p>
              {section.items.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  isActive={pathname === item.href || pathname.startsWith(item.href + "/")}
                  onClick={close}
                />
              ))}
            </div>
          ))}
        </nav>

        <div className="border-t border-white/20 p-4 dark:border-slate-700/30">
          <div className="mb-2 flex items-center gap-3 px-3 py-2">
            <UserButton />
            <span className="text-sm text-slate-600 dark:text-slate-400">Mi cuenta</span>
          </div>
          <SignOutButton redirectUrl="/sign-in">
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-white/20 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white">
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </button>
          </SignOutButton>
        </div>
      </aside>
    </>
  )
}

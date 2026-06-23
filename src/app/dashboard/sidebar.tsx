"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { mainNav, navSections, type NavItem } from "@/lib/navigation"
import { SignOutButton, UserButton } from "@clerk/nextjs"
import { LogOut, ChevronRight } from "lucide-react"
import ThemeToggle from "@/components/layout/ThemeToggle"

function collectAllPaths(items: NavItem[]): string[] {
  const paths: string[] = []
  for (const item of items) {
    if (item.href) paths.push(item.href)
    if (item.children) paths.push(...collectAllPaths(item.children))
  }
  return paths
}

function getSiblingPrefixes(allPaths: string[], baseHref: string): string[] {
  return [
    ...new Set(
      allPaths
        .filter((p) => p !== baseHref && p.startsWith(baseHref + "/"))
        .map((p) => p.slice(baseHref.length + 1).split("/")[0])
    ),
  ]
}

function isPathActive(href: string, currentPath: string, allPaths: string[]): boolean {
  if (currentPath === href) return true
  if (!currentPath.startsWith(href + "/")) return false
  const nextSegment = currentPath.slice(href.length + 1).split("/")[0]
  const siblings = getSiblingPrefixes(allPaths, href)
  return !siblings.includes(nextSegment)
}

function NavLink({
  item,
  currentPath,
  allPaths,
  depth = 0,
}: {
  item: NavItem
  currentPath: string
  allPaths: string[]
  depth?: number
}) {
  const Icon = item.icon
  const active = isPathActive(item.href!, currentPath, allPaths)
  return (
    <Link
      href={item.href!}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        depth > 0 && "ml-5",
        active
          ? "bg-blue-600 text-white"
          : "text-slate-500 hover:bg-white/20 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
      )}
    >
      <Icon className="h-4 w-4" />
      {item.label}
    </Link>
  )
}

function NavGroup({
  item,
  currentPath,
  allPaths,
}: {
  item: NavItem
  currentPath: string
  allPaths: string[]
}) {
  const [expanded, setExpanded] = useState(false)
  const isActive = item.children?.some((child) =>
    child.href ? isPathActive(child.href, currentPath, allPaths) : false
  )

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-blue-600 text-white"
            : "text-slate-500 hover:bg-white/20 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
        )}
      >
        <item.icon className="h-4 w-4" />
        <span className="flex-1 text-left">{item.label}</span>
        <ChevronRight
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-300",
            expanded && "rotate-90"
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          expanded ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="mt-1 space-y-1">
          {item.children!.map((child) => (
            <NavLink
              key={child.href}
              item={child}
              currentPath={currentPath}
              allPaths={allPaths}
              depth={1}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Sidebar() {
  const pathname = usePathname()
  const allPaths = useMemo(() => {
    const sectionPaths = navSections.flatMap((s) => collectAllPaths(s.items))
    return [...sectionPaths, ...mainNav.map((n) => n.href!).filter(Boolean)]
  }, [])

  return (
    <aside className="flex h-full w-64 flex-col border-r border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
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
        <NavLink item={mainNav[0]} currentPath={pathname} allPaths={allPaths} />

        {navSections.map((section) => (
          <div key={section.title}>
            <p className="mt-6 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
              {section.title}
            </p>
            {section.items.map((item) =>
              item.children ? (
                <NavGroup key={item.label} item={item} currentPath={pathname} allPaths={allPaths} />
              ) : (
                <NavLink
                  key={item.href}
                  item={item}
                  currentPath={pathname}
                  allPaths={allPaths}
                />
              )
            )}
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
  )
}

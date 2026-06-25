"use client"

import { useClerk } from "@clerk/nextjs"
import { useEffect } from "react"

export default function SignOutSessionPage() {
  const { signOut } = useClerk()

  useEffect(() => {
    signOut({ redirectUrl: "/sign-in" })
  }, [signOut])

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500 dark:bg-slate-950 dark:text-slate-400">
      Cerrando sesión...
    </div>
  )
}

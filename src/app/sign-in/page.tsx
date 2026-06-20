import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mb-8">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
            AD
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Analytics Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            AguaYa — Panel de métricas
          </p>
        </div>
        <SignIn routing="hash" fallbackRedirectUrl="/dashboard" afterSignOutUrl="/sign-in" />
      </div>
    </div>
  )
}

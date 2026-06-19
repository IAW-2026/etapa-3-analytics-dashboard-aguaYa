import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white shadow-lg shadow-blue-500/20">
            AD
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Analytics Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            AguaYa — Panel de métricas
          </p>
        </div>
        <SignIn
          afterSignOutUrl="/sign-in"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "rounded-xl border border-white/30 bg-gradient-to-br from-white/50 to-slate-100/50 shadow-xl shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/70 dark:to-slate-800/70",
              headerTitle: "text-slate-900 dark:text-slate-100",
              headerSubtitle: "text-slate-500 dark:text-slate-400",
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
              formFieldLabel: "text-slate-700 dark:text-slate-300",
              formFieldInput: "rounded-lg border border-white/30 bg-white/50 dark:border-slate-700/40 dark:bg-slate-900/50",
              footerActionLink: "text-blue-600 hover:text-blue-700",
            },
          }}
        />
      </div>
    </div>
  );
}

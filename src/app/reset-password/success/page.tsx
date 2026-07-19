export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-md flex-col items-center justify-center gap-8 px-6 py-16 text-center">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40"
          aria-hidden
        >
          <svg
            className="h-8 w-8 text-emerald-600 dark:text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            Password reset successful
          </h1>
          <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Congratulations! Your password has been reset. You may now close this
            page and return to the Wegood4u app to sign in with your new
            password.
          </p>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-500">
          If you weren’t redirected to the app automatically, open the Wegood4u
          app on your device and sign in there.
        </p>
      </main>
    </div>
  );
}

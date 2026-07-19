'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

// Password requirement checks (must match UI list)
// Upper bound: bcrypt truncates at 72 bytes, so longer input is silently ignored.
const MAX_PASSWORD_LENGTH = 72;
const hasMinLength = (p: string) => p.length > 8;
const hasNumber = (p: string) => /\d/.test(p);
const hasLowercase = (p: string) => /[a-z]/.test(p);
const hasUppercase = (p: string) => /[A-Z]/.test(p);

const allRequirementsMet = (p: string) =>
  hasMinLength(p) &&
  hasNumber(p) &&
  hasLowercase(p) &&
  hasUppercase(p) &&
  p.length <= MAX_PASSWORD_LENGTH;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isValidLink, setIsValidLink] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const hash = window.location.hash.startsWith('#')
          ? window.location.hash.slice(1)
          : window.location.hash;

        const params = new URLSearchParams(hash);
        const type = params.get('type');
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token') ?? '';

        if (type !== 'recovery' || !accessToken) {
          setError('Invalid or expired reset link.');
          setIsValidLink(false);
          return;
        }

        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          setError('Could not validate reset link. Please request a new one.');
          setIsValidLink(false);
          return;
        }

        const { data, error: userError } = await supabase.auth.getUser();
        if (!userError && data.user) {
          setEmail(data.user.email ?? null);
        }

        setIsValidLink(true);
      } catch {
        setError('Something went wrong. Please request a new reset link.');
        setIsValidLink(false);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password || !confirm) {
      setError('Please fill in both password fields.');
      return;
    }

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    if (!allRequirementsMet(password)) {
      setError('Please meet all password requirements before updating.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(error.message ?? 'Failed to reset password. Please try again.');
      return;
    }

    // Drop the recovery session — it must not persist in this browser after the
    // password is set (the app is where the user actually signs in).
    await supabase.auth.signOut();

    setSuccess(true);

    setTimeout(() => {
      router.push('/');
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <p className="text-[#206E56] font-medium">Validating reset link...</p>
      </div>
    );
  }

  if (!isValidLink) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="max-w-md rounded-lg bg-white p-6 shadow">
          <h1 className="mb-2 text-xl font-semibold text-[#206E56]">Invalid reset link</h1>
          <p className="text-sm text-zinc-700">
            This password reset link is invalid or has expired. Please request a new one from the
            app.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
        <div className="mb-6 flex justify-center">
          <img
            src="/wegood4u.png"
            alt="Wegood4u"
            className="h-auto w-full max-w-[240px] object-contain"
          />
        </div>
        <h1 className="mb-4 text-2xl font-semibold text-[#206E56]">Set a new password</h1>

        {email && (
          <p className="mb-2 text-sm text-zinc-600">
            Resetting password for <span className="font-medium">{email}</span>
          </p>
        )}

        {error && (
          <p className="mb-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {success && (
          <p className="mb-3 text-sm text-[#206E56] font-medium">
            Password updated successfully. Redirecting...
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium text-zinc-800">Password Requirements:</p>
            <ul className="mb-3 space-y-1.5 text-sm">
              <li
                className={`flex items-center gap-2 ${
                  hasMinLength(password) ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {hasMinLength(password) ? (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                    <svg className="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                ) : (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100">
                    <span className="text-xs font-bold text-red-600">✕</span>
                  </span>
                )}
                More than 8 characters
              </li>
              <li
                className={`flex items-center gap-2 ${
                  hasNumber(password) ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {hasNumber(password) ? (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                    <svg className="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                ) : (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100">
                    <span className="text-xs font-bold text-red-600">✕</span>
                  </span>
                )}
                At least one numeric character (1, 2, 3…)
              </li>
              <li
                className={`flex items-center gap-2 ${
                  hasLowercase(password) ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {hasLowercase(password) ? (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                    <svg className="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                ) : (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100">
                    <span className="text-xs font-bold text-red-600">✕</span>
                  </span>
                )}
                At least one lowercase letter (a–z)
              </li>
              <li
                className={`flex items-center gap-2 ${
                  hasUppercase(password) ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {hasUppercase(password) ? (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                    <svg className="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                ) : (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100">
                    <span className="text-xs font-bold text-red-600">✕</span>
                  </span>
                )}
                At least one uppercase letter (A–Z)
              </li>
            </ul>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-black">
              New password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full rounded border border-zinc-300 px-3 py-2 pr-10 text-sm text-black placeholder:text-zinc-500"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878a4 4 0 105.657 5.657m2.121-7.07a4 4 0 00-5.657-5.657" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-black">
              Confirm password
            </label>
            <input
              type="password"
              className="w-full rounded border border-zinc-300 px-3 py-2 text-sm text-black placeholder:text-zinc-500"
              placeholder="Confirm new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !allRequirementsMet(password) || password !== confirm}
            className="mt-2 w-full rounded bg-[#206E56] px-4 py-2 text-sm font-medium text-white disabled:opacity-60 hover:bg-[#1a5a47] disabled:hover:bg-[#206E56]"
          >
            {loading ? 'Saving...' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  );
}


'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isValidLink, setIsValidLink] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
          console.error('setSession error', error);
          setError('Could not validate reset link. Please request a new one.');
          setIsValidLink(false);
          return;
        }

        setIsValidLink(true);
      } catch (e) {
        console.error(e);
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

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      console.error('updateUser error', error);
      setError(error.message ?? 'Failed to reset password. Please try again.');
      return;
    }

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
          <Image
            src="/wegood4u.png"
            alt="Wegood4u"
            width={240}
            height={80}
            className="h-auto w-full max-w-[240px] object-contain"
            priority
          />
        </div>
        <h1 className="mb-4 text-2xl font-semibold text-[#206E56]">Set a new password</h1>

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
            <label className="mb-1 block text-sm font-medium text-black">
              New password
            </label>
            <input
              type="password"
              className="w-full rounded border border-zinc-300 px-3 py-2 text-sm text-black placeholder:text-zinc-500"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
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
            disabled={loading}
            className="mt-2 w-full rounded bg-[#206E56] px-4 py-2 text-sm font-medium text-white disabled:opacity-60 hover:bg-[#1a5a47]"
          >
            {loading ? 'Saving...' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  );
}


"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle, ArrowLeft } from "lucide-react";

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please enter both username/email and password.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Force full page reload to activate server session
        window.location.href = "/admin";
      } else {
        setError(data.message || "Invalid credentials. Please verify and try again.");
        setIsLoading(false);
      }
    } catch {
      setError("Network error while verifying credentials. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex flex-col justify-center items-center px-4 sm:px-6 py-12">
      {/* Background Vedic subtle glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <div className="w-[500px] h-[500px] rounded-full bg-saffron-500/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md space-y-6">
        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-vedic-muted hover:text-vedic-dark transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Astro Raj Live Website</span>
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl border border-border/80 shadow-xl p-8 sm:p-10 space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-vedic-dark text-gold-400 flex items-center justify-center font-serif text-3xl font-bold shadow-lg mx-auto border border-gold-400/30">
              ॐ
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-saffron-700 block">
                Official Access Portal
              </span>
              <h1 className="font-serif text-2xl font-bold text-vedic-dark">
                Admin Management Sign In
              </h1>
            </div>
            <p className="text-xs text-vedic-muted max-w-xs mx-auto leading-relaxed">
              Restricted portal for managing consultations, customer orders, and sacred Vedic offerings.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-vedic-dark">
                Admin Username / Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-vedic-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  autoComplete="username"
                  placeholder="thakur.thakur1995@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-ivory rounded-xl border border-border text-xs text-vedic-dark font-medium placeholder:text-vedic-muted/60 focus:outline-hidden focus:border-saffron-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-vedic-dark">
                Admin Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-vedic-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-ivory rounded-xl border border-border text-xs text-vedic-dark font-medium placeholder:text-vedic-muted/60 focus:outline-hidden focus:border-saffron-600 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-vedic-muted hover:text-vedic-dark p-1"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-semibold text-xs transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Unlock Admin Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Security Assurance Footer */}
          <div className="pt-2 border-t border-border/70 flex items-center justify-center gap-1.5 text-[11px] text-vedic-muted">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>256-Bit Cryptographic Session • Astro Raj Sacred Portal</span>
          </div>
        </div>
      </div>
    </div>
  );
}

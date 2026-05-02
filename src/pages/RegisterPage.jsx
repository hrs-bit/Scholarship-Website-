import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import RegistrationForm from '../components/RegistrationForm'

export default function RegisterPage() {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [signingIn, setSigningIn] = useState(false)
  const navigate = useNavigate()

  // Check session on mount and listen for auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleGoogleLogin() {
    setSigningIn(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/register',
      },
    })
    setSigningIn(false)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    setUser(null)
  }

  const avatarUrl = user?.user_metadata?.avatar_url
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student'
  const email = user?.email || ''

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

      {/* ── TOPBAR ─────────────────────────────────── */}
      <nav className="border-b border-white/60 bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
              <span className="text-base">🎓</span>
            </div>
            <span className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">ScholarPath</span>
          </Link>

          <div className="flex items-center gap-3">
            {user && (
              <button
                id="sign-out-btn"
                onClick={handleSignOut}
                className="text-xs text-slate-500 hover:text-red-500 font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
              >
                Sign out
              </button>
            )}
            <Link
              to="/"
              id="back-to-scholarships-link"
              className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              ← All Scholarships
            </Link>
          </div>
        </div>
      </nav>

      {/* ── PAGE CONTENT ───────────────────────────── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 rounded-full px-3 py-1 text-xs font-semibold text-blue-700 mb-4">
            🔐 Secure · Private · Free
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-3">
            Register for Scholarship Alerts
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
            Sign in with your Google account to get personalised scholarship matches, deadline reminders, and instant alerts — all for free.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* ── LEFT: Benefits ─────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-base font-bold text-slate-700 mb-2">Why register?</h2>
            {[
              { icon: '🎯', title: 'Personalised Matches', desc: 'We compare your GPA and interests to find the most suitable scholarships for you.' },
              { icon: '⏰', title: 'Deadline Reminders', desc: 'Never miss an application window. Get notified 7 days before each deadline.' },
              { icon: '🔒', title: 'Data Auto-Deleted', desc: 'Your data is automatically purged after 30 days. No long-term storage.' },
              { icon: '⚡', title: 'Instant Alerts', desc: 'Be the first to know when new scholarships are added to the platform.' },
            ].map(b => (
              <div key={b.title} className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <span className="text-2xl mt-0.5">{b.icon}</span>
                <div>
                  <p className="font-semibold text-slate-700 text-sm">{b.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}

            {/* Trust strip */}
            <div className="p-4 bg-green-50 border border-green-100 rounded-2xl">
              <p className="text-xs text-green-700 font-semibold mb-2">🛡️ We take privacy seriously</p>
              <ul className="text-xs text-green-600 space-y-1">
                <li>✓ End-to-end encrypted via Supabase</li>
                <li>✓ No passwords stored — Google OAuth only</li>
                <li>✓ Data auto-deleted after 30 days</li>
                <li>✓ Never sold or shared with third parties</li>
              </ul>
            </div>
          </div>

          {/* ── RIGHT: Auth + Form ─────────────────── */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">

              {/* Card header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold">Secure Registration</h3>
                  <p className="text-blue-200 text-xs">256-bit SSL · Powered by Supabase Auth</p>
                </div>
                {user && (
                  <div className="ml-auto flex items-center gap-2 bg-white/20 rounded-xl px-3 py-1.5">
                    {avatarUrl
                      ? <img src={avatarUrl} alt={displayName} className="w-6 h-6 rounded-full" />
                      : <div className="w-6 h-6 rounded-full bg-white/40 flex items-center justify-center text-xs font-bold text-white">{displayName[0]}</div>
                    }
                    <span className="text-white text-xs font-semibold truncate max-w-[120px]">{displayName}</span>
                  </div>
                )}
              </div>

              <div className="p-6 sm:p-8">
                {authLoading ? (
                  /* ── Loading skeleton ── */
                  <div className="space-y-4 py-6">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
                    ))}
                  </div>

                ) : !user ? (
                  /* ── NOT SIGNED IN ── */
                  <div className="py-4 space-y-6">
                    <div className="text-center">
                      <p className="text-slate-500 text-sm mb-6">
                        Sign in with Google to auto-fill your profile and register in seconds.
                      </p>

                      {/* Google button */}
                      <button
                        id="google-signin-btn"
                        onClick={handleGoogleLogin}
                        disabled={signingIn}
                        className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl border-2 border-slate-200
                          bg-white hover:bg-slate-50 hover:border-blue-300 transition-all shadow-sm
                          text-slate-700 font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {signingIn ? (
                          <svg className="w-5 h-5 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                        )}
                        {signingIn ? 'Redirecting to Google…' : 'Continue with Google'}
                      </button>

                      {/* Divider */}
                      <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 border-t border-slate-200" />
                        <span className="text-xs text-slate-400">or fill in manually</span>
                        <div className="flex-1 border-t border-slate-200" />
                      </div>

                      <p className="text-xs text-slate-400 mb-4">
                        Without Google sign-in, you'll enter your details manually below.
                      </p>
                    </div>

                    {/* Manual form (no user) */}
                    <RegistrationForm user={null} />
                  </div>

                ) : (
                  /* ── SIGNED IN ── */
                  <div className="space-y-6">
                    {/* User info banner */}
                    <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                      {avatarUrl
                        ? <img src={avatarUrl} alt={displayName} className="w-12 h-12 rounded-full ring-2 ring-blue-200" />
                        : <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">{displayName[0]}</div>
                      }
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 truncate">{displayName}</p>
                        <p className="text-xs text-slate-500 truncate">{email}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                        Verified
                      </div>
                    </div>

                    {/* Form pre-filled with Google data */}
                    <RegistrationForm user={user} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── FOOTER ──────────────────────────────────── */}
      <footer className="mt-16 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-center text-xs text-slate-400">
          © 2026 ScholarPath · Your data is encrypted and auto-deleted after 30 days
        </div>
      </footer>
    </div>
  )
}

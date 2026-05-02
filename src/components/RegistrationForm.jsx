import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const INITIAL_ERRORS = { name: '', email: '', gpa: '', interests: '' }

function validate({ name, email, gpa, interests }) {
  const errs = { name: '', email: '', gpa: '', interests: '' }
  if (!name.trim() || name.trim().length < 2) errs.name = 'Please enter your full name (min 2 characters).'
  if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Please enter a valid email address.'
  const gpaNum = parseFloat(gpa)
  if (!gpa || isNaN(gpaNum) || gpaNum < 0 || gpaNum > 10) errs.gpa = 'GPA must be a number between 0.0 and 10.0.'
  if (!interests.trim() || interests.trim().length < 3) errs.interests = 'Please describe your scholarship interests.'
  return errs
}

export default function RegistrationForm({ user }) {
  const [form, setForm] = useState({ name: '', email: '', gpa: '', interests: '' })
  const [errors, setErrors] = useState(INITIAL_ERRORS)
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [serverError, setServerError] = useState('')

  // Pre-fill from Google user when available
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name: user.user_metadata?.full_name || prev.name,
        email: user.email || prev.email,
      }))
    }
  }, [user])

  const isGoogleUser = !!user

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate(form)
    if (Object.values(errs).some(Boolean)) {
      setErrors(errs)
      return
    }
    if (!supabase) {
      setStatus('error')
      setServerError('Service is currently unavailable. Please try again later.')
      return
    }
    setStatus('loading')
    setServerError('')
    try {
      const { error } = await supabase
        .from('student_details')
        .insert([{
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          gpa: parseFloat(form.gpa),
          interests: form.interests.trim(),
        }])
      if (error) throw error
      setStatus('success')
      setForm({ name: '', email: '', gpa: '', interests: '' })
    } catch (err) {
      setStatus('error')
      setServerError(err.message || 'Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div id="registration-success" className="flex flex-col items-center gap-4 py-10 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-slate-800">You're Registered! 🎉</h3>
        <p className="text-slate-500 max-w-sm text-sm">
          Your details have been securely saved. We'll match you with the best scholarship opportunities and send alerts before deadlines.
        </p>
        <button
          id="register-another-btn"
          onClick={() => setStatus('idle')}
          className="mt-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
        >
          Update Details
        </button>
      </div>
    )
  }

  return (
    <form id="secure-registration-form" onSubmit={handleSubmit} noValidate className="space-y-5">

      {/* Name */}
      <div>
        <label htmlFor="reg-name" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Full Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </span>
          <input
            id="reg-name"
            name="name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            readOnly={isGoogleUser}
            placeholder="e.g. Priya Sharma"
            className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all outline-none
              ${isGoogleUser ? 'bg-slate-50 text-slate-600 cursor-default' : ''}
              ${errors.name
                ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200'
                : 'border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100'}`}
          />
          {isGoogleUser && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944z" clipRule="evenodd"/>
              </svg>
            </span>
          )}
        </div>
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        {isGoogleUser && !errors.name && <p className="mt-1 text-xs text-slate-400">Auto-filled from your Google account</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="reg-email" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Email Address <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </span>
          <input
            id="reg-email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            readOnly={isGoogleUser}
            placeholder="e.g. priya@example.com"
            className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all outline-none
              ${isGoogleUser ? 'bg-slate-50 text-slate-600 cursor-default' : ''}
              ${errors.email
                ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200'
                : 'border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100'}`}
          />
          {isGoogleUser && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944z" clipRule="evenodd"/>
              </svg>
            </span>
          )}
        </div>
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        {isGoogleUser && !errors.email && <p className="mt-1 text-xs text-slate-400">Verified by Google</p>}
      </div>

      {/* GPA */}
      <div>
        <label htmlFor="reg-gpa" className="block text-sm font-semibold text-slate-700 mb-1.5">
          GPA / CGPA <span className="text-red-500">*</span>
          <span className="ml-1 text-xs text-slate-400 font-normal">(0.0 – 10.0)</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </span>
          <input
            id="reg-gpa"
            name="gpa"
            type="number"
            step="0.01"
            min="0"
            max="10"
            value={form.gpa}
            onChange={handleChange}
            placeholder="e.g. 8.5"
            className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all outline-none
              ${errors.gpa
                ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200'
                : 'border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100'}`}
          />
        </div>
        {errors.gpa && <p className="mt-1 text-xs text-red-500">{errors.gpa}</p>}
      </div>

      {/* Interests */}
      <div>
        <label htmlFor="reg-interests" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Scholarship Interests <span className="text-red-500">*</span>
          <span className="ml-1 text-xs text-slate-400 font-normal">(e.g. merit, engineering, women)</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-3.5 text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </span>
          <textarea
            id="reg-interests"
            name="interests"
            rows={3}
            value={form.interests}
            onChange={handleChange}
            placeholder="e.g. I'm interested in merit-based scholarships for engineering undergraduates…"
            className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all outline-none resize-none
              ${errors.interests
                ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200'
                : 'border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100'}`}
          />
        </div>
        {errors.interests && <p className="mt-1 text-xs text-red-500">{errors.interests}</p>}
      </div>

      {/* Server error */}
      {status === 'error' && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{serverError}</span>
        </div>
      )}

      {/* Trust badges */}
      <div className="flex flex-wrap items-center gap-4 py-3 border-t border-slate-100 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
          </svg>
          SSL Encrypted
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd"/>
          </svg>
          Data Protected
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
          </svg>
          No Spam
        </span>
        <span className="ml-auto flex items-center gap-1">
          Powered by <span className="font-semibold text-slate-500">Supabase</span>
        </span>
      </div>

      {/* Submit */}
      <button
        id="registration-submit-btn"
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700
          text-white font-semibold text-sm tracking-wide shadow-md shadow-blue-200
          disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200
          flex items-center justify-center gap-2"
      >
        {status === 'loading' ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Submitting Securely…
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Submit Secure Registration
          </>
        )}
      </button>
    </form>
  )
}

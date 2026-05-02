import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import ScholarshipCard from '../components/ScholarshipCard'
import scholarships from '../../scholarships.json'

const CATEGORY_LABELS = {
  'all':            { label: 'All', icon: '📋' },
  'government':     { label: 'Government', icon: '🏛️' },
  'merit-based':    { label: 'Merit-Based', icon: '🏅' },
  'need-based':     { label: 'Need-Based', icon: '💛' },
  'minority':       { label: 'Minority', icon: '🌙' },
  'women':          { label: 'Women', icon: '👩' },
  'state-based':    { label: 'State-Based', icon: '🗺️' },
  'stem':           { label: 'STEM', icon: '🔬' },
  'skill-based':    { label: 'Skill-Based', icon: '⚡' },
  'sports':         { label: 'Sports', icon: '🏆' },
  'disability':     { label: 'Disability', icon: '♿' },
}

const DIFFICULTY_LABELS = {
  'all':         'All Levels',
  'easy':        '✅ Easy to Get',
  'moderate':    '🔶 Moderate',
  'competitive': '🔥 Competitive',
}

const ALL_CATEGORIES = ['all', ...Array.from(new Set(scholarships.map(s => s.category))).filter(Boolean).sort()]

const easyCount = scholarships.filter(s => s.difficulty === 'easy').length

const STATS = [
  { label: 'Total Scholarships', value: scholarships.length, icon: '🎓' },
  { label: 'Easy to Get', value: easyCount, icon: '✅' },
  {
    label: 'Closing This Month', icon: '⏳',
    value: scholarships.filter(s => {
      const m = s.last_date?.match(/(\d{1,2})\s(\w+)\s(\d{4})/)
      if (!m) return false
      const d = new Date(`${m[2]} ${m[1]}, ${m[3]}`)
      const now = new Date()
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
    }).length
  },
  { label: 'Types', value: new Set(scholarships.map(s => s.category)).size, icon: '📂' },
]

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeDifficulty, setActiveDifficulty] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return scholarships.filter(s => {
      const matchCat = activeCategory === 'all' || s.category === activeCategory
      const matchDiff = activeDifficulty === 'all' || s.difficulty === activeDifficulty
      const q = search.toLowerCase()
      const matchSearch = !q ||
        s.name.toLowerCase().includes(q) ||
        s.provider.toLowerCase().includes(q) ||
        s.eligibility.toLowerCase().includes(q) ||
        (s.tags || []).some(t => t.toLowerCase().includes(q))
      return matchCat && matchDiff && matchSearch
    })
  }, [activeCategory, activeDifficulty, search])

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── HERO ─────────────────────────────────────── */}
      <header className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-12">

          {/* Nav */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <span className="text-lg">🎓</span>
              </div>
              <span className="font-bold text-lg tracking-tight">ScholarPath</span>
            </div>
            <Link
              to="/register"
              id="nav-register-btn"
              className="text-sm font-semibold px-4 py-2 rounded-xl bg-white text-blue-700 hover:bg-blue-50 transition-colors shadow-sm"
            >
              Register Now →
            </Link>
          </div>

          {/* Hero text */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-blue-600/50 border border-blue-400/30 rounded-full px-3 py-1 text-xs font-semibold text-blue-200 mb-4">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Updated May 2026 · {scholarships.length} Active Scholarships · {easyCount} Easy to Get
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
              Find Your Perfect<br />
              <span className="text-blue-300">Scholarship</span>
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed">
              Browse {scholarships.length} curated, categorised scholarships for Indian students — from government schemes to corporate grants.
            </p>
          </div>

          {/* Search */}
          <div className="mt-8 max-w-lg relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="scholarship-search"
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, provider, tag or eligibility…"
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white text-slate-800 text-sm shadow-lg outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-t border-white/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STATS.map(s => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <p className="text-xl font-extrabold">{s.value}</p>
                  <p className="text-xs text-blue-300">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── MAIN ─────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* Difficulty quick-filter row */}
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(DIFFICULTY_LABELS).map(([key, label]) => (
            <button
              key={key}
              id={`difficulty-${key}`}
              onClick={() => setActiveDifficulty(key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all
                ${activeDifficulty === key
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Category filter tabs */}
        <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Filter by category">
          {ALL_CATEGORIES.map(cat => {
            const cfg = CATEGORY_LABELS[cat] || { label: cat, icon: '📌' }
            return (
              <button
                key={cat}
                id={`filter-${cat}`}
                role="tab"
                aria-selected={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold border transition-all flex items-center gap-1.5
                  ${activeCategory === cat
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-700'}`}
              >
                <span>{cfg.icon}</span>
                <span>{cfg.label}</span>
              </button>
            )
          })}
        </div>

        {/* Results count */}
        <p className="text-sm text-slate-500 mb-5">
          Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of{' '}
          <span className="font-semibold">{scholarships.length}</span> scholarships
          {activeDifficulty !== 'all' && <> · <span className="font-semibold text-amber-600">{DIFFICULTY_LABELS[activeDifficulty]}</span></>}
          {activeCategory !== 'all' && <> · <span className="font-semibold text-blue-600">{CATEGORY_LABELS[activeCategory]?.label || activeCategory}</span></>}
          {search && <> · matching "<span className="font-semibold text-slate-700">{search}</span>"</>}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((s, i) => (
              <ScholarshipCard key={s.name} scholarship={s} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <span className="text-5xl">🔍</span>
            <h3 className="text-lg font-bold text-slate-700">No results found</h3>
            <p className="text-sm text-slate-400">Try a different search term, category, or difficulty level.</p>
            <button
              onClick={() => { setSearch(''); setActiveCategory('all'); setActiveDifficulty('all') }}
              className="mt-2 px-4 py-2 text-sm font-semibold text-blue-600 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* CTA Banner */}
        <div className="mt-16 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-white">
            <h2 className="text-2xl font-extrabold mb-1">Get Personalised Alerts</h2>
            <p className="text-blue-200 text-sm">Register with Google and we'll match you to the right opportunities.</p>
          </div>
          <Link
            to="/register"
            id="cta-register-btn"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 font-bold rounded-2xl shadow-lg hover:bg-blue-50 transition-colors text-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Register with Google
          </Link>
        </div>
      </main>

      {/* ── FOOTER ──────────────────────────────────── */}
      <footer className="mt-16 border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-400">
          <p>© 2026 ScholarPath · Data sourced from NSP, Buddy4Study, AICTE &amp; Govt. portals</p>
          <div className="flex items-center gap-4">
            <Link to="/register" className="text-blue-600 hover:underline font-medium">Register →</Link>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              Live
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}

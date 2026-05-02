import React from 'react'

const categoryConfig = {
  'government':    { color: 'bg-indigo-100 text-indigo-700 border-indigo-200',  label: '🏛️ Government' },
  'merit-based':   { color: 'bg-blue-100 text-blue-700 border-blue-200',        label: '🏅 Merit-Based' },
  'need-based':    { color: 'bg-amber-100 text-amber-700 border-amber-200',     label: '💛 Need-Based' },
  'minority':      { color: 'bg-rose-100 text-rose-700 border-rose-200',        label: '🌙 Minority' },
  'women':         { color: 'bg-pink-100 text-pink-700 border-pink-200',        label: '👩 Women' },
  'state-based':   { color: 'bg-orange-100 text-orange-700 border-orange-200',  label: '🗺️ State-Based' },
  'stem':          { color: 'bg-teal-100 text-teal-700 border-teal-200',        label: '🔬 STEM' },
  'skill-based':   { color: 'bg-purple-100 text-purple-700 border-purple-200',  label: '⚡ Skill-Based' },
  'sports':        { color: 'bg-green-100 text-green-700 border-green-200',     label: '🏆 Sports' },
  'disability':    { color: 'bg-cyan-100 text-cyan-700 border-cyan-200',        label: '♿ Disability' },
  'career-guidance':{ color: 'bg-slate-100 text-slate-600 border-slate-200',   label: '🧭 Career Guidance' },
}

const difficultyConfig = {
  'easy':        { color: 'bg-green-50 text-green-700 border-green-200',   label: '✅ Easy to Get' },
  'moderate':    { color: 'bg-amber-50 text-amber-700 border-amber-200',   label: '🔶 Moderate' },
  'competitive': { color: 'bg-red-50 text-red-700 border-red-200',         label: '🔥 Competitive' },
}

function urgencyLevel(dateStr) {
  if (!dateStr || dateStr === 'Check official website') return null
  const parts = dateStr.match(/(\d{1,2})\s(\w+)\s(\d{4})/)
  if (!parts) return null
  const deadline = new Date(`${parts[2]} ${parts[1]}, ${parts[3]}`)
  const diff = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24))
  if (diff <= 14) return { label: `⚠️ ${diff}d left`, color: 'text-red-600 bg-red-50 border-red-200' }
  if (diff <= 30) return { label: `⏳ ${diff}d left`, color: 'text-amber-600 bg-amber-50 border-amber-200' }
  return { label: `${diff}d left`, color: 'text-slate-500 bg-slate-50 border-slate-200' }
}

export default function ScholarshipCard({ scholarship, index }) {
  const cat = categoryConfig[scholarship.category?.toLowerCase()] || {
    color: 'bg-slate-100 text-slate-600 border-slate-200',
    label: '📚 Scholarship'
  }
  const diff = difficultyConfig[scholarship.difficulty?.toLowerCase()]
  const urgency = urgencyLevel(scholarship.last_date)

  return (
    <article
      className="scholarship-card bg-white rounded-2xl border border-slate-200 shadow-sm card-hover flex flex-col overflow-hidden"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600" />

      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Row 1: Category + Difficulty */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${cat.color}`}>
            {cat.label}
          </span>
          {diff && (
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${diff.color}`}>
              {diff.label}
            </span>
          )}
        </div>

        {/* Name */}
        <h2 className="text-[14px] font-bold leading-snug text-slate-800 line-clamp-2">
          {scholarship.name}
        </h2>

        {/* Provider */}
        <div className="flex items-center gap-1.5 text-sm text-slate-500">
          <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span className="font-medium text-slate-600 truncate text-xs">{scholarship.provider}</span>
        </div>

        {/* Eligibility */}
        <p className="text-xs text-slate-500 line-clamp-2 flex-1 leading-relaxed">
          <span className="font-semibold text-slate-600">Who: </span>
          {scholarship.eligibility}
        </p>

        {/* Amount */}
        {scholarship.amount && scholarship.amount !== 'Not specified' && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-3 py-2">
            <svg className="w-3.5 h-3.5 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-semibold text-green-700">{scholarship.amount}</span>
          </div>
        )}

        {/* Footer: Deadline + Apply */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100 gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            {urgency ? (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-lg border ${urgency.color}`}>
                {urgency.label}
              </span>
            ) : (
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="truncate">{scholarship.last_date}</span>
              </div>
            )}
          </div>
          <a
            href={scholarship.link}
            target="_blank"
            rel="noopener noreferrer"
            id={`scholarship-link-${index}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors shrink-0"
          >
            Apply
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  )
}

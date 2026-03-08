import { useState, useEffect } from 'react'
import {
  Target, Rocket, Users, Palette, Check,
  ChevronRight, ChevronDown, Calendar, TrendingUp
} from 'lucide-react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts'

// ─── Status helpers ────────────────────────────────────────────────────────────

const STATUS_CYCLE = ['not-started', 'in-progress', 'on-track', 'at-risk']
const STATUS_DISPLAY = {
  'not-started': { emoji: '\u26AA', label: 'Not started', colour: 'bg-slate-200 text-slate-600' },
  'in-progress': { emoji: '\uD83D\uDFE1', label: 'In progress', colour: 'bg-amber-100 text-amber-700' },
  'on-track':    { emoji: '\uD83D\uDFE2', label: 'On track',    colour: 'bg-emerald-100 text-emerald-700' },
  'at-risk':     { emoji: '\uD83D\uDD34', label: 'At risk',     colour: 'bg-red-100 text-red-700' },
}

function nextStatus(current) {
  const i = STATUS_CYCLE.indexOf(current)
  return STATUS_CYCLE[(i + 1) % STATUS_CYCLE.length]
}

function calcProgress(milestones) {
  if (!milestones.length) return 0
  const done = milestones.filter(m => m.done).length
  return Math.round((done / milestones.length) * 100)
}

// ─── Nav sections ──────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'focus',    label: 'Focus Areas' },
  { id: 'growth',   label: 'Growth Goals' },
  { id: 'overview', label: 'Progress' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'dev-plan', label: 'Development' },
  { id: 'metrics',  label: 'Metrics' },
]

// ─── Main component ────────────────────────────────────────────────────────────

export default function App() {
  const [activeSection, setActiveSection] = useState('')

  // ── Goal state ──────────────────────────────────────────────────────────────

  const [goals, setGoals] = useState({
    expanded: {},
    focusAreas: [
      {
        id: 'free-tier',
        title: 'Xeneta Free Tier (Try for Free)',
        icon: 'rocket',
        description:
          'Leading design end-to-end for a new free version of the Xeneta platform, from discovery through to launch in Q2 2026. This is Xeneta\u2019s first self-serve acquisition channel.',
        smartGoal:
          'Design and deliver the Free Tier experience from discovery to launch by end of Q2 2026, targeting 500 free sign-ups within the first 3 months and a 10% conversion rate to paid plans.',
        milestones: [
          { text: 'Discovery research complete (user interviews, competitor audit)', done: false },
          { text: 'Jobs-to-be-done and user segmentation defined', done: false },
          { text: 'Core free-tier experience designed (what\u2019s free vs paid)', done: false },
          { text: 'Onboarding flow designed and tested', done: false },
          { text: 'Sign-up and activation flow designed', done: false },
          { text: 'Design handed off to engineering', done: false },
          { text: 'Free Tier launched', done: false },
          { text: 'Post-launch data reviewed and iteration plan created', done: false },
        ],
      },
      {
        id: 'indexing',
        title: 'Indexing: Simulator & Live Contract Manager',
        icon: 'trending',
        description:
          'Improving the UX of the Index-Linked Contract Simulator and Live Contract Manager to drive adoption of index-linked contracts, with a platform target of 300 contracts managed by end of 2026.',
        smartGoal:
          'Redesign onboarding, education, and guidance flows within the Simulator based on workshop findings, targeting a 40% increase in simulation-to-contract conversion rate and contributing to 300 contracts managed in-platform by end of 2026.',
        milestones: [
          { text: 'Workshop findings prioritised into design roadmap', done: false },
          { text: 'First-time user guidance and framing redesigned', done: false },
          { text: 'Regional vs port-level explanation flow improved', done: false },
          { text: 'Basic/Advanced mode split simplified or removed', done: false },
          { text: 'Inline explanations set to visible by default', done: false },
          { text: 'Index calculation day logic redesigned with proactive recommendations', done: false },
          { text: 'Long-term market context surfaced alongside short-term indexes', done: false },
          { text: 'Chart readability improved with adaptive defaults', done: false },
          { text: 'Saving and sharing features made more discoverable', done: false },
          { text: 'Rule-sharing between counterparties designed', done: false },
          { text: 'Post-improvement adoption metrics reviewed', done: false },
        ],
      },
    ],
    growthGoals: [
      {
        id: 'strategic',
        title: 'Strategic Influence',
        icon: 'target',
        description:
          'Lead design strategy across Free Tier and Indexing, define UX success metrics, and present design direction to leadership quarterly.',
        milestones: [
          { text: 'UX success metrics defined for Free Tier and Indexing', done: false },
          { text: 'Q1 design direction presented to leadership', done: false },
          { text: 'Q2 design direction presented to leadership', done: false },
          { text: 'Q3 design direction presented to leadership', done: false },
          { text: 'Q4 design direction presented to leadership', done: false },
          { text: 'Design strategy documented and shared with product and commercial teams', done: false },
        ],
      },
      {
        id: 'design-system',
        title: 'Design System Ownership',
        icon: 'palette',
        description:
          'Own and evolve the Compass design system to support Free Tier and Indexing, contribute 10+ new components, and establish governance practices.',
        milestones: [
          { text: 'Audit current Compass components for gaps', done: false },
          { text: '5 new components contributed', done: false },
          { text: '10 new components contributed', done: false },
          { text: 'Governance process documented and shared with team', done: false },
          { text: 'Cross-team adoption reviewed at end of year', done: false },
        ],
      },
      {
        id: 'team-elevation',
        title: 'Team Elevation & Visibility',
        icon: 'users',
        description:
          'Elevate team design quality through structured UX critique on team calls and run the monthly Product Showcase to strengthen cross-company alignment.',
        milestones: [
          { text: 'Led structured UX critique in 3 team calls', done: false },
          { text: 'Led structured UX critique in 6 team calls', done: false },
          { text: 'Led structured UX critique in 9 team calls', done: false },
          { text: 'Led structured UX critique in 12 team calls (monthly)', done: false },
          { text: 'Ran 4 Product Showcases', done: false },
          { text: 'Ran 8 Product Showcases', done: false },
          { text: 'Ran 12 Product Showcases', done: false },
        ],
      },
    ],
    metrics: [
      { id: 'ft-launch',     goal: 'Free Tier Launch',       metric: 'Launched on time',              target: 'Q2 2026',  current: 'In progress',  status: 'in-progress' },
      { id: 'ft-signups',    goal: 'Free Tier Sign-ups',     metric: 'Sign-ups in first 3 months',    target: '500',      current: '-',            status: 'not-started' },
      { id: 'ft-conversion', goal: 'Free Tier Conversion',   metric: 'Free to paid conversion',       target: '10%',      current: '-',            status: 'not-started' },
      { id: 'ix-contracts',  goal: 'Indexing Contracts',      metric: 'Contracts managed in platform', target: '300',      current: '~50',          status: 'in-progress' },
      { id: 'ix-simulator',  goal: 'Simulator Conversion',   metric: 'Simulation-to-contract rate',   target: '+40%',     current: 'Baseline TBD', status: 'not-started' },
      { id: 'ds-components', goal: 'Design System',          metric: 'New components contributed',     target: '10',       current: '0',            status: 'not-started' },
      { id: 'ux-critiques',  goal: 'UX Critiques Led',       metric: 'Structured critiques on team calls', target: '12',  current: '0',            status: 'not-started' },
      { id: 'showcases',     goal: 'Product Showcases',      metric: 'Showcases run',                  target: '12',       current: '2',            status: 'on-track' },
    ],
  })

  // ── State updaters ──────────────────────────────────────────────────────────

  function toggleFocusMilestone(areaId, milestoneIndex) {
    setGoals(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.map(f =>
        f.id === areaId
          ? {
              ...f,
              milestones: f.milestones.map((m, i) =>
                i === milestoneIndex ? { ...m, done: !m.done } : m
              ),
            }
          : f
      ),
    }))
  }

  function toggleGrowthMilestone(goalId, milestoneIndex) {
    setGoals(prev => ({
      ...prev,
      growthGoals: prev.growthGoals.map(g =>
        g.id === goalId
          ? {
              ...g,
              milestones: g.milestones.map((m, i) =>
                i === milestoneIndex ? { ...m, done: !m.done } : m
              ),
            }
          : g
      ),
    }))
  }

  function cycleMetricStatus(id) {
    setGoals(prev => ({
      ...prev,
      metrics: prev.metrics.map(m =>
        m.id === id ? { ...m, status: nextStatus(m.status) } : m
      ),
    }))
  }

  function toggleExpanded(goalId) {
    setGoals(prev => ({
      ...prev,
      expanded: { ...prev.expanded, [goalId]: !prev.expanded[goalId] },
    }))
  }

  // ── Intersection observer for active nav ────────────────────────────────────

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { rootMargin: '-20% 0px -60% 0px' }
    )
    for (const item of NAV_ITEMS) {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [])

  // ── Computed progress ───────────────────────────────────────────────────────

  const focusProgress = goals.focusAreas.map(f => ({
    area: f.title.split(':')[0].split('(')[0].trim(),
    progress: calcProgress(f.milestones),
  }))

  const growthProgress = goals.growthGoals.map(g => ({
    area: g.title.split('&')[0].trim(),
    progress: calcProgress(g.milestones),
  }))

  const radarData = [...focusProgress, ...growthProgress]

  const overallProgress = radarData.length
    ? Math.round(radarData.reduce((sum, d) => sum + d.progress, 0) / radarData.length)
    : 0

  const RING_RADIUS = 34
  const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

  // ── Icon map ────────────────────────────────────────────────────────────────

  const iconMap = {
    rocket: Rocket,
    trending: TrendingUp,
    target: Target,
    palette: Palette,
    users: Users,
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* ── Sticky Nav ──────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.06)]">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-14">
          <span className="text-sm font-semibold tracking-tight text-slate-800">
            Forward Focus 2026
          </span>
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(item => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? 'bg-xeneta-500 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative pt-14 overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 opacity-[0.05]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
              <pattern id="dots" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-xeneta-500/15 rounded-full blur-[128px] -translate-y-1/2 translate-x-1/3" />

        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 text-xeneta-400 text-sm font-medium mb-6">
                <Calendar className="w-4 h-4" />
                <span>2026 Goals & Development</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-4">
                James Peel
              </h1>
              <p className="text-lg text-slate-400 mb-2">
                Senior Product Designer at Xeneta
              </p>
              <p className="text-xl md:text-2xl text-slate-300 font-light mt-6 leading-relaxed">
                Turning complex problems into products people actually use.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 shrink-0">
              <svg className="w-28 h-28" viewBox="0 0 80 80">
                <circle
                  cx="40" cy="40" r={RING_RADIUS}
                  fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5"
                />
                <circle
                  cx="40" cy="40" r={RING_RADIUS}
                  fill="none" stroke="#135DFF" strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={RING_CIRCUMFERENCE}
                  strokeDashoffset={RING_CIRCUMFERENCE * (1 - overallProgress / 100)}
                  transform="rotate(-90 40 40)"
                  className="transition-all duration-700 ease-out"
                  style={{ filter: 'drop-shadow(0 0 6px rgba(19, 93, 255, 0.4))' }}
                />
                <text x="40" y="36" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="20" fontWeight="700">
                  {overallProgress}%
                </text>
                <text x="40" y="52" textAnchor="middle" dominantBaseline="central" fill="#94a3b8" fontSize="8" fontWeight="500" letterSpacing="1">
                  OVERALL
                </text>
              </svg>
              <span className="text-sm text-slate-400 font-medium">Progress</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Focus Areas ─────────────────────────────────────────────────────── */}
      <section id="focus" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader label="2026 Focus Areas" title="Where my energy goes this year" />
          <div className="grid md:grid-cols-2 gap-6 mt-10">
            {goals.focusAreas.map(area => {
              const Icon = iconMap[area.icon] || Rocket
              const progress = calcProgress(area.milestones)
              const doneCount = area.milestones.filter(m => m.done).length
              const isOpen = goals.expanded[area.id]
              return (
                <div
                  key={area.id}
                  className="rounded-[2.5rem] shadow-[0_8px_24px_rgba(0,0,0,0.08)] p-8 md:p-10 hover:shadow-[0_12px_32px_rgba(0,0,0,0.14)] transition-shadow duration-300"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-xeneta-50 text-xeneta-500 shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-semibold leading-tight">{area.title}</h3>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {area.description}
                  </p>
                  <div className="bg-xeneta-50 rounded-2xl p-4 mb-5">
                    <p className="text-xs font-semibold text-xeneta-600 uppercase tracking-wide mb-1">
                      SMART Goal
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed">{area.smartGoal}</p>
                  </div>
                  <ProgressBar
                    progress={progress}
                    doneCount={doneCount}
                    totalCount={area.milestones.length}
                  />
                  <button
                    onClick={() => toggleExpanded(area.id)}
                    className="flex items-center gap-2 text-sm text-xeneta-500 font-medium mt-1 mb-2 hover:text-xeneta-600 transition-colors cursor-pointer"
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    {isOpen ? 'Hide milestones' : `Show milestones (${doneCount} of ${area.milestones.length} complete)`}
                  </button>
                  <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden">
                      <MilestoneList
                        milestones={area.milestones}
                        onToggle={i => toggleFocusMilestone(area.id, i)}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Growth Goals ────────────────────────────────────────────────────── */}
      <section id="growth" className="py-20 bg-offwhite">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader label="Lead-Level Growth" title="Building towards the next step" />
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {goals.growthGoals.map(g => {
              const Icon = iconMap[g.icon] || Target
              const progress = calcProgress(g.milestones)
              const doneCount = g.milestones.filter(m => m.done).length
              const isOpen = goals.expanded[g.id]
              return (
                <div
                  key={g.id}
                  className="rounded-[2.5rem] shadow-[0_8px_24px_rgba(0,0,0,0.08)] bg-white p-7 hover:shadow-[0_12px_32px_rgba(0,0,0,0.14)] transition-shadow duration-300"
                >
                  <div className="p-2 rounded-xl bg-xeneta-50 text-xeneta-500 w-fit mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{g.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-5">{g.description}</p>
                  <ProgressBar
                    progress={progress}
                    doneCount={doneCount}
                    totalCount={g.milestones.length}
                  />
                  <button
                    onClick={() => toggleExpanded(g.id)}
                    className="flex items-center gap-2 text-sm text-xeneta-500 font-medium mt-1 mb-2 hover:text-xeneta-600 transition-colors cursor-pointer"
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    {isOpen ? 'Hide milestones' : `Show milestones (${doneCount} of ${g.milestones.length} complete)`}
                  </button>
                  <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden">
                      <MilestoneList
                        milestones={g.milestones}
                        onToggle={i => toggleGrowthMilestone(g.id, i)}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Progress Overview (Recharts) ────────────────────────────────────── */}
      <section id="overview" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader label="Progress Overview" title="At a glance" />
          <p className="mt-2 text-sm text-slate-500">
            Overall progress: <span className="font-bold text-xeneta-500">{overallProgress}%</span>
          </p>
          <div className="mt-10 flex justify-center">
            <div className="w-full max-w-2xl h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="58%">
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis
                    dataKey="area"
                    tick={(props) => {
                      const datum = radarData.find(d => d.area === props.payload.value)
                      const pct = datum ? datum.progress : 0
                      const textAnchor = props.x > props.cx + 5 ? 'start' : props.x < props.cx - 5 ? 'end' : 'middle'
                      const dy = props.y > props.cy ? 12 : props.y < props.cy ? -4 : 0
                      return (
                        <g>
                          <text x={props.x} y={props.y + dy} textAnchor={textAnchor} fill="#475569" fontSize={14} fontWeight={500}>
                            {props.payload.value}
                          </text>
                          <text x={props.x} y={props.y + dy + 17} textAnchor={textAnchor} fill="#135DFF" fontSize={13} fontWeight={600}>
                            {pct}%
                          </text>
                        </g>
                      )
                    }}
                  />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <Radar
                    name="Progress"
                    dataKey="progress"
                    stroke="#135DFF"
                    fill="#135DFF"
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'Progress']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline ────────────────────────────────────────────────────────── */}
      <section id="timeline" className="py-20 bg-offwhite">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader label="Roadmap" title="2026 at a glance" />
          <div className="mt-10 grid md:grid-cols-4 gap-4">
            {TIMELINE_DATA.map(q => (
              <div key={q.quarter}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-navy text-white text-xs font-bold flex items-center justify-center">
                    {q.quarter}
                  </div>
                  <div className="flex-1 h-px bg-slate-300" />
                </div>
                <div className="space-y-2">
                  {q.items.map((item, j) => (
                    <div
                      key={j}
                      className={`text-sm rounded-lg px-3 py-2 border ${TRACK_STYLES[item.track]}`}
                    >
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 mt-8 justify-center">
            {Object.entries(TRACK_LEGEND).map(([key, val]) => (
              <div key={key} className="flex items-center gap-2 text-sm text-slate-600">
                <span className={`w-3 h-3 rounded-full ${val.dot}`} />
                {val.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Development Plan 70:20:10 ───────────────────────────────────────── */}
      <section id="dev-plan" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader label="Development Plan" title="70 : 20 : 10" />
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {DEV_PLAN_DATA.map(col => (
              <div key={col.label} className="rounded-[2.5rem] shadow-[0_8px_24px_rgba(0,0,0,0.08)] p-7">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-2xl font-bold ${col.accent}`}>{col.pct}%</span>
                  <span className="text-sm font-semibold text-slate-700">{col.label}</span>
                </div>
                <ul className="space-y-2.5">
                  {col.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <ChevronRight className="w-4 h-4 text-xeneta-500 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Metrics Table ───────────────────────────────────────────────────── */}
      <section id="metrics" className="py-20 bg-offwhite">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader label="Measuring Success" title="How we know it is working" />
          <div className="mt-10 overflow-x-auto rounded-[2.5rem] shadow-[0_8px_24px_rgba(0,0,0,0.08)] bg-white p-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-500 border-b border-slate-200">
                  <th className="pb-3 pr-4 font-semibold">Goal</th>
                  <th className="pb-3 pr-4 font-semibold">Metric</th>
                  <th className="pb-3 pr-4 font-semibold">Target</th>
                  <th className="pb-3 pr-4 font-semibold">Current</th>
                  <th className="pb-3 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {goals.metrics.map(m => {
                  const st = STATUS_DISPLAY[m.status]
                  return (
                    <tr key={m.id} className="border-b border-slate-100 hover:bg-offwhite/60">
                      <td className="py-3 pr-4 font-medium text-slate-800">{m.goal}</td>
                      <td className="py-3 pr-4 text-slate-600">{m.metric}</td>
                      <td className="py-3 pr-4 text-slate-700 font-medium">{m.target}</td>
                      <td className="py-3 pr-4 text-slate-600">{m.current}</td>
                      <td className="py-3 text-center">
                        <button
                          onClick={() => cycleMetricStatus(m.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${st.colour}`}
                          title={`Click to change (currently: ${st.label})`}
                        >
                          <span>{st.emoji}</span>
                          <span>{st.label}</span>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 mt-4 text-center">
            Click any status indicator to cycle through: Not started, In progress, On track, At risk
          </p>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="py-12 bg-navy text-center">
        <p className="text-slate-400 text-sm">
          James Peel &middot; Forward Focus 2026
        </p>
        <p className="text-slate-600 text-xs mt-2">
          Built with care, not just Figma.
        </p>
      </footer>
    </div>
  )
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionHeader({ label, title }) {
  return (
    <div>
      <p className="text-sm font-semibold text-xeneta-500 uppercase tracking-wide mb-1">{label}</p>
      <h2 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h2>
    </div>
  )
}

function ProgressBar({ progress, doneCount, totalCount }) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-slate-500">
          {doneCount} of {totalCount} complete
        </span>
        <span className="text-sm font-bold text-xeneta-500">{progress}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
        <div
          className="h-full rounded-full bg-xeneta-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

function MilestoneList({ milestones, onToggle }) {
  return (
    <ul className="space-y-1">
      {milestones.map((m, i) => (
        <li key={i}>
          <button
            onClick={() => onToggle(i)}
            className="flex items-start gap-2.5 w-full text-left py-1.5 px-1 -mx-1 rounded-lg hover:bg-slate-50 transition-colors group cursor-pointer"
          >
            <span
              className={`mt-0.5 shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                m.done
                  ? 'bg-xeneta-500 border-xeneta-500 scale-100'
                  : 'border-slate-300 group-hover:border-xeneta-400'
              }`}
            >
              {m.done && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
            </span>
            <span
              className={`text-sm leading-snug transition-colors duration-200 ${
                m.done ? 'text-slate-400 line-through' : 'text-slate-700'
              }`}
            >
              {m.text}
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}

// ─── Static data ─────────────────────────────────────────────────────────────

const TRACK_STYLES = {
  'free-tier': 'bg-xeneta-50 border-xeneta-100 text-xeneta-700',
  indexing:    'bg-amber-50 border-amber-200 text-amber-800',
  platform:   'bg-slate-100 border-slate-200 text-slate-700',
}

const TRACK_LEGEND = {
  'free-tier': { dot: 'bg-xeneta-500',  label: 'Free Tier' },
  indexing:    { dot: 'bg-amber-500',  label: 'Indexing' },
  platform:   { dot: 'bg-slate-400',  label: 'Platform / Growth' },
}

const TIMELINE_DATA = [
  {
    quarter: 'Q1',
    items: [
      { text: 'Free Tier discovery & research', track: 'free-tier' },
      { text: 'Simulator UX improvements: guidance, education, mode simplification', track: 'indexing' },
      { text: 'Navigation & search design', track: 'platform' },
    ],
  },
  {
    quarter: 'Q2',
    items: [
      { text: 'Free Tier launch', track: 'free-tier' },
      { text: 'Indexing round 2: sharing, collaboration, chart readability', track: 'indexing' },
      { text: 'Bundles page iteration', track: 'platform' },
    ],
  },
  {
    quarter: 'Q3',
    items: [
      { text: 'Free Tier measurement & iteration', track: 'free-tier' },
      { text: 'Indexing futures & derivatives early discovery', track: 'indexing' },
      { text: 'Design system governance rollout', track: 'platform' },
    ],
  },
  {
    quarter: 'Q4',
    items: [
      { text: 'Platform-wide UX review', track: 'platform' },
      { text: 'Indexing adoption push & iteration', track: 'indexing' },
      { text: 'Year-end impact assessment', track: 'platform' },
    ],
  },
]

const DEV_PLAN_DATA = [
  {
    pct: 70,
    label: 'On-the-job',
    accent: 'text-xeneta-500',
    items: [
      'Lead Free Tier end-to-end from concept to launch',
      'Drive Simulator UX improvements based on workshop research',
      'Define and track UX success metrics independently from commercial targets',
      'Present design direction to leadership quarterly',
    ],
  },
  {
    pct: 20,
    label: 'Social learning',
    accent: 'text-amber-600',
    items: [
      'Lead structured UX critique sessions on team calls',
      'Run monthly Product Showcase',
      'Collaborate with CS and Sales teams on indexing adoption barriers',
      'Participate in cross-functional workshops on futures and derivatives positioning',
    ],
  },
  {
    pct: 10,
    label: 'Formal learning',
    accent: 'text-indigo-600',
    items: [
      'Complete a course on product strategy or growth design (e.g., Reforge, Nielsen Norman Group)',
      'Attend UX Nordic or a similar industry conference',
      'Study competitor free-tier and self-serve onboarding experiences',
    ],
  },
]

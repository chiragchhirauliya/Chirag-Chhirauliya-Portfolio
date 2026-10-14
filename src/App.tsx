import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpCircle,
  Briefcase,
  CalendarDays,
  Code2,
  Cpu,
  Database,
  Download,
  ExternalLink,
  GraduationCap,
  Globe,
  HeartHandshake,
  Mail,
  Menu,
  Phone,
  Sparkles,
  Sun,
  TerminalSquare,
  Trophy,
  Moon,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { achievements, education, experiences, navItems, profile, projects, skillGroups, socialLinks } from './data/profile'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
const localResumeUrl = profile.resumeLocal
const fallbackResumeUrl = profile.resumeGoogle
const sectionInView = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const iconMap = {
  Code2,
  Cpu,
  Globe,
  TerminalSquare,
}

const experienceIconMap = {
  Hackathon: Trophy,
  Internship: Briefcase,
  Volunteering: HeartHandshake,
}

const revealUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
}

function NeonCursor() {
  const prefersReducedMotion = useReducedMotion()
  const layerRef = useRef<HTMLDivElement>(null)
  const coreRef = useRef<HTMLSpanElement>(null)
  const trailRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (prefersReducedMotion) {
      document.documentElement.classList.remove('custom-neon-cursor')
      return
    }

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let enabled = false
    let frameId = 0
    let pointerX = -100
    let pointerY = -100
    let coreX = pointerX
    let coreY = pointerY
    let trailX = pointerX
    let trailY = pointerY

    const updatePositions = () => {
      coreX += (pointerX - coreX) * 0.36
      coreY += (pointerY - coreY) * 0.36
      trailX += (pointerX - trailX) * 0.17
      trailY += (pointerY - trailY) * 0.17

      if (coreRef.current) {
        coreRef.current.style.transform = `translate3d(${coreX}px, ${coreY}px, 0) translate(-50%, -50%)`
      }
      if (trailRef.current) {
        trailRef.current.style.transform = `translate3d(${trailX}px, ${trailY}px, 0) translate(-50%, -50%)`
      }

      const coreSettled = Math.abs(pointerX - coreX) + Math.abs(pointerY - coreY) < 0.15
      const trailSettled = Math.abs(pointerX - trailX) + Math.abs(pointerY - trailY) < 0.3
      if (coreSettled && trailSettled) {
        frameId = 0
        return
      }

      frameId = window.requestAnimationFrame(updatePositions)
    }

    const schedulePositionUpdate = () => {
      if (!frameId) frameId = window.requestAnimationFrame(updatePositions)
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      if (reducedMotion.matches) {
        disableCursor()
        return
      }

      pointerX = event.clientX
      pointerY = event.clientY
      const target = event.target instanceof Element ? event.target : null
      const layer = layerRef.current
      if (layer) {
        layer.classList.add('is-visible')
        layer.classList.toggle('is-interactive', Boolean(target?.closest('a, button, [role="button"]')))
        layer.classList.toggle('is-native-control', Boolean(target?.closest('input, textarea, select, [contenteditable="true"], [role="slider"], [role="spinbutton"]')))
      }
      schedulePositionUpdate()
    }

    const handlePointerDown = () => layerRef.current?.classList.add('is-pressed')
    const handlePointerUp = () => layerRef.current?.classList.remove('is-pressed')
    const handlePointerLeave = () => layerRef.current?.classList.remove('is-visible', 'is-interactive', 'is-native-control', 'is-pressed')

    const disableCursor = () => {
      if (!enabled) return
      enabled = false
      document.documentElement.classList.remove('custom-neon-cursor')
      layerRef.current?.classList.remove('is-visible', 'is-interactive', 'is-native-control', 'is-pressed')
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
      window.removeEventListener('pointerleave', handlePointerLeave)
      if (frameId) window.cancelAnimationFrame(frameId)
      frameId = 0
    }

    const syncCursorSupport = () => {
      if (!finePointer.matches || reducedMotion.matches) {
        disableCursor()
        return
      }
      if (enabled) return

      enabled = true
      document.documentElement.classList.add('custom-neon-cursor')
      window.addEventListener('pointermove', handlePointerMove, { passive: true })
      window.addEventListener('pointerdown', handlePointerDown, { passive: true })
      window.addEventListener('pointerup', handlePointerUp, { passive: true })
      window.addEventListener('pointercancel', handlePointerUp, { passive: true })
      window.addEventListener('pointerleave', handlePointerLeave)
    }

    finePointer.addEventListener('change', syncCursorSupport)
    reducedMotion.addEventListener('change', syncCursorSupport)
    syncCursorSupport()

    return () => {
      disableCursor()
      finePointer.removeEventListener('change', syncCursorSupport)
      reducedMotion.removeEventListener('change', syncCursorSupport)
      document.documentElement.classList.remove('custom-neon-cursor')
    }
  }, [prefersReducedMotion])

  return (
    <div ref={layerRef} className="neon-cursor-layer" aria-hidden="true">
      <span ref={trailRef} className="neon-cursor-trail">
        <span className="neon-cursor-trail-visual" />
      </span>
      <span ref={coreRef} className="neon-cursor-core">
        <span className="neon-cursor-core-visual" />
      </span>
    </div>
  )
}

function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => document.documentElement.dataset.theme === 'light' ? 'light' : 'dark')
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[number] | null>(null)
  const [projectFilter, setProjectFilter] = useState('All')
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [formFeedback, setFormFeedback] = useState('')
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const filteredProjects = useMemo(() => {
    if (projectFilter === 'All') return projects
    return projects.filter((project) => project.stack.includes(projectFilter))
  }, [projectFilter])

  const handleInputChange = (field: string, value: string) => {
    setFormValues((current) => ({ ...current, [field]: value }))
  }

  const handleThemeToggle = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = nextTheme
    setTheme(nextTheme)
    try {
      window.localStorage.setItem('portfolio-theme', nextTheme)
    } catch {
      // Theme switching still works for this session when storage is unavailable.
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmed = {
      name: formValues.name.trim(),
      email: formValues.email.trim(),
      subject: formValues.subject.trim(),
      message: formValues.message.trim(),
    }

    if (!trimmed.name || !trimmed.email || !trimmed.subject || !trimmed.message) {
      setFormState('error')
      setFormFeedback('Please fill in all the fields before submitting.')
      return
    }

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed.email)
    if (!validEmail) {
      setFormState('error')
      setFormFeedback('Please provide a valid email address.')
      return
    }

    setFormState('submitting')
    setFormFeedback('Sending your message...')

    try {
      const response = await fetch(`${apiBaseUrl}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trimmed),
      })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.message || 'Unable to send the message right now.')
      }

      setFormState('success')
      setFormFeedback(payload.message || 'Message sent successfully. I will get back to you shortly.')
      setFormValues({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      setFormState('error')
      setFormFeedback(error instanceof Error ? error.message : 'There was a problem sending your message.')
    }
  }

  const visibleProjects = filteredProjects
  const currentEducation = education.find((item) => item.degree === 'B.Tech')
  const hackathonParticipationCount = experiences.filter((item) => item.category === 'Hackathon').length

  return (
    <MotionConfig reducedMotion="user">
    <div className="portfolio-shell min-h-screen overflow-x-hidden">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/75 shadow-[0_10px_30px_rgba(2,6,23,0.7)] backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <motion.button
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.99 }}
            type="button"
            onClick={() => sectionInView('home')}
            className="nav-brand flex shrink-0 items-center gap-2.5 text-base font-semibold tracking-tight text-white transition hover:text-cyan-200 sm:gap-3 sm:text-lg"
            aria-label="Go to home"
          >
            <span className="nav-profile-photo-frame">
              <img src={profile.image} alt="" />
            </span>
            <span className="nav-brand-name">Chirag Chhirauliya</span>
          </motion.button>

          <nav className="hidden items-center gap-6 xl:flex" aria-label="Primary navigation">
            {navItems.map((item) => (
              <motion.button
                key={item.href}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => sectionInView(item.href.replace('#', ''))}
                className="nav-link text-sm text-slate-300 transition hover:text-white"
              >
                {item.label}
              </motion.button>
            ))}
          </nav>

          <div className="hidden xl:flex">
            <a
              href={localResumeUrl}
              download="Chirag-Chhirauliya-Resume.pdf"
              className="inline-flex items-center gap-2 rounded-full border border-cyan-400/60 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:border-cyan-300 hover:bg-cyan-500/20"
            >
              <Download size={16} />
              Resume
            </a>
          </div>

          <button
            type="button"
            onClick={handleThemeToggle}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-pressed={theme === 'light'}
            className="theme-toggle inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-slate-900/60 text-cyan-200 transition"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ opacity: 0, rotate: -35, scale: 0.75 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 35, scale: 0.75 }}
                transition={{ duration: 0.18 }}
                className="inline-flex"
              >
                {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
              </motion.span>
            </AnimatePresence>
          </button>

          <button
            type="button"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-slate-900/60 xl:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-white/10 bg-slate-950 px-4 py-3 xl:hidden"
            >
              <div className="flex flex-col gap-3">
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => {
                      sectionInView(item.href.replace('#', ''))
                      setMenuOpen(false)
                    }}
                    className="text-left text-sm text-slate-300"
                  >
                    {item.label}
                  </button>
                ))}
                <a href={localResumeUrl} download="Chirag-Chhirauliya-Resume.pdf" className="inline-flex items-center gap-2 text-sm text-cyan-300">
                  <Download size={16} />
                  Download Resume
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        <section id="home" className="relative z-10 overflow-hidden">
          <div className="relative mx-auto grid max-w-7xl gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[1.12fr_0.88fr] lg:px-8 lg:py-24">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex flex-col justify-center">
              <div className="mb-6 inline-flex w-max items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.28em] text-cyan-200 shadow-[0_0_25px_rgba(34,211,238,0.18)]">
                <Sparkles size={12} />
                Creative Developer • Student • Problem Solver
              </div>

              <h1 className="max-w-xl text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl lg:text-7xl">
                Hi, I&apos;m <span className="gradient-text">Chirag Chhirauliya</span>
                <span className="mt-3 block text-3xl sm:text-4xl lg:text-6xl">
                  Building <span className="gradient-text">digital ideas</span> that feel alive.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-lg font-medium text-sky-200">{profile.title}</p>

              <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">
                {profile.bio}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button type="button" onClick={() => sectionInView('projects')} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 px-5 py-3 font-semibold text-white shadow-[0_15px_40px_rgba(59,130,246,0.35)] transition">
                  View My Projects
                  <ArrowRight size={16} />
                </button>
                <a href={localResumeUrl} download="Chirag-Chhirauliya-Resume.pdf" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-slate-900/60 px-5 py-3 font-semibold text-white transition hover:border-cyan-400/60 hover:bg-slate-800">
                  <Download size={16} />
                  Download Resume
                </a>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href={profile.github} target="_blank" rel="noreferrer" aria-label="Open Chirag's GitHub profile" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/60 p-3 text-slate-100 transition hover:border-cyan-400/60 hover:bg-cyan-500/5 hover:text-cyan-200">
                  <Globe size={18} />
                  GitHub
                </a>
                <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="Open Chirag's LinkedIn profile" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/60 p-3 text-slate-100 transition hover:border-cyan-400/60 hover:bg-cyan-500/5 hover:text-cyan-200">
                  <Briefcase size={18} />
                  LinkedIn
                </a>
                <a href={profile.leetcode} target="_blank" rel="noreferrer" aria-label="Open Chirag's LeetCode profile" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/60 p-3 text-slate-100 transition hover:border-cyan-400/60 hover:bg-cyan-500/5 hover:text-cyan-200">
                  <Code2 size={18} />
                  LeetCode
                </a>
              </div>

              <div className="mt-10 grid max-w-xl gap-3 sm:grid-cols-3">
                <div className="floating-card rounded-2xl border border-white/10 bg-slate-900/35 p-3">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Focus</div>
                  <div className="mt-2 text-lg font-semibold text-white">Web Dev</div>
                </div>
                <div className="floating-card rounded-2xl border border-white/10 bg-slate-900/35 p-3">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Learning</div>
                  <div className="mt-2 text-lg font-semibold text-white">Data Science</div>
                </div>
                <div className="floating-card rounded-2xl border border-white/10 bg-slate-900/35 p-3">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Location</div>
                  <div className="mt-2 text-lg font-semibold text-white">Bhopal</div>
                </div>
              </div>
            </motion.div>

            <div className="flex items-center justify-center">
              <div className="profile-image-frame max-w-[340px] sm:max-w-[380px]">
                <img src={profile.image} alt="Portrait of Chirag Chhirauliya" />
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="about-content mx-auto max-w-5xl">
            <div className="mb-8 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">About me</div>
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              className="about-heading text-3xl font-semibold text-white sm:text-4xl"
            >
              Building practical tech solutions
            </motion.h2>
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="about-accent mt-4 block h-[3px] w-16 origin-left rounded-full"
              aria-hidden="true"
            />
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.42, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 max-w-4xl text-base leading-8 text-slate-300 sm:text-lg"
            >
              I&apos;m a Computer Science Engineering student with a strong interest in programming, problem-solving, web development, and Data Science. I enjoy learning new tools, building meaningful applications, and strengthening my understanding of computer science fundamentals.
            </motion.p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] border border-white/10 bg-slate-900/60 p-5 shadow-[0_12px_25px_rgba(15,23,42,0.35)]">
                <div className="mb-3 flex items-center gap-2 text-cyan-300"><GraduationCap size={18} />Education</div>
                <p className="font-semibold text-white">{currentEducation?.degree} in {currentEducation?.branch}</p>
                <p className="mt-2 text-slate-300">{currentEducation?.institution}</p>
                <p className="mt-1 text-slate-400">{currentEducation?.duration}</p>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-slate-900/60 p-5 shadow-[0_12px_25px_rgba(15,23,42,0.35)]">
                <div className="mb-3 flex items-center gap-2 text-violet-300"><Database size={18} />Interests</div>
                <ul className="space-y-2 text-slate-300">
                  {currentEducation?.interests?.map((interest) => (
                    <li key={interest}>• {interest}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 rounded-3xl border border-white/10 bg-slate-900/60 p-6">
              <h3 className="text-lg font-bold text-white">Learning goals</h3>
              <ul className="mt-4 space-y-3 text-slate-300">
                <li>• Strengthen Data Structures and Algorithms fundamentals.</li>
                <li>• Build responsive web experiences and product-grade interfaces.</li>
                <li>• Explore Data Science workflows and practical AI concepts.</li>
                <li>• Keep improving through projects, coding practice, and real-world application.</li>
              </ul>
            </div>
          </div>
        </section>

        <motion.section {...revealUp} id="skills" className="relative z-10 bg-slate-950/70 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-violet-300">
              <Code2 size={18} />
              Skills
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {skillGroups.map((group, index) => {
                const Icon = iconMap[group.icon as keyof typeof iconMap] || Code2

                return (
                  <motion.div
                    key={group.title}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.45, delay: index * 0.08 }}
                    whileHover={{ y: -4 }}
                    className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-900/80 p-5 shadow-[0_15px_35px_rgba(15,23,42,0.35)]"
                  >
                    <div className="mb-4 flex items-center gap-3 text-cyan-300">
                      <div className="rounded-xl bg-cyan-500/10 p-2">
                        <Icon size={18} />
                      </div>
                      <h3 className="text-lg font-semibold text-white">{group.title}</h3>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span key={item} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-slate-200">
                          {item}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.section>

        <motion.section {...revealUp} id="projects" className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-cyan-300">
              <Briefcase size={18} />
              Selected Work
            </div>
            <div className="flex w-full flex-wrap gap-2 sm:w-auto">
              {['All', 'HTML', 'React', 'Python', 'JavaScript'].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setProjectFilter(filter)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    projectFilter === filter ? 'border-cyan-400 bg-cyan-500/15 text-cyan-100' : 'border-white/10 bg-slate-900/50 text-slate-300'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            {visibleProjects.map((project, index) => (
              <motion.article key={project.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} whileHover={{ y: -6, scale: 1.005 }} transition={{ duration: 0.45, delay: index * 0.08, type: 'spring', stiffness: 220, damping: 20 }} className="group overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/70 shadow-[0_15px_40px_rgba(15,23,42,0.6)] transition">
                <div className="relative aspect-[16/9] overflow-hidden border-b border-white/10">
                  <img src={project.image} alt={project.imageAlt} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
                </div>
                <div className="space-y-4 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl font-semibold text-white">{project.shortTitle}</h3>
                    <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-emerald-200">
                      {project.status}
                    </span>
                  </div>

                  <p className="text-sm leading-7 text-slate-300">{project.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((item) => (
                      <span key={item} className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-wide text-slate-200">
                        {item}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    className="inline-flex items-center gap-2 text-sm font-medium text-cyan-200 transition hover:text-cyan-100"
                  >
                    View details
                    <ArrowRight size={14} />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section {...revealUp} id="github" className="relative z-10 bg-slate-950/70 py-16">
          <div className="mx-auto grid max-w-7xl items-stretch gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <motion.article whileHover={{ y: -4 }} className="social-profile-card flex h-full flex-col rounded-[28px] border border-white/10 bg-slate-900/70 p-7 shadow-[0_20px_50px_rgba(14,116,144,0.2)] sm:p-8">
              <div className="mb-5 flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-cyan-300">
                <Globe size={20} />
                GitHub
              </div>
              <h3 className="text-2xl font-semibold text-white sm:text-3xl">View my GitHub profile</h3>
              <p className="mt-4 text-base leading-8 text-slate-300">
                Explore my repositories, projects, and code experiments directly on GitHub.
              </p>
              <a href={profile.github} target="_blank" rel="noreferrer" className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 px-5 py-3 font-semibold text-white transition hover:scale-[1.02]">
                Open GitHub Profile
                <ExternalLink size={16} />
              </a>
            </motion.article>

            <motion.article id="leetcode" whileHover={{ y: -4 }} className="social-profile-card flex h-full flex-col rounded-[28px] border border-white/10 bg-slate-900/70 p-7 shadow-[0_20px_50px_rgba(14,116,144,0.2)] sm:p-8">
              <div className="mb-5 flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-violet-300">
                <Code2 size={20} />
                LeetCode
              </div>
              <h3 className="text-2xl font-semibold text-white sm:text-3xl">View my LeetCode profile</h3>
              <p className="mt-4 text-base leading-8 text-slate-300">
                Explore my coding solutions, problem-solving practice, and algorithm challenges on LeetCode.
              </p>
              <a href={profile.leetcode} target="_blank" rel="noreferrer" className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 px-5 py-3 font-semibold text-white transition hover:scale-[1.02]">
                Open LeetCode Profile
                <ExternalLink size={16} />
              </a>
            </motion.article>
          </div>
        </motion.section>

        <motion.section {...revealUp} id="education" className="relative z-10 bg-slate-950/70 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-cyan-300">
              <GraduationCap size={18} />
              Education
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {education.map((item, index) => {
                const isCurrentDegree = item.degree === 'B.Tech'

                return (
                  <motion.article
                    key={item.degree}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.45, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className={`education-card flex h-full flex-col rounded-[24px] border bg-slate-900/70 p-6 shadow-[0_15px_40px_rgba(15,23,42,0.35)] ${isCurrentDegree ? 'education-card-current border-cyan-400/30' : 'border-white/10'}`}
                  >
                    <div className="mb-5 flex items-center justify-between gap-3">
                      <span className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border ${isCurrentDegree ? 'border-cyan-400/30 bg-cyan-500/10 text-cyan-200' : 'border-white/10 bg-white/5 text-slate-200'}`}>
                        <GraduationCap size={21} />
                      </span>
                      <span className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">{item.duration}</span>
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">{item.qualification}</p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">{item.degree}</h3>
                    {item.branch && <p className="mt-2 text-sm leading-6 text-violet-200">{item.branch}</p>}
                    <p className="mt-4 flex-1 text-sm leading-7 text-slate-300">{item.institution}</p>
                    {item.cgpa && (
                      <div className="education-cgpa mt-5 inline-flex w-fit items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100">
                        Current CGPA <strong className="text-white">{item.cgpa}</strong>
                      </div>
                    )}
                    {item.interests && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {item.interests.map((interest) => (
                          <span key={interest} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-200">{interest}</span>
                        ))}
                      </div>
                    )}
                  </motion.article>
                )
              })}
            </div>
          </div>
        </motion.section>

        <motion.section {...revealUp} id="experience" className="relative z-10 bg-slate-950/70 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-cyan-300">
                <Briefcase size={18} />
                Experience, Hackathons &amp; Volunteering
              </div>
              <div className="w-fit rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100">
                {hackathonParticipationCount} National-Level Hackathon Participations
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {experiences.map((item, index) => {
                const Icon = experienceIconMap[item.category]

                return (
                  <motion.article
                    key={`${item.category}-${item.title}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.12 }}
                    transition={{ duration: 0.45, delay: index * 0.08 }}
                    whileHover={{ y: -4 }}
                    className="experience-card flex h-full flex-col rounded-[24px] border border-white/10 bg-slate-900/70 p-6 shadow-[0_15px_40px_rgba(15,23,42,0.35)] sm:p-7"
                  >
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-200">
                        <Icon size={21} />
                      </span>
                      <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-200">
                        {item.category}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold leading-snug text-white sm:text-2xl">{item.title}</h3>
                    <p className="mt-2 text-sm font-medium text-cyan-200">{item.organization}</p>
                    {item.duration && (
                      <p className="mt-3 inline-flex items-center gap-2 text-sm text-slate-400">
                        <CalendarDays size={15} />
                        {item.duration}
                      </p>
                    )}
                    <p className="mt-4 text-sm leading-7 text-slate-300">{item.description}</p>
                    {item.responsibilities && (
                      <ul className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm leading-6 text-slate-300">
                        {item.responsibilities.map((responsibility) => (
                          <li key={responsibility} className="flex gap-2.5">
                            <span className="mt-[0.65rem] h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" aria-hidden="true" />
                            <span>{responsibility}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.article>
                )
              })}
            </div>
          </div>
        </motion.section>

        <motion.section {...revealUp} id="achievements" className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-violet-300">
            <Trophy size={18} />
            Achievements & activities
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {achievements.map((item) => (
              <div key={item.title} className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
                <div className="mb-4 inline-flex rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-cyan-200">
                  {item.tag}
                </div>
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section {...revealUp} id="resume" className="relative z-10 bg-slate-950/70 py-16">
          <div className="mx-auto max-w-5xl rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8 sm:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-3 text-sm uppercase tracking-[0.2em] text-cyan-300">Resume</div>
                <h3 className="text-3xl font-semibold text-white">Download my verified resume</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href={localResumeUrl} download="Chirag-Chhirauliya-Resume.pdf" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 px-5 py-3 font-semibold text-white">
                  <Download size={16} />
                  Download PDF
                </a>
                <a href={fallbackResumeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white">
                  Open Drive copy
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section {...revealUp} id="contact" className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-cyan-300">
            <Mail size={18} />
            Contact
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="space-y-5 rounded-[28px] border border-white/10 bg-slate-900/60 p-6 shadow-[0_15px_35px_rgba(15,23,42,0.4)]">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Direct contact</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">Let&apos;s connect</h3>
              </div>

              <a href={socialLinks.email} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-200 transition hover:border-cyan-400/50 hover:bg-cyan-500/5">
                <Mail size={18} className="text-cyan-300" />
                {profile.email}
              </a>
              <a href={socialLinks.phone} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-200 transition hover:border-cyan-400/50 hover:bg-cyan-500/5">
                <Phone size={18} className="text-cyan-300" />
                {profile.phone}
              </a>
              <a href={profile.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-200 transition hover:border-cyan-400/50 hover:bg-cyan-500/5">
                <Globe size={18} className="text-cyan-300" />
                GitHub
              </a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-200 transition hover:border-cyan-400/50 hover:bg-cyan-500/5">
                <Briefcase size={18} className="text-cyan-300" />
                LinkedIn
              </a>
              <a href={profile.leetcode} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-200 transition hover:border-cyan-400/50 hover:bg-cyan-500/5">
                <Code2 size={18} className="text-cyan-300" />
                LeetCode
              </a>
            </div>

            <form onSubmit={handleSubmit} className="rounded-[28px] border border-white/10 bg-slate-900/60 p-6 shadow-[0_15px_35px_rgba(15,23,42,0.4)]">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block text-sm text-slate-300">
                  Name
                  <input
                    type="text"
                    value={formValues.name}
                    onChange={(event) => handleInputChange('name', event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                    placeholder="Your name"
                  />
                </label>

                <label className="block text-sm text-slate-300">
                  Email
                  <input
                    type="email"
                    value={formValues.email}
                    onChange={(event) => handleInputChange('email', event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                    placeholder="you@example.com"
                  />
                </label>
              </div>

              <label className="mt-5 block text-sm text-slate-300">
                Subject
                <input
                  type="text"
                  value={formValues.subject}
                  onChange={(event) => handleInputChange('subject', event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                  placeholder="Project opportunity, collaboration, or question"
                />
              </label>

              <label className="mt-5 block text-sm text-slate-300">
                Message
                <textarea
                  value={formValues.message}
                  onChange={(event) => handleInputChange('message', event.target.value)}
                  className="mt-2 min-h-[160px] w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                  placeholder="Write your message here..."
                />
              </label>

              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  disabled={formState === 'submitting'}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 px-5 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {formState === 'submitting' ? 'Sending...' : 'Send Message'}
                </button>

                <a href={`mailto:${profile.email}?subject=${encodeURIComponent(formValues.subject || 'Portfolio enquiry')}&body=${encodeURIComponent(formValues.message)}`} className="inline-flex items-center gap-2 text-sm text-cyan-200 hover:text-cyan-100">
                  Use email app
                  <ExternalLink size={14} />
                </a>
              </div>

              {formFeedback && (
                <div className={`mt-5 rounded-2xl border p-3 text-sm ${
                  formState === 'success' ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200' :
                  formState === 'error' ? 'border-red-500/40 bg-red-500/10 text-red-200' :
                  'border-cyan-500/30 bg-cyan-500/10 text-cyan-100'
                }`}>
                  {formFeedback}
                </div>
              )}
            </form>
          </div>
        </motion.section>
      </main>

      <footer className="border-t border-white/10 bg-slate-950 py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 text-sm text-slate-400 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>© 2026 Chirag Chhirauliya. Built with React, TypeScript, and 3D design.</p>
          <div className="flex items-center gap-4">
            <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            <a href={profile.leetcode} target="_blank" rel="noreferrer">LeetCode</a>
          </div>
        </div>
      </footer>

      <button
        type="button"
        onClick={() => sectionInView('home')}
        className="fixed bottom-6 right-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-[0_12px_30px_rgba(59,130,246,0.45)]"
        aria-label="Back to top"
      >
        <ArrowUpCircle size={24} />
      </button>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
          >
            <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[30px] border border-white/10 bg-slate-900 p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-2xl font-semibold text-white">{selectedProject.title}</h3>
                <button type="button" onClick={() => setSelectedProject(null)} className="rounded-full border border-white/10 bg-slate-800 p-2 text-slate-300">
                  <X size={18} />
                </button>
              </div>
              <img src={selectedProject.image} alt={selectedProject.imageAlt} className="h-52 w-full rounded-3xl object-cover" />
              <p className="mt-5 text-sm leading-7 text-slate-300">{selectedProject.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {selectedProject.stack.map((item) => (
                  <span key={item} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-wide text-slate-200">{item}</span>
                ))}
              </div>
              <ul className="mt-6 space-y-2 text-slate-300">
                {selectedProject.features.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                {selectedProject.github && (
                  <a href={selectedProject.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-white">GitHub <ExternalLink size={14} /></a>
                )}
                {selectedProject.demo && (
                  <a href={selectedProject.demo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 px-4 py-2 text-sm text-white">Live Demo <ExternalLink size={14} /></a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <NeonCursor />
    </div>
    </MotionConfig>
  )
}

export default App

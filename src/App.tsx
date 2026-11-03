import { AnimatePresence, MotionConfig, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpCircle,
  Award,
  Briefcase,
  Code2,
  Database,
  Download,
  ExternalLink,
  GraduationCap,
  Globe,
  HeartHandshake,
  Mail,
  MapPin,
  Menu,
  Phone,
  Sparkles,
  Sun,
  Trophy,
  Moon,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { achievements, education, experiences, navItems, profile, projects, skillCertificates, skillGroups, socialLinks } from './data/profile'
import reactLogo from './assets/react.svg'

const skillLogos: Record<string, string> = {
  C: '/images/skill-logos/c.svg',
  'C++': '/images/skill-logos/cplusplus.svg',
  Python: '/images/skill-logos/python.svg',
  Java: '/images/skill-logos/java.svg',
  HTML: '/images/skill-logos/html5.svg',
  CSS: '/images/skill-logos/css3.svg',
  JavaScript: '/images/skill-logos/javascript.svg',
  React: reactLogo,
  Git: '/images/skill-logos/git.svg',
  GitHub: '/images/skill-logos/github.svg',
  'Visual Studio Code': '/images/skill-logos/visual-studio-code.svg',
}

const skillConceptBadges: Record<string, string> = {
  'Data Structures and Algorithms': 'DSA',
  'Object-Oriented Programming': 'OOP',
  DBMS: 'DBMS',
}

const localResumeUrl = profile.resumeLocal
const fallbackResumeUrl = profile.resumeGoogle
const janSevaProject = projects.find((project) => project.shortTitle === 'JAN SEVA')
const projectGallery = [
  ...(janSevaProject
    ? [{
        ...janSevaProject,
        title: 'GRAM MITRA',
        shortTitle: 'GRAM MITRA',
      }]
    : []),
  ...projects.filter((project) => project.shortTitle !== 'JAN SEVA' && project.shortTitle !== 'Gram Mitra'),
]
const certificateGallery: { title: string; issuer?: string; category: string; url: string }[] = [
  ...experiences.flatMap((item) => item.certificateUrl
    ? [{
        title: item.title,
        ...(item.category === 'Internship' ? { issuer: item.organization } : {}),
        category: item.category === 'Hackathon' ? 'Hackathon participation' : item.category,
        url: item.certificateUrl,
      }]
    : []),
  ...Object.entries(skillCertificates).flatMap(([skill, certificate]) => certificate.url
    ? [{
        title: `${skill} Certificate`,
        category: 'Technical certificate',
        url: certificate.url,
      }]
    : []),
]
const certificatePreviewUrl = (url: string) => {
  const fileId = url.match(/\/d\/([^/]+)/)?.[1]
  return fileId ? `https://lh3.googleusercontent.com/d/${fileId}=w800` : undefined
}
const experienceRoles = experiences.filter((item) => item.category !== 'Hackathon')
const hackathonAchievements = experiences.filter((item) => item.category === 'Hackathon')
const primaryNavItems = [
  navItems[0],
  navItems[1],
  navItems[3],
  navItems[2],
  navItems[4],
  { label: 'Achievements', href: '#achievements' },
  navItems[6],
]
const sectionInView = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
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

type ContactFormValues = {
  name: string
  email: string
  subject: string
  message: string
}

type ContactField = keyof ContactFormValues

const emptyContactForm: ContactFormValues = {
  name: '',
  email: '',
  subject: '',
  message: '',
}

const heroContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.08 } },
}

const heroItemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] as const } },
}

function CertificateAction({ url }: { url?: string }) {
  if (!url) {
    return <span className="text-xs font-medium text-slate-400">Certificate Not Provided</span>
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-10 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-200 transition-colors duration-200 hover:border-cyan-300/60 hover:bg-cyan-500/15 hover:text-cyan-100"
    >
      View Certificate ↗
    </a>
  )
}

function CertificateGalleryAction({ url }: { url: string }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="certificate-gallery-action">
      View Certificate →
    </a>
  )
}

function ProjectDetailsButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="project-details-button">
      View Project Details <ArrowRight size={16} aria-hidden="true" />
    </button>
  )
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
  const [formErrors, setFormErrors] = useState<Partial<Record<ContactField, string>>>({})
  const [formValues, setFormValues] = useState<ContactFormValues>(emptyContactForm)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const menuNavigationTarget = useRef<string | null>(null)
  const contactSubmitLock = useRef(false)
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress: heroScrollProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroParallaxY = useTransform(heroScrollProgress, [0, 1], [0, 24])

  const filteredProjects = useMemo(() => {
    if (projectFilter === 'All') return projectGallery
    return projectGallery.filter((project) => project.stack.includes(projectFilter))
  }, [projectFilter])

  useEffect(() => {
    if (!selectedProject) return

    const previousBodyOverflow = document.body.style.overflow
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedProject(null)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousBodyOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [selectedProject])

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 12)
    updateScrollState()
    window.addEventListener('scroll', updateScrollState, { passive: true })

    const sectionObserver = typeof IntersectionObserver === 'undefined'
      ? null
      : new IntersectionObserver((entries) => {
          const visibleSections = entries
            .filter((entry) => entry.isIntersecting)
            .sort((first, second) => second.intersectionRatio - first.intersectionRatio)
          if (visibleSections[0]) setActiveSection(visibleSections[0].target.id)
        }, { rootMargin: '-18% 0px -62% 0px', threshold: [0, 0.1, 0.3] })

    primaryNavItems.forEach((item) => {
      const section = document.querySelector(item.href)
      if (section) sectionObserver?.observe(section)
    })

    return () => {
      window.removeEventListener('scroll', updateScrollState)
      sectionObserver?.disconnect()
    }
  }, [])

  const handleInputChange = (field: ContactField, value: string) => {
    setFormValues((current) => ({ ...current, [field]: value }))
    setFormErrors((current) => ({ ...current, [field]: undefined }))
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
    if (contactSubmitLock.current) return

    const trimmed = {
      name: formValues.name.trim(),
      email: formValues.email.trim(),
      subject: formValues.subject.trim(),
      message: formValues.message.trim(),
    }

    const errors: Partial<Record<ContactField, string>> = {}
    if (!trimmed.name) errors.name = 'Enter your name.'
    if (!trimmed.email) errors.email = 'Enter your email address.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed.email)) errors.email = 'Enter a valid email address.'
    if (!trimmed.subject) errors.subject = 'Enter a subject.'
    if (!trimmed.message) errors.message = 'Enter a message.'

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      setFormState('error')
      setFormFeedback('Please correct the highlighted fields.')
      return
    }

    const formId = import.meta.env.VITE_FORMSPREE_FORM_ID?.trim()
    if (!formId) {
      setFormState('error')
      setFormFeedback('Email delivery is not configured. Set VITE_FORMSPREE_FORM_ID in the deployment environment, or use the direct email link below.')
      return
    }

    contactSubmitLock.current = true
    setFormState('submitting')
    setFormFeedback('Sending your message…')
    try {
      const response = await fetch(`https://formspree.io/f/${encodeURIComponent(formId)}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: trimmed.name,
          email: trimmed.email,
          _replyto: trimmed.email,
          subject: trimmed.subject,
          message: trimmed.message,
        }),
      })

      if (!response.ok) {
        setFormState('error')
        setFormFeedback('Your message could not be sent. Please try again or use the direct email link below.')
        return
      }

      setFormState('success')
      setFormFeedback('Your message was sent successfully. Thank you for reaching out.')
      setFormValues({ ...emptyContactForm })
      setFormErrors({})
    } catch {
      setFormState('error')
      setFormFeedback('A network error prevented delivery. Please try again or use the direct email link below.')
    } finally {
      contactSubmitLock.current = false
    }
  }

  const featuredProject = filteredProjects.find((project) => project.shortTitle === 'GRAM MITRA')
  const supportingProjects = filteredProjects.filter((project) => project.shortTitle !== 'GRAM MITRA')
  const currentEducation = education.find((item) => item.degree === 'B.Tech')
  const aboutVisualProject = projects.find((project) => project.shortTitle === 'JAN SEVA')

  return (
    <MotionConfig reducedMotion="user">
    <div className="portfolio-shell min-h-screen overflow-x-hidden">
      <header data-scrolled={isScrolled} className="site-header sticky top-0 z-50 border-b border-white/10 bg-slate-950/75 backdrop-blur-2xl">
        <div className="site-header-inner mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
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
            <span className="nav-brand-name">{profile.name}</span>
          </motion.button>

          <nav className="site-nav hidden items-center gap-6 min-[1100px]:flex" aria-label="Primary navigation">
            {primaryNavItems.map((item) => (
              <motion.button
                key={item.href}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => sectionInView(item.href.replace('#', ''))}
                aria-current={activeSection === item.href.slice(1) ? 'location' : undefined}
                className="nav-link text-sm text-slate-300 transition hover:text-white"
              >
                {item.label}
              </motion.button>
            ))}
          </nav>

          <div className="hidden min-[1100px]:flex">
            <a
              href={localResumeUrl}
              download="Chirag-Chhirauliya-Resume.pdf"
              className="header-resume inline-flex items-center gap-2 rounded-full border border-cyan-400/60 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:border-cyan-300 hover:bg-cyan-500/20"
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
            className="menu-toggle inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-slate-900/60 min-[1100px]:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <AnimatePresence
          onExitComplete={() => {
            const target = menuNavigationTarget.current
            if (target) {
              menuNavigationTarget.current = null
              sectionInView(target)
            }
          }}
        >
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mobile-navigation border-t border-white/10 bg-slate-950 px-4 py-3 min-[1100px]:hidden"
              id="mobile-navigation"
            >
              <div className="flex flex-col gap-3">
                {primaryNavItems.map((item) => (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => {
                      menuNavigationTarget.current = item.href.replace('#', '')
                      setMenuOpen(false)
                    }}
                    aria-current={activeSection === item.href.slice(1) ? 'location' : undefined}
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
        <section ref={heroRef} id="home" className="hero-section relative z-10 overflow-hidden">
          <motion.div aria-hidden="true" className="hero-ambient-light" style={{ y: heroParallaxY }} />
          <span className="hero-ghost-word" aria-hidden="true">DEVELOPER</span>
          <div className="hero-grid relative mx-auto grid min-w-0 max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8 lg:px-8 lg:py-24">
            <motion.div variants={heroContainerVariants} initial="hidden" animate="visible" className="hero-copy relative z-10 flex min-w-0 flex-col justify-center">
              <motion.div variants={heroItemVariants} className="hero-kicker mb-6 inline-flex w-max items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-200 sm:text-xs">
                <Sparkles size={12} aria-hidden="true" />
                {profile.location}
              </motion.div>

              <motion.h1
                variants={heroItemVariants}
                aria-label="Hi, I'm Chirag Chhirauliya. I build digital experiences."
                className="hero-title max-w-[780px] font-black text-white"
              >
                <span className="hero-greeting">Hi, I&apos;m</span>
                <span className="hero-name">Chirag <span className="hero-highlight">Chhirauliya</span></span>
                <span className="hero-statement">I BUILD <span className="hero-highlight">DIGITAL</span><br className="hidden sm:block" /> EXPERIENCES.</span>
              </motion.h1>

              <motion.p variants={heroItemVariants} className="hero-role-reveal mt-6 max-w-xl text-sm font-semibold uppercase leading-relaxed tracking-[0.12em] text-sky-200 sm:text-base">
                {profile.title}
              </motion.p>

              <motion.p variants={heroItemVariants} className="hero-bio mt-4 max-w-lg text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
                {profile.bio}
              </motion.p>

              <motion.div variants={heroItemVariants} className="mt-8 flex flex-wrap items-center gap-3">
                <motion.button type="button" onClick={() => sectionInView('projects')} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="primary-cta inline-flex min-h-12 items-center gap-3 bg-gradient-to-r from-cyan-500 to-violet-600 px-5 py-3 text-sm font-bold uppercase tracking-[0.06em] text-white transition">
                  Explore My Work
                  <ArrowRight size={16} />
                </motion.button>
                <a href={localResumeUrl} download="Chirag-Chhirauliya-Resume.pdf" className="hero-secondary-cta inline-flex min-h-12 items-center gap-2 border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-400/60">
                  <Download size={16} />
                  Download Resume
                </a>
              </motion.div>

              <motion.div variants={heroItemVariants} className="hero-socials mt-8 flex flex-wrap items-center gap-5">
                <a href={profile.github} target="_blank" rel="noreferrer" aria-label="Open Chirag's GitHub profile" className="hero-social-link inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200 transition hover:text-cyan-200">
                  <Globe size={16} />
                  GitHub
                </a>
                <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="Open Chirag's LinkedIn profile" className="hero-social-link inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200 transition hover:text-cyan-200">
                  <Briefcase size={16} />
                  LinkedIn
                </a>
                <a href={profile.leetcode} target="_blank" rel="noreferrer" aria-label="Open Chirag's LeetCode profile" className="hero-social-link inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200 transition hover:text-cyan-200">
                  <Code2 size={16} />
                  LeetCode
                </a>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.18, ease: [0.22, 1, 0.36, 1] }} className="hero-portrait-column relative flex items-end justify-center">
              <div className="hero-portrait profile-image-frame">
                <img src={profile.image} alt="Portrait of Chirag Chhirauliya" fetchPriority="high" />
              </div>
            </motion.div>
          </div>
        </section>

        <motion.section {...revealUp} id="about" className="about-section relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <span className="about-outline-word" aria-hidden="true">ABOUT</span>
          <div className="about-layout">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="about-visual about-editorial-visual"
            >
              {aboutVisualProject && (
                <figure className="about-project-visual about-editorial-artwork">
                  <img src={aboutVisualProject.image} alt={aboutVisualProject.imageAlt} loading="lazy" decoding="async" />
                  <figcaption className="about-project-caption">
                    <span className="about-project-label">PROJECT IN FOCUS</span>
                    <span className="about-project-title">{aboutVisualProject.shortTitle}</span>
                    <span className="about-project-status">{aboutVisualProject.status}</span>
                  </figcaption>
                </figure>
              )}
              <div className="about-photo-note about-location-note">
                <span className="about-photo-rule" aria-hidden="true" />
                <span>{profile.location}</span>
              </div>
            </motion.div>

            <div className="about-copy about-editorial-copy">
              <div className="about-heading-block">
                <div className="section-eyebrow"><span aria-hidden="true" />A LITTLE ABOUT ME</div>
                <h2 className="section-title about-heading">
                  Curious by nature.<br />
                  <span>Building with purpose.</span>
                </h2>
                <p className="about-introduction">
                  I&apos;m pursuing a {currentEducation?.degree} in {currentEducation?.branch} at BGI, building a foundation in programming while exploring problem-solving, web development, and Data Science.
                </p>
              </div>

              <div className="about-details about-editorial-details">
                <div className="about-education-note">
                  <div className="about-detail-label"><GraduationCap size={17} /> CURRENT STUDIES</div>
                  <p>{currentEducation?.degree} · {currentEducation?.branch}</p>
                  <span>{currentEducation?.institution} · {currentEducation?.duration}</span>
                </div>
                <div className="about-interests">
                  <div className="about-detail-label"><Database size={16} /> AREAS OF INTEREST</div>
                  <ul>
                    {currentEducation?.interests?.map((interest) => <li key={interest}>{interest}</li>)}
                  </ul>
                </div>
              </div>

              <div className="about-learning about-editorial-learning">
                <h3>Learning goals</h3>
                <ul>
                  <li>Strengthen Data Structures and Algorithms fundamentals.</li>
                  <li>Build responsive web experiences and product-grade interfaces.</li>
                  <li>Explore Data Science workflows and practical AI concepts.</li>
                  <li>Keep improving through projects, coding practice, and real-world application.</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section {...revealUp} id="skills" className="skills-section relative z-10 bg-slate-950/70 py-20 sm:py-24">
          <span className="section-outline-word skills-outline-word" aria-hidden="true">SKILLS</span>
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="skills-heading-row">
              <div>
                <div className="section-eyebrow"><span aria-hidden="true" />TOOLS I WORK WITH</div>
                <h2 className="section-title skills-section-title">Skills &amp;<br /><span>Foundations</span></h2>
              </div>
              <p className="skills-introduction">A growing toolkit built through coursework, practice, and hands-on projects.</p>
            </div>

            <div className="skills-modules">
              {skillGroups.map((group, index) => {
                const certificates = group.items.flatMap((item) => {
                  const certificate = skillCertificates[item]
                  return certificate ? [{ ...certificate, item }] : []
                })

                return (
                  <motion.div
                    key={group.title}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.45, delay: index * 0.08 }}
                    className={`skill-module skill-module-${index + 1}`}
                  >
                    <div className="skill-group-heading">
                      <span className="skill-group-index">{String(index + 1).padStart(2, '0')}</span>
                      <h3>{group.title}</h3>
                    </div>

                    <ul className="skill-brand-list">
                      {group.items.map((item) => (
                        <li key={item} className="skill-brand-tile">
                          {skillLogos[item] ? (
                            <img className="skill-brand-icon" src={skillLogos[item]} alt="" aria-hidden="true" />
                          ) : (
                            <span className="skill-concept-mark" aria-hidden="true">{skillConceptBadges[item]}</span>
                          )}
                          <span className="skill-name">{item === 'Object-Oriented Programming' ? `${item} (OOP)` : item}</span>
                        </li>
                      ))}
                    </ul>
                    {certificates.length > 0 && (
                      <ul className="skill-certificates" aria-label={`${group.title} certificates`}>
                        {certificates.map((certificate) => (
                          <li key={certificate.item} className="skill-certificate-row">
                            <span className="skill-certificate-label">{certificate.label}</span>
                            <CertificateAction url={certificate.url} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.section>

        <motion.section {...revealUp} id="services" className="services-section relative z-10">
          <div className="services-inner mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="services-heading">
              <div>
                <div className="section-eyebrow"><span aria-hidden="true" />AREAS I&apos;M BUILDING IN</div>
                <h2 className="section-title">What I <span>do</span></h2>
              </div>
              <p>Capabilities shaped by my studies, coding practice, and hands-on project work.</p>
            </div>

            <div className="services-list">
              <article className="service-item">
                <div className="service-copy">
                  <div className="service-label">
                    <span className="service-index">01</span>
                    <h3>Web Development</h3>
                  </div>
                  <p>Build responsive interfaces with HTML, CSS, JavaScript, and React, informed by practical webpage and web application projects.</p>
                </div>
                <div className="service-showcase service-showcase-web" aria-label="Interface preview composed from the actual portfolio content">
                  <div className="browser-preview">
                    <div className="browser-preview-bar">
                      <span className="browser-dots" aria-hidden="true"><i /><i /><i /></span>
                      <span className="browser-preview-path">PORTFOLIO <span>/</span> HOME</span>
                      <span className="browser-preview-status">UI PREVIEW</span>
                    </div>
                    <div className="browser-preview-page">
                      <div className="browser-preview-nav">
                        <strong>Chirag Chhirauliya<span>.</span></strong>
                        <span>ABOUT&nbsp;&nbsp; SKILLS&nbsp;&nbsp; PROJECTS</span>
                      </div>
                      <div className="browser-preview-content">
                        <span className="browser-preview-kicker">DEVELOPER · DATA SCIENCE LEARNER</span>
                        <strong>I BUILD<br /><em>DIGITAL</em> EXPERIENCES.</strong>
                        <span className="browser-preview-cta">EXPLORE MY WORK&nbsp; ↗</span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
              <article className="service-item">
                <div className="service-copy">
                  <div className="service-label">
                    <span className="service-index">02</span>
                    <h3>Programming &amp; Problem Solving</h3>
                  </div>
                  <p>Develop core programming and problem-solving foundations through C, C++, Python, Java, Data Structures and Algorithms, OOP, and DBMS.</p>
                </div>
                <div className="service-showcase service-showcase-code" aria-label="Project filtering code from App.tsx">
                  <div className="editor-preview">
                    <div className="editor-preview-bar">
                      <span className="editor-preview-lights" aria-hidden="true"><i /><i /><i /></span>
                      <span>App.tsx</span>
                      <span className="editor-preview-language">TypeScript</span>
                    </div>
                    <div className="editor-preview-code" aria-label="Existing project filter implementation">
                      <div><span className="editor-line">01</span><code><b>const</b> filteredProjects = useMemo(() =&gt; {'{'}</code></div>
                      <div><span className="editor-line">02</span><code>&nbsp;&nbsp;<b>if</b> (projectFilter === <em>&apos;All&apos;</em>) <b>return</b> projects</code></div>
                      <div><span className="editor-line">03</span><code>&nbsp;&nbsp;<b>return</b> projects.filter((project) =&gt;</code></div>
                      <div><span className="editor-line">04</span><code>&nbsp;&nbsp;&nbsp;&nbsp;project.stack.includes(projectFilter)</code></div>
                      <div><span className="editor-line">05</span><code>&nbsp;&nbsp;)</code></div>
                      <div><span className="editor-line">06</span><code>{'}'}, [projectFilter])</code></div>
                    </div>
                  </div>
                </div>
              </article>
              <article className="service-item">
                <div className="service-copy">
                  <div className="service-label">
                    <span className="service-index">03</span>
                    <h3>Data Science Learning</h3>
                  </div>
                  <p>Explore Data Science workflows as part of my Computer Science and Engineering studies, connecting coursework with practical projects.</p>
                </div>
                <div className="service-showcase service-showcase-data" aria-label="Conceptual chart composition with no measured values">
                  <div className="data-preview">
                    <div className="data-preview-header">
                      <span>DATA WORKFLOW</span>
                      <span>LEARNING / EXPLORING</span>
                    </div>
                    <div className="data-preview-chart" aria-hidden="true">
                      <span className="data-axis" />
                      <span className="data-bar data-bar-one" />
                      <span className="data-bar data-bar-two" />
                      <span className="data-bar data-bar-three" />
                      <span className="data-bar data-bar-four" />
                      <span className="data-bar data-bar-five" />
                      <span className="data-trace" />
                    </div>
                    <div className="data-preview-legend"><span />Illustrative composition · no measured values</div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </motion.section>

        <motion.section {...revealUp} id="projects" className="projects-section relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <span className="section-outline-word projects-outline-word" aria-hidden="true">PROJECTS</span>
          <header className="project-gallery-header relative z-10">
            <div className="project-gallery-heading">
              <div className="project-gallery-kicker"><Briefcase size={16} /> SELECTED WORK</div>
              <h2 className="section-title">PROJECTS <span>&amp; BUILDS</span></h2>
              <p>Selected projects in civic technology and responsive web development.</p>
            </div>
            <div className="project-filter-list" aria-label="Filter projects by technology">
              {['All', 'HTML', 'React', 'Python', 'JavaScript'].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setProjectFilter(filter)}
                  aria-pressed={projectFilter === filter}
                  className={`project-filter-button ${projectFilter === filter ? 'is-active' : ''}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </header>

          <div className="project-gallery-content relative z-10">
            {featuredProject && (
              <motion.article
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="project-featured"
              >
                <div className="project-featured-visual">
                  <img src={featuredProject.image} alt={featuredProject.imageAlt} loading="lazy" decoding="async" />
                  <span className="project-visual-index">01 <i /> FEATURED PROJECT</span>
                  <span className="project-artwork-note">Representative artwork · not an application screenshot</span>
                </div>
                <div className="project-featured-copy">
                  <div className="project-meta-line">
                    <span>CIVIC TECHNOLOGY</span>
                    <span className="project-status"><i /> {featuredProject.status}</span>
                  </div>
                  <h3 className="project-featured-title">GRAM MITRA</h3>
                  <p className="project-former-name">Formerly JAN SEVA</p>
                  <p className="project-featured-description">{featuredProject.description}</p>

                  <div className="project-key-features">
                    <span className="project-details-label">PROJECT FOCUS</span>
                    <ul>
                      {featuredProject.features.slice(0, 4).map((feature) => <li key={feature}>{feature}</li>)}
                    </ul>
                  </div>

                  <div className="project-stack" aria-label="Technologies">
                    {featuredProject.stack.map((item) => <span key={item}>{item}</span>)}
                  </div>

                  <div className="project-actions">
                    <ProjectDetailsButton onClick={() => setSelectedProject(featuredProject)} />
                    {featuredProject.github && (
                      <a href={featuredProject.github} target="_blank" rel="noreferrer" className="project-secondary-action">
                        GitHub <ExternalLink size={14} />
                      </a>
                    )}
                    {featuredProject.demo && (
                      <a href={featuredProject.demo} target="_blank" rel="noreferrer" className="project-secondary-action">
                        Live Demo <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            )}

            {supportingProjects.length > 0 && (
              <div className="project-supporting-list">
                <div className="project-supporting-heading">
                  <span>MORE WORK</span>
                  <span>{String(supportingProjects.length).padStart(2, '0')} PROJECT{supportingProjects.length === 1 ? '' : 'S'}</span>
                </div>
                {supportingProjects.map((project, index) => (
                  <motion.article
                    key={project.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.4 }}
                    className="project-supporting"
                  >
                    <div className="project-supporting-visual">
                      <img src={project.image} alt={project.imageAlt} loading="lazy" decoding="async" />
                      <span>{String(index + 2).padStart(2, '0')} / REPRESENTATIVE ARTWORK</span>
                    </div>
                    <div className="project-supporting-copy">
                      <div className="project-meta-line">
                        <span>WEB DEVELOPMENT</span>
                        <span className="project-status"><i /> {project.status}</span>
                      </div>
                      <h3>{project.shortTitle}</h3>
                      <p>{project.description}</p>
                      <div className="project-stack">
                        {project.stack.map((item) => <span key={item}>{item}</span>)}
                      </div>
                      <ProjectDetailsButton onClick={() => setSelectedProject(project)} />
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </motion.section>

        <motion.section {...revealUp} id="education" className="education-section relative z-10 bg-slate-950/70 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="education-heading-row">
              <div>
                <div className="section-eyebrow"><span aria-hidden="true" />ACADEMIC JOURNEY</div>
                <h2 className="section-title">Education &amp; <span>study</span></h2>
              </div>
              <p>From foundational studies to my current degree in Computer Science and Data Science.</p>
            </div>
            <div className="education-timeline">
              {education.map((item, index) => {
                const isCurrentDegree = item.degree === 'B.Tech'

                return (
                  <motion.article
                    key={item.degree}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.45, delay: index * 0.1 }}
                    whileHover={{ y: -3 }}
                    className={`education-card flex h-full flex-col rounded-[24px] border bg-slate-900/70 p-6 ${isCurrentDegree ? 'education-card-current border-cyan-400/30' : 'border-white/10'}`}
                  >
                    <div className="education-card-meta">
                      <span className="education-marker" aria-hidden="true">
                        <span />
                      </span>
                      <span className="education-date">{item.duration}</span>
                    </div>
                    <p className="education-qualification">{item.qualification}</p>
                    <h3 className="education-degree">{item.degree}</h3>
                    {item.branch && <p className="education-course">{item.branch}</p>}
                    <p className="education-institution">{item.institution}</p>
                    {item.cgpa && (
                      <div className="education-cgpa">
                        Current CGPA <strong>{item.cgpa}</strong>
                      </div>
                    )}
                    {item.interests && (
                      <div className="education-interests">
                        {item.interests.map((interest) => (
                          <span key={interest}>{interest}</span>
                        ))}
                      </div>
                    )}
                    <div className="education-certificate">
                      <CertificateAction url={item.certificateUrl} />
                    </div>
                  </motion.article>
                )
              })}
            </div>
          </div>
        </motion.section>

        <motion.section {...revealUp} id="experience" className="experience-section relative z-10 bg-slate-950/70 py-20 sm:py-24">
          <span className="section-outline-word experience-outline-word" aria-hidden="true">EXPERIENCE</span>
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="experience-heading-row">
              <div>
                <div className="section-eyebrow"><span aria-hidden="true" />WORK, COLLABORATION &amp; COMMUNITY</div>
                <h2 className="section-title">Experience &amp; <span>involvement</span></h2>
              </div>
            </div>

            <div className="experience-timeline">
              {experienceRoles.map((item, index) => {
                const Icon = experienceIconMap[item.category]

                return (
                  <motion.article
                    key={`${item.category}-${item.title}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.12 }}
                    transition={{ duration: 0.45, delay: index * 0.08 }}
                    className="experience-entry"
                  >
                    <div className="experience-entry-rail">
                      <span className="experience-entry-marker" aria-hidden="true">
                        <Icon size={17} />
                      </span>
                      {item.duration && <span className="experience-entry-date">{item.duration}</span>}
                    </div>
                    <div className="experience-entry-content">
                      <div className="experience-entry-heading">
                        <span className="experience-category">{item.category}</span>
                        <h3 className="experience-title">{item.title}</h3>
                        <p className="experience-organization">{item.organization}</p>
                      </div>
                      <p className="experience-description">{item.description}</p>
                      {item.responsibilities && (
                        <ul className="experience-responsibilities">
                          {item.responsibilities.map((responsibility) => (
                            <li key={responsibility} className="flex gap-2.5">
                              <span className="experience-list-marker" aria-hidden="true" />
                              <span>{responsibility}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {item.category !== 'Volunteering' && (
                        <div className="experience-certificate">
                          <CertificateAction url={item.certificateUrl} />
                        </div>
                      )}
                    </div>
                  </motion.article>
                )
              })}
            </div>
          </div>
        </motion.section>

        <motion.section {...revealUp} id="achievements" className="achievements-section relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="achievements-heading-row">
            <div>
              <div className="section-eyebrow"><span aria-hidden="true" />PARTICIPATION &amp; RECOGNITION</div>
              <h2 className="section-title">Achievements &amp; <span>milestones</span></h2>
            </div>
            <p className="achievement-participation-summary">
              {hackathonAchievements.length} verified hackathon participations
            </p>
            <a className="achievement-certificates-link" href="#certificates">Browse certificates <ArrowRight size={15} /></a>
          </div>

          <div className="achievements-layout">
            <div className="achievement-timeline">
              {hackathonAchievements.map((item, index) => (
                <motion.article
                  key={`${item.category}-${item.title}`}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.18 }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  className="achievement-entry"
                >
                  <span className="achievement-number">{String(index + 1).padStart(2, '0')}</span>
                  <div className="achievement-entry-copy">
                    <span className="achievement-entry-category">
                      {item.category === 'Hackathon' ? 'PARTICIPATION' : item.category.toUpperCase()}
                    </span>
                    <h3>{item.title}</h3>
                    <p className="achievement-entry-organization">{item.organization}</p>
                    <p className="achievement-entry-description">{item.description}</p>
                    {item.certificateUrl && (
                      <CertificateAction url={item.certificateUrl} />
                    )}
                  </div>
                  {item.duration && <span className="achievement-entry-date">{item.duration}</span>}
                </motion.article>
              ))}
            </div>

            <aside className="achievement-learning">
              <span className="achievement-learning-icon"><Award size={19} /></span>
              <span className="achievement-entry-category">ONGOING PRACTICE</span>
              {achievements.map((item) => (
                <div className="achievement-learning-note" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </aside>
          </div>
        </motion.section>

        <motion.section {...revealUp} id="certificates" className="certificates-section relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="certificates-heading-row">
            <div>
              <div className="section-eyebrow"><span aria-hidden="true" />GOOGLE DRIVE DOCUMENTS</div>
              <h2 className="section-title">Certificates <span>&amp; credentials</span></h2>
            </div>
            <p>Original certificate links are preserved and open from their Google Drive source.</p>
          </div>
          <div className="certificate-gallery">
            {certificateGallery.map((certificate, index) => (
              <motion.article
                key={certificate.url}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="certificate-gallery-item"
                data-category={certificate.category === 'Hackathon participation' ? 'participation' : certificate.category.toLowerCase().replaceAll(' ', '-')}
              >
                <div className="certificate-document" role="img" aria-label={`Intentionally blurred preview of the ${certificate.title} certificate`}>
                  <img
                    src={certificatePreviewUrl(certificate.url)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="certificate-gallery-copy">
                  <span className="certificate-category">{certificate.category}</span>
                  <h3>{certificate.title}</h3>
                  <div className="certificate-gallery-metadata">
                    {certificate.issuer && <p>{certificate.issuer}</p>}
                  </div>
                  <CertificateGalleryAction url={certificate.url} />
                </div>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section {...revealUp} id="github" className="coding-profiles-section relative z-10">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
            <div className="coding-profiles-heading">
              <div>
                <div className="section-eyebrow"><span aria-hidden="true" />CODE &amp; PROBLEM SOLVING</div>
                <h2 className="section-title">Find me <span>online</span></h2>
              </div>
              <p>Explore my public code and problem-solving profiles.</p>
            </div>
            <div className="coding-profiles-grid grid lg:grid-cols-2">
              <motion.article whileHover={{ y: -4 }} className="social-profile-card github-profile-card flex h-full flex-col">
                <div className="profile-card-topline">
                  <span className="github-brand-mark"><img src={skillLogos.GitHub} alt="" /> GitHub</span>
                  <span className="profile-card-index">01 / CODE</span>
                </div>
                <div className="github-code-visual" role="img" aria-label="Existing TypeScript code that filters projects by selected technology">
                  <span className="github-code-line"><i>01</i><code><b>const</b> filteredProjects = useMemo(() =&gt; {'{'}</code></span>
                  <span className="github-code-line"><i>02</i><code>&nbsp;&nbsp;<b>if</b> (projectFilter === <em>&apos;All&apos;</em>) <b>return</b> projectGallery</code></span>
                  <span className="github-code-line"><i>03</i><code>&nbsp;&nbsp;<b>return</b> projectGallery.filter((project) =&gt;</code></span>
                  <span className="github-code-line"><i>04</i><code>&nbsp;&nbsp;&nbsp;&nbsp;project.stack.includes(projectFilter))</code></span>
                  <span className="github-code-line"><i>05</i><code>{'}'}, [projectFilter])</code></span>
                  <span className="github-code-caption">LIVE PROJECT CODE · TYPESCRIPT</span>
                </div>
                <h3>Code, projects &amp; experiments</h3>
                <p>Visit my GitHub profile to explore repositories and development work.</p>
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="coding-profile-action mt-auto">
                  Open GitHub Profile <ExternalLink size={15} />
                </a>
              </motion.article>

              <motion.article id="leetcode" whileHover={{ y: -4 }} className="social-profile-card leetcode-profile-card flex h-full flex-col">
                <div className="profile-card-topline">
                  <span className="leetcode-brand-wordmark"><span aria-hidden="true">Leet</span><b>Code</b></span>
                  <span className="profile-card-index">02 / PRACTICE</span>
                </div>
                <div className="leetcode-problem-visual" aria-hidden="true">
                  <span className="problem-bracket">{'{ }'}</span>
                  <span className="problem-topic">DATA STRUCTURES<br />&amp; ALGORITHMS</span>
                  <span className="problem-rule" />
                  <Code2 size={18} />
                </div>
                <h3>Problem-solving practice</h3>
                <p>Explore my LeetCode profile for programming and algorithm practice.</p>
                <a href={profile.leetcode} target="_blank" rel="noopener noreferrer" className="coding-profile-action mt-auto">
                  Open LeetCode Profile <ExternalLink size={15} />
                </a>
              </motion.article>
            </div>
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

        <motion.section {...revealUp} id="contact" className="contact-section relative z-10">
          <div className="contact-inner mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="contact-editorial">
              <div className="contact-intro">
                <div className="section-eyebrow"><span aria-hidden="true" />CONTACT / 05</div>
                <h2 className="contact-headline">
                  LET&apos;S BUILD
                  <span>SOMETHING</span>
                  <em>MEANINGFUL.</em>
                </h2>
                <p className="contact-lede">Have a thoughtful idea or an opportunity to share? I&apos;d be glad to hear from you.</p>

                <div className="contact-details" aria-label="Contact details">
                  <a className="contact-detail" href={socialLinks.email}>
                    <span className="contact-detail-icon"><Mail size={18} aria-hidden="true" /></span>
                    <span><small>Email</small><strong>{profile.email}</strong></span>
                    <ArrowRight className="contact-detail-arrow" size={16} aria-hidden="true" />
                  </a>
                  <a className="contact-detail" href={socialLinks.phone}>
                    <span className="contact-detail-icon"><Phone size={18} aria-hidden="true" /></span>
                    <span><small>Mobile</small><strong>{profile.phone}</strong></span>
                    <ArrowRight className="contact-detail-arrow" size={16} aria-hidden="true" />
                  </a>
                  {profile.location && (
                    <div className="contact-detail">
                      <span className="contact-detail-icon"><MapPin size={18} aria-hidden="true" /></span>
                      <span><small>Location</small><strong>{profile.location}</strong></span>
                    </div>
                  )}
                  <a className="contact-detail" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                    <span className="contact-detail-icon"><span className="contact-linkedin-mark" aria-hidden="true">in</span></span>
                    <span><small>LinkedIn</small><strong>Connect with Chirag</strong></span>
                    <ExternalLink className="contact-detail-arrow" size={15} aria-hidden="true" />
                  </a>
                </div>
              </div>

              <form className="contact-form" onSubmit={handleSubmit} noValidate aria-labelledby="contact-form-title">
                <div className="contact-form-heading">
                  <span className="contact-form-index">01 — YOUR NOTE</span>
                  <h3 id="contact-form-title">Start a conversation</h3>
                </div>

                <div className="contact-form-grid">
                  <label className="contact-field" htmlFor="contact-name">
                    <span>Full Name</span>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      value={formValues.name}
                      onChange={(event) => handleInputChange('name', event.target.value)}
                      aria-invalid={Boolean(formErrors.name)}
                      aria-describedby={formErrors.name ? 'contact-name-error' : undefined}
                      placeholder="Your name"
                    />
                    {formErrors.name && <span className="contact-field-error" id="contact-name-error">{formErrors.name}</span>}
                  </label>
                  <label className="contact-field" htmlFor="contact-email">
                    <span>Email Address</span>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={formValues.email}
                      onChange={(event) => handleInputChange('email', event.target.value)}
                      aria-invalid={Boolean(formErrors.email)}
                      aria-describedby={formErrors.email ? 'contact-email-error' : undefined}
                      placeholder="you@example.com"
                    />
                    {formErrors.email && <span className="contact-field-error" id="contact-email-error">{formErrors.email}</span>}
                  </label>
                  <label className="contact-field contact-field-wide" htmlFor="contact-subject">
                    <span>Subject</span>
                    <input
                      id="contact-subject"
                      name="subject"
                      type="text"
                      required
                      value={formValues.subject}
                      onChange={(event) => handleInputChange('subject', event.target.value)}
                      aria-invalid={Boolean(formErrors.subject)}
                      aria-describedby={formErrors.subject ? 'contact-subject-error' : undefined}
                      placeholder="What would you like to discuss?"
                    />
                    {formErrors.subject && <span className="contact-field-error" id="contact-subject-error">{formErrors.subject}</span>}
                  </label>
                  <label className="contact-field contact-field-wide" htmlFor="contact-message">
                    <span>Message</span>
                    <textarea
                      id="contact-message"
                      name="message"
                      value={formValues.message}
                      onChange={(event) => handleInputChange('message', event.target.value)}
                      aria-invalid={Boolean(formErrors.message)}
                      aria-describedby={formErrors.message ? 'contact-message-error' : undefined}
                      placeholder="A little context goes a long way..."
                      rows={5}
                    />
                    {formErrors.message && <span className="contact-field-error" id="contact-message-error">{formErrors.message}</span>}
                  </label>
                </div>

                <div className="contact-form-actions">
                  <button className="contact-submit" type="submit" disabled={formState === 'submitting'}>
                    {formState === 'submitting' ? 'Sending message…' : 'Submit Message'}
                    {formState !== 'submitting' && <ArrowRight size={17} aria-hidden="true" />}
                  </button>
                  <span className="contact-form-note">Your email is used as the reply-to address.</span>
                </div>

                {formFeedback && (
                  <div
                    className={`contact-form-feedback is-${formState}`}
                    role={formState === 'error' ? 'alert' : 'status'}
                    aria-live="polite"
                  >
                    <p>{formFeedback}</p>
                    {formState === 'error' && (
                      <a href={`mailto:${profile.email}?subject=${encodeURIComponent(formValues.subject || 'Portfolio enquiry')}&body=${encodeURIComponent(`Name: ${formValues.name}\nEmail: ${formValues.email}\n\n${formValues.message}`)}`}>
                        Email me directly instead <ArrowRight size={14} aria-hidden="true" />
                      </a>
                    )}
                  </div>
                )}
              </form>
            </div>
          </div>
        </motion.section>
      </main>

      <footer className="site-footer">
        <div className="site-footer-inner mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="site-footer-main">
            <div className="site-footer-brand">
              <a href="#home" className="site-footer-name">{profile.name}<span>.</span></a>
              <p>Computer Science Engineering student exploring web development, problem-solving, and Data Science.</p>
            </div>
            <nav className="site-footer-nav" aria-label="Footer navigation">
              <span className="site-footer-label">Explore</span>
              <div>
                {primaryNavItems.map((item) => (
                  <a key={item.href} href={item.href}>{item.label}</a>
                ))}
              </div>
            </nav>
            <div className="site-footer-links">
              <span className="site-footer-label">Elsewhere</span>
              <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub <ExternalLink size={13} aria-hidden="true" /></a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <ExternalLink size={13} aria-hidden="true" /></a>
              <a href={profile.leetcode} target="_blank" rel="noopener noreferrer">LeetCode <ExternalLink size={13} aria-hidden="true" /></a>
              {profile.resumeLocal && <a href={profile.resumeLocal} download="Chirag-Chhirauliya-Resume.pdf">Download resume <Download size={14} aria-hidden="true" /></a>}
            </div>
          </div>
          <div className="site-footer-bottom">
            <span>© {new Date().getFullYear()} {profile.name}. All rights reserved.</span>
            <a href="#home">Back to the top <ArrowUpCircle size={15} aria-hidden="true" /></a>
          </div>
        </div>
      </footer>

      <button
        type="button"
        onClick={() => sectionInView('home')}
        className="back-to-top"
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
            className="project-dialog-backdrop"
            onClick={(event) => {
              if (event.target === event.currentTarget) setSelectedProject(null)
            }}
          >
            <motion.div
              initial={{ scale: 0.97, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0, y: 8 }}
              transition={{ duration: 0.22 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-dialog-title"
              className="project-dialog"
            >
              <div className="project-dialog-header">
                <div>
                  <span className="project-dialog-kicker">PROJECT DETAILS</span>
                  <h2 id="project-dialog-title">{selectedProject.shortTitle}</h2>
                  {selectedProject.shortTitle === 'GRAM MITRA' && <p>Formerly JAN SEVA</p>}
                </div>
                <button type="button" onClick={() => setSelectedProject(null)} className="project-dialog-close" aria-label="Close project details">
                  <X size={18} />
                </button>
              </div>
              <div className="project-dialog-image">
                <img src={selectedProject.image} alt={selectedProject.imageAlt} />
                <span>Representative artwork · not an application screenshot</span>
              </div>
              <p className="project-dialog-description">{selectedProject.description}</p>
              <div className="project-dialog-section">
                <span className="project-details-label">TECHNOLOGIES</span>
                <div className="project-stack">
                  {selectedProject.stack.map((item) => <span key={item}>{item}</span>)}
                </div>
              </div>
              <div className="project-dialog-section">
                <span className="project-details-label">FEATURES &amp; FOCUS</span>
                <ul className="project-dialog-features">
                  {selectedProject.features.map((feature) => <li key={feature}>{feature}</li>)}
                </ul>
              </div>
              <div className="project-dialog-actions">
                {selectedProject.github && (
                  <a href={selectedProject.github} target="_blank" rel="noreferrer" className="project-secondary-action">GitHub <ExternalLink size={14} /></a>
                )}
                {selectedProject.demo && (
                  <a href={selectedProject.demo} target="_blank" rel="noreferrer" className="project-primary-action">Live Demo <ExternalLink size={14} /></a>
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

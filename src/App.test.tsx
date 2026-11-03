import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    document.documentElement.dataset.theme = 'dark'
    window.localStorage.clear()
  })

  it('renders the hero heading and intro copy', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /hi, i'm chirag chhirauliya/i })).toBeInTheDocument()
    })

    expect(screen.getByText(/computer science engineering student \| developer \| data science learner/i)).toBeInTheDocument()
  })

  it('renders matching GitHub and LeetCode profile cards', () => {
    render(<App />)

    const githubLink = screen.getByRole('link', { name: /open github profile/i })
    const leetcodeLink = screen.getByRole('link', { name: /open leetcode profile/i })
    const githubCard = githubLink.closest('article')
    const leetcodeCard = leetcodeLink.closest('article')

    expect(githubLink).toHaveAttribute('href', 'https://github.com/chiragchhirauliya')
    expect(leetcodeLink).toHaveAttribute('href', 'https://leetcode.com/u/9754850257/')
    expect(githubLink).toHaveAttribute('target', '_blank')
    expect(leetcodeLink).toHaveAttribute('rel', 'noopener noreferrer')
    expect(githubCard).toHaveClass('social-profile-card', 'flex-col')
    expect(leetcodeCard).toHaveClass('social-profile-card', 'flex-col')
    expect(githubLink).toHaveClass('mt-auto')
    expect(leetcodeLink).toHaveClass('mt-auto')
    expect(document.querySelector('#github .coding-profiles-grid')).toHaveClass('lg:grid-cols-2')
  })

  it('renders verified achievements, certificate gallery entries, and profile links without invented stats', () => {
    render(<App />)

    const achievementsSection = document.querySelector('#achievements')
    expect(achievementsSection).toHaveTextContent('PARTICIPATION')
    expect(achievementsSection).toHaveTextContent('Participated once at the national level')
    expect(achievementsSection).toHaveTextContent('BGI Hackathon')
    expect(achievementsSection).not.toHaveTextContent('Apex Planet Software Pvt. Ltd.')
    expect(achievementsSection).not.toHaveTextContent('Ushankar Educational & Charitable Trust')
    expect(document.querySelector('#experience')).toHaveTextContent('Apex Planet Software Pvt. Ltd.')
    expect(document.querySelector('#experience')).toHaveTextContent('Ushankar Educational & Charitable Trust')
    expect(achievementsSection).not.toHaveTextContent(/winner|won the/i)

    const certificateCards = [...document.querySelectorAll('#certificates .certificate-gallery-item')]
    expect(certificateCards).toHaveLength(5)
    expect(certificateCards.map((card) => card.querySelector('h3')?.textContent)).toEqual([
      'Smart India Hackathon (SIH)',
      'BGI Hackathon',
      'Web Development Intern',
      'Python Certificate',
      'JavaScript Certificate',
    ])
    expect(certificateCards[2]).toHaveTextContent('Apex Planet Software Pvt. Ltd.')
    expect(certificateCards[0]).not.toHaveTextContent('Issuing organization not listed')
    expect(certificateCards[0].querySelector('.certificate-document')).toHaveAttribute('aria-label', 'Intentionally blurred preview of the Smart India Hackathon (SIH) certificate')
    expect(certificateCards[0].querySelector('.certificate-document img')).toHaveAttribute('src', 'https://lh3.googleusercontent.com/d/1VSn_jiNjHsEkiepfDeWeS9Bmo4OSP_q5=w800')
    expect(certificateCards[0].querySelector('.certificate-preview-note')).toBeNull()
    expect(certificateCards[0].querySelector('.certificate-gallery-copy')).toHaveTextContent('Hackathon participation')
    expect(certificateCards[0].querySelector('.certificate-gallery-copy')).not.toHaveTextContent('Issuing organization not listed')
    expect(certificateCards[0].querySelector('.certificate-gallery-action')).toHaveClass('certificate-gallery-action')
    expect(certificateCards[0].querySelector('.certificate-gallery-action')).toHaveTextContent('View Certificate →')
    expect(certificateCards[0].querySelectorAll('.certificate-gallery-action svg')).toHaveLength(0)

    const githubLink = screen.getByRole('link', { name: /open github profile/i })
    const leetcodeLink = screen.getByRole('link', { name: /open leetcode profile/i })
    expect(githubLink).toHaveAttribute('href', 'https://github.com/chiragchhirauliya')
    expect(leetcodeLink).toHaveAttribute('href', 'https://leetcode.com/u/9754850257/')
    expect(githubLink).toHaveAttribute('target', '_blank')
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
    expect(leetcodeLink).toHaveAttribute('target', '_blank')
    expect(leetcodeLink).toHaveAttribute('rel', 'noopener noreferrer')
    expect(document.querySelector('#leetcode')).toHaveTextContent('DATA STRUCTURES')
    expect(document.querySelector('#github')).not.toHaveTextContent(/followers|repositories:|stars:|rating/i)
  })

  it('renders the three education entries in chronological order', () => {
    render(<App />)

    const educationCards = [...document.querySelectorAll('#education article')]
    expect(educationCards).toHaveLength(3)
    expect(educationCards[0]).toHaveTextContent('Class 10th')
    expect(educationCards[0]).toHaveTextContent('2021–2022')
    expect(educationCards[0]).toHaveTextContent('Jawahar Navodaya Vidyalaya, Panna, Madhya Pradesh')
    expect(educationCards[1]).toHaveTextContent('Class 12th')
    expect(educationCards[1]).toHaveTextContent('2023–2024')
    expect(educationCards[1]).toHaveTextContent('Govt. Higher Secondary School, Ajaigarh, Panna')
    expect(educationCards[2]).toHaveTextContent('B.Tech')
    expect(educationCards[2]).toHaveTextContent('2024–2028')
    expect(educationCards[2]).toHaveTextContent('Computer Science and Engineering (Data Science)')
    expect(educationCards[2]).toHaveTextContent('Current CGPA 6.81')
  })

  it('renders the verified experience, hackathon, and volunteering details', () => {
    render(<App />)

    const experienceCards = [...document.querySelectorAll('#experience article')]
    expect(experienceCards).toHaveLength(2)
    expect(document.querySelector('#achievements')).toHaveTextContent('2 verified hackathon participations')
    expect(screen.getAllByText('Smart India Hackathon (SIH)')).toHaveLength(2)
    expect(screen.getAllByText('BGI Hackathon')).toHaveLength(2)
    expect(document.querySelector('#experience')).not.toHaveTextContent('Smart India Hackathon')
    expect(document.querySelector('#experience')).not.toHaveTextContent('BGI Hackathon')
    expect(experienceCards[0]).toHaveTextContent('Web Development Intern')
    expect(experienceCards[0]).toHaveTextContent('Apex Planet Software Pvt. Ltd.')
    expect(experienceCards[0]).toHaveTextContent('November 2025 – December 2025')
    expect(experienceCards[0]).toHaveTextContent('Implemented responsive layouts and improved website functionality.')
    expect(experienceCards[1]).toHaveTextContent('Ushankar Educational & Charitable Trust, Sagar')
    expect(experienceCards[1]).toHaveTextContent('2024 – Present')
    expect(experienceCards[1]).toHaveTextContent('Participated in organizing educational programs.')
  })

  it('integrates supplied certificates into the matching existing cards', () => {
    render(<App />)

    const certificateUrls = {
      sih: 'https://drive.google.com/file/d/1VSn_jiNjHsEkiepfDeWeS9Bmo4OSP_q5/view?usp=drivesdk',
      bgi: 'https://drive.google.com/file/d/1NkN2oA39-nnEN62jtP7UYkuZYSELQFd0/view?usp=drivesdk',
      apex: 'https://drive.google.com/file/d/1fiS0uAPl7P4n5CgqUDvRWO5NnN3tb0Ji/view?usp=drivesdk',
      python: 'https://drive.google.com/file/d/1lDiQOTb4uhY3bRqIEsfVYSXbgZ-Oh25J/view?usp=drivesdk',
      javascript: 'https://drive.google.com/file/d/1daiQk76yqvNgbMIFsIucYfSa-BD8UDSk/view?usp=drivesdk',
    }
    const experienceCards = [...document.querySelectorAll('#experience article')]
    const achievementCards = [...document.querySelectorAll('#achievements .achievement-entry')]
    const cardForTitle = (cards: Element[], title: string) =>
      cards.find((card) => card.querySelector('h3')?.textContent === title)

    expect(cardForTitle(achievementCards, 'Smart India Hackathon (SIH)')?.querySelector('a')).toHaveAttribute('href', certificateUrls.sih)
    expect(cardForTitle(achievementCards, 'BGI Hackathon')?.querySelector('a')).toHaveAttribute('href', certificateUrls.bgi)
    expect(cardForTitle(experienceCards, 'Web Development Intern')?.querySelector('a')).toHaveAttribute('href', certificateUrls.apex)

    const skillLinks = [...document.querySelectorAll('#skills a')]
    expect(skillLinks.map((link) => link.getAttribute('href'))).toEqual([certificateUrls.python, certificateUrls.javascript])
    const certificateGalleryLinks = [...document.querySelectorAll('#certificates .certificate-gallery-action[rel="noopener noreferrer"][target="_blank"]')]
    expect(certificateGalleryLinks).toHaveLength(5)
    expect(certificateGalleryLinks.map((link) => link.getAttribute('href'))).toEqual([
      certificateUrls.sih,
      certificateUrls.bgi,
      certificateUrls.apex,
      certificateUrls.python,
      certificateUrls.javascript,
    ])
    const certificatePreviews = [...document.querySelectorAll('#certificates .certificate-document img')]
    expect(certificatePreviews.map((image) => image.getAttribute('src'))).toEqual([
      'https://lh3.googleusercontent.com/d/1VSn_jiNjHsEkiepfDeWeS9Bmo4OSP_q5=w800',
      'https://lh3.googleusercontent.com/d/1NkN2oA39-nnEN62jtP7UYkuZYSELQFd0=w800',
      'https://lh3.googleusercontent.com/d/1fiS0uAPl7P4n5CgqUDvRWO5NnN3tb0Ji=w800',
      'https://lh3.googleusercontent.com/d/1lDiQOTb4uhY3bRqIEsfVYSXbgZ-Oh25J=w800',
      'https://lh3.googleusercontent.com/d/1daiQk76yqvNgbMIFsIucYfSa-BD8UDSk=w800',
    ])
    certificatePreviews.forEach((image) => {
      expect(image).toHaveAttribute('alt', '')
      expect(image).toHaveAttribute('loading', 'lazy')
    })
    certificateGalleryLinks.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      expect(link).toHaveTextContent('View Certificate →')
      expect(link.querySelectorAll('svg')).toHaveLength(0)
    })

    const educationCards = [...document.querySelectorAll('#education article')]
    expect(educationCards).toHaveLength(3)
    educationCards.forEach((card) => expect(card).toHaveTextContent('Certificate Not Provided'))
    expect(document.querySelector('#skills')).toHaveTextContent('Certificate Not Provided')
    expect(document.querySelectorAll('#skills').length).toBe(1)
    expect(document.querySelector('#certificates')).toHaveClass('certificates-section')
    expect(screen.getAllByRole('link', { name: 'View Certificate →' })).toHaveLength(5)
    expect(screen.getAllByRole('link', { name: 'View Certificate ↗' })).toHaveLength(5)
  })

  it('renders the modular skills layout and grounded capability section', () => {
    render(<App />)

    expect(document.querySelectorAll('#skills .skill-module')).toHaveLength(4)
    expect(document.querySelector('#skills')).toHaveTextContent('Programming')
    expect(document.querySelector('#skills')).toHaveTextContent('Data Structures and Algorithms')
    expect(document.querySelector('#skills')).toHaveTextContent('GitHub')
    expect(document.querySelectorAll('#services .service-item')).toHaveLength(3)
    expect(document.querySelector('#services')).toHaveTextContent('Web Development')
    expect(document.querySelector('#services')).toHaveTextContent('Programming & Problem Solving')
    expect(document.querySelector('#services')).toHaveTextContent('Data Science Learning')
  })

  it('presents Gram Mitra and JAN SEVA as one featured project with honest artwork labeling', () => {
    render(<App />)

    const projectSection = document.querySelector('#projects')
    expect(projectSection).toHaveTextContent('GRAM MITRA')
    expect(projectSection).toHaveTextContent('Formerly JAN SEVA')
    expect(projectSection?.querySelectorAll('article')).toHaveLength(2)
    expect(projectSection?.querySelector('.project-featured-visual img')).toHaveAttribute('src', '/images/project-jan-seva.webp')
    expect(projectSection).toHaveTextContent('Representative artwork · not an application screenshot')
    expect(projectSection?.querySelectorAll('a')).toHaveLength(0)
  })

  it('filters the canonical projects and opens and closes verified project details', async () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Python' }))
    expect(document.querySelectorAll('#projects article')).toHaveLength(1)
    expect(screen.getByRole('button', { name: 'Python' })).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(screen.getByRole('button', { name: 'All' }))
    fireEvent.click(screen.getAllByRole('button', { name: 'View Project Details' })[0])

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveTextContent('GRAM MITRA')
    expect(dialog).toHaveTextContent('Formerly JAN SEVA')
    expect(dialog).toHaveTextContent('Department classification')
    expect(dialog).toHaveTextContent('Python')
    expect(dialog).not.toHaveTextContent('Responsive UI')
    expect(dialog).not.toHaveTextContent('Public-service approach')
    expect([...dialog.querySelectorAll('.project-dialog-section .project-stack span')].map((tag) => tag.textContent)).toEqual([
      'Python',
      'React',
      'AI',
      'DBMS',
      'Web App',
    ])
    expect([...dialog.querySelectorAll('.project-dialog-features li')].map((item) => item.textContent)).toEqual([
      'Complaint submission',
      'Complaint categories',
      'Department classification',
      'Location integration',
      'Voice input',
      'Hindi and English support',
      'Complaint status tracking',
    ])
    expect(dialog).toHaveTextContent('Representative artwork · not an application screenshot')
    expect(dialog.querySelectorAll('a')).toHaveLength(0)

    fireEvent.keyDown(window, { key: 'Escape' })
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(document.body.style.overflow).not.toBe('hidden')

    fireEvent.click(screen.getAllByRole('button', { name: 'View Project Details' })[0])
    fireEvent.click(screen.getByRole('button', { name: 'Close project details' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('uses the profile image in the navbar and hero, with distinct About artwork', () => {
    render(<App />)

    expect(screen.getByRole('button', { name: 'Go to home' }).querySelector('img')).toHaveAttribute('src', '/images/profile-transparent.webp')
    expect(document.querySelector('#home .profile-image-frame img')).toHaveAttribute('src', '/images/profile-transparent.webp')
    expect(document.querySelector('#about .about-project-visual img')).toHaveAttribute('src', '/images/project-jan-seva.webp')
    expect(document.querySelector('#about .about-project-visual img')).not.toHaveAttribute('src', '/images/profile-transparent.webp')
    expect(document.querySelector('#about .about-project-title')).toHaveTextContent('JAN SEVA')
    expect(document.querySelector('.nav-brand-name')).toHaveTextContent('Chirag Chhirauliya')
  })

  it('switches themes and persists the selected theme', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Switch to light mode' }))
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(window.localStorage.getItem('portfolio-theme')).toBe('light')

    fireEvent.click(screen.getByRole('button', { name: 'Switch to dark mode' }))
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(window.localStorage.getItem('portfolio-theme')).toBe('dark')
  })

  it('shows only verified contact details and keeps coding profiles in the footer', () => {
    render(<App />)

    const contact = document.querySelector('#contact')
    const footer = document.querySelector('footer')
    expect(contact).toHaveTextContent('chiragchhirauliya000@gmail.com')
    expect(contact).toHaveTextContent('+91 97548 50257')
    expect(contact).toHaveTextContent('Bhopal, Madhya Pradesh, India')
    expect(contact).toHaveTextContent('LinkedIn')
    expect(contact).not.toHaveTextContent(/GitHub|LeetCode/i)
    expect(contact?.querySelector('a[href="mailto:chiragchhirauliya000@gmail.com"]')).toBeInTheDocument()
    expect(contact?.querySelector('a[href="tel:+919754850257"]')).toHaveTextContent('+91 97548 50257')
    expect(contact?.querySelector('a[href="https://www.linkedin.com/in/chirag-chhirauliya"][target="_blank"][rel="noopener noreferrer"]')).toBeInTheDocument()

    expect(footer?.querySelector('a[href="https://github.com/chiragchhirauliya"][target="_blank"][rel="noopener noreferrer"]')).toBeInTheDocument()
    expect(footer?.querySelector('a[href="https://www.linkedin.com/in/chirag-chhirauliya"][target="_blank"][rel="noopener noreferrer"]')).toBeInTheDocument()
    expect(footer?.querySelector('a[href="https://leetcode.com/u/9754850257/"][target="_blank"][rel="noopener noreferrer"]')).toBeInTheDocument()
    expect(footer?.querySelector('a[href="/resume/Chirag-Resume.pdf"][download="Chirag-Chhirauliya-Resume.pdf"]')).toBeInTheDocument()
    expect(footer?.querySelector('a[href="#projects"]')).toHaveTextContent('Projects')
    expect(footer).toHaveTextContent(`© ${new Date().getFullYear()} Chirag Chhirauliya`)
  })

  it('validates required fields and email format accessibly', () => {
    render(<App />)

    const form = document.querySelector('#contact form') as HTMLFormElement
    fireEvent.submit(form)
    expect(screen.getByText('Please correct the highlighted fields.')).toBeInTheDocument()
    expect(screen.getByText('Enter your name.')).toBeInTheDocument()
    expect(screen.getByText('Enter your email address.')).toBeInTheDocument()
    expect(screen.getByText('Enter a subject.')).toBeInTheDocument()
    expect(screen.getByText('Enter a message.')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/Full Name/), { target: { value: 'A Visitor' } })
    fireEvent.change(screen.getByLabelText(/Email Address/), { target: { value: 'not-an-email' } })
    fireEvent.change(screen.getByLabelText(/Subject/), { target: { value: 'Hello' } })
    fireEvent.change(screen.getByLabelText(/Message/), { target: { value: 'A message' } })
    fireEvent.submit(form)
    expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument()
  })

  it('does not claim delivery when Formspree is not configured and offers a direct email fallback', () => {
    vi.stubEnv('VITE_FORMSPREE_FORM_ID', '')
    render(<App />)

    const form = document.querySelector('#contact form') as HTMLFormElement
    fireEvent.change(screen.getByLabelText(/Full Name/), { target: { value: 'A Visitor' } })
    fireEvent.change(screen.getByLabelText(/Email Address/), { target: { value: 'visitor@example.com' } })
    fireEvent.change(screen.getByLabelText(/Subject/), { target: { value: 'Portfolio enquiry' } })
    fireEvent.change(screen.getByLabelText(/Message/), { target: { value: 'I would like to connect.' } })
    fireEvent.submit(form)

    expect(screen.getByRole('alert')).toHaveTextContent('VITE_FORMSPREE_FORM_ID')
    expect(screen.getByRole('link', { name: 'Email me directly instead' })).toHaveAttribute(
      'href',
      expect.stringContaining('mailto:chiragchhirauliya000@gmail.com'),
    )
    expect(screen.getByLabelText(/Full Name/)).toHaveValue('A Visitor')
  })

  it('sends valid contact messages to the configured Formspree endpoint and clears only after confirmation', async () => {
    vi.stubEnv('VITE_FORMSPREE_FORM_ID', 'mwllalqo')
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)
    render(<App />)

    const form = document.querySelector('#contact form') as HTMLFormElement
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'A Visitor' } })
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'visitor@example.com' } })
    fireEvent.change(screen.getByLabelText('Subject'), { target: { value: 'Portfolio enquiry' } })
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'I would like to connect.' } })
    fireEvent.submit(form)

    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('sent successfully'))
    expect(fetchMock).toHaveBeenCalledWith(
      'https://formspree.io/f/mwllalqo',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Accept: 'application/json' }),
        body: JSON.stringify({
          name: 'A Visitor',
          email: 'visitor@example.com',
          _replyto: 'visitor@example.com',
          subject: 'Portfolio enquiry',
          message: 'I would like to connect.',
        }),
      }),
    )
    expect(screen.getByLabelText('Full Name')).toHaveValue('')
  })

  it('preserves form values and reports a failed Formspree delivery', async () => {
    vi.stubEnv('VITE_FORMSPREE_FORM_ID', 'mwllalqo')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
    render(<App />)

    const form = document.querySelector('#contact form') as HTMLFormElement
    fireEvent.change(screen.getByLabelText(/Full Name/), { target: { value: 'A Visitor' } })
    fireEvent.change(screen.getByLabelText(/Email Address/), { target: { value: 'visitor@example.com' } })
    fireEvent.change(screen.getByLabelText(/Subject/), { target: { value: 'Portfolio enquiry' } })
    fireEvent.change(screen.getByLabelText(/Message/), { target: { value: 'Please keep this message.' } })
    fireEvent.submit(form)

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('could not be sent'))
    expect(screen.getByLabelText(/Message/)).toHaveValue('Please keep this message.')
  })
})

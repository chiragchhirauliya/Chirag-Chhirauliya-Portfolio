import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    document.documentElement.dataset.theme = 'dark'
    window.localStorage.clear()
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string) =>
        Promise.resolve({
          ok: true,
          json: async () => {
            if (url.includes('/github')) {
              return {
                username: 'chiragchhirauliya',
                profileUrl: 'https://github.com/chiragchhirauliya',
                repositoryCount: 1,
                repositories: [
                  {
                    name: 'portfolio',
                    description: 'Portfolio repository',
                    html_url: 'https://github.com/chiragchhirauliya/portfolio',
                    stargazers_count: 2,
                    forks_count: 1,
                    language: 'TypeScript',
                    updated_at: new Date().toISOString(),
                    created_at: new Date().toISOString(),
                  },
                ],
                lastUpdated: new Date().toISOString(),
              }
            }

            if (url.includes('/leetcode')) {
              return {
                success: true,
                stats: {
                  totalSolved: 150,
                  easySolved: 65,
                  mediumSolved: 70,
                  hardSolved: 15,
                  acceptanceRate: 72,
                },
                lastUpdated: new Date().toISOString(),
              }
            }

            if (url.includes('/contact')) {
              return { success: true, message: 'Message sent successfully.' }
            }

            return {}
          },
        }),
      ),
    )
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
    expect(leetcodeLink).toHaveAttribute('rel', 'noreferrer')
    expect(githubCard).toHaveClass('social-profile-card', 'flex-col')
    expect(leetcodeCard).toHaveClass('social-profile-card', 'flex-col')
    expect(githubLink).toHaveClass('mt-auto')
    expect(leetcodeLink).toHaveClass('mt-auto')
    expect(document.querySelector('#github > div')).toHaveClass('lg:grid-cols-2')
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
    expect(experienceCards).toHaveLength(4)
    expect(screen.getByText('2 National-Level Hackathon Participations')).toBeInTheDocument()
    expect(screen.getAllByText('Smart India Hackathon (SIH)')).toHaveLength(1)
    expect(screen.getAllByText('BGI Hackathon')).toHaveLength(1)
    expect(experienceCards[0]).toHaveTextContent('Smart India Hackathon (SIH)')
    expect(experienceCards[0]).toHaveTextContent('Participated once at the national level')
    expect(experienceCards[1]).toHaveTextContent('BGI Hackathon')
    expect(experienceCards[1]).toHaveTextContent('National-level participation')
    expect(experienceCards[1]).toHaveTextContent('JAN SEVA project concept')
    expect(experienceCards[2]).toHaveTextContent('Web Development Intern')
    expect(experienceCards[2]).toHaveTextContent('Apex Planet Software Pvt. Ltd.')
    expect(experienceCards[2]).toHaveTextContent('November 2025 – December 2025')
    expect(experienceCards[2]).toHaveTextContent('Implemented responsive layouts and improved website functionality.')
    expect(experienceCards[3]).toHaveTextContent('Ushankar Educational & Charitable Trust, Sagar')
    expect(experienceCards[3]).toHaveTextContent('2024 – Present')
    expect(experienceCards[3]).toHaveTextContent('Participated in organizing educational programs.')
  })

  it('uses the profile image in the navbar and hero, but not in About', () => {
    render(<App />)

    expect(screen.getByRole('button', { name: 'Go to home' }).querySelector('img')).toHaveAttribute('src', '/images/profile-transparent.webp')
    expect(document.querySelector('#home .profile-image-frame img')).toHaveAttribute('src', '/images/profile-transparent.webp')
    expect(document.querySelectorAll('#about img')).toHaveLength(0)
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
})

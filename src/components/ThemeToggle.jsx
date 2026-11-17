import { useEffect, useState } from 'react'

const STORAGE_KEY = 'symbio-theme'

function getInitialTheme() {
  if (typeof document === 'undefined') return false
  return document.documentElement.classList.contains('dark')
}

// Sun by day, crescent moon by night. Both icons are stacked and cross-fade /
// rotate into each other, driven by the `dark` variant on <html>.
function ThemeToggle() {
  const [dark, setDark] = useState(getInitialTheme)

  // Keep other tabs in sync with the choice made here.
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== STORAGE_KEY) return
      const nextDark = event.newValue === 'dark'
      document.documentElement.classList.toggle('dark', nextDark)
      setDark(nextDark)
    }

    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const toggle = () => {
    const nextDark = !dark
    document.documentElement.classList.toggle('dark', nextDark)
    setDark(nextDark)
    try {
      window.localStorage.setItem(STORAGE_KEY, nextDark ? 'dark' : 'light')
    } catch {
      // Storage can be blocked (private mode); the theme still applies for this visit.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Switch to daylight mode' : 'Switch to aurora night mode'}
      aria-pressed={dark}
      title={dark ? 'Switch to daylight mode' : 'Switch to aurora night mode'}
      className="glass-dark group absolute right-6 top-full z-50 mt-3 flex size-11 items-center justify-center rounded-full text-white transition-[transform,background-color,border-color] hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600 active:scale-95 sm:right-8 sm:top-1/2 sm:mt-0 sm:-translate-y-1/2"
    >
      <span className="relative block size-6" aria-hidden="true">
        {/* Sun: visible in daylight, spins and shrinks away at night */}
        <svg
          viewBox="0 0 24 24"
          className="absolute inset-0 size-6 rotate-0 scale-100 opacity-100 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] dark:-rotate-90 dark:scale-50 dark:opacity-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="4.1" fill="currentColor" stroke="none" />
          <g className="origin-center transition-transform duration-500 group-hover:rotate-45">
            <path d="M12 2.9v2.1M12 19v2.1M2.9 12h2.1M19 12h2.1" />
            <path d="M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
          </g>
        </svg>

        {/* Moon: hidden in daylight, rotates in at night */}
        <svg
          viewBox="0 0 24 24"
          className="absolute inset-0 size-6 -rotate-90 scale-50 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] dark:rotate-0 dark:scale-100 dark:opacity-100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        >
          <path
            d="M20.2 14.4A8.3 8.3 0 0 1 9.6 3.8a8.4 8.4 0 1 0 10.6 10.6Z"
            fill="currentColor"
            stroke="none"
          />
          <path d="M5.2 4.2v2M4.2 5.2h2" strokeWidth="1.4" className="text-sun-400" />
          <path d="M8.6 1.8v1.4M7.9 2.5h1.4" strokeWidth="1.2" className="text-sun-400" />
        </svg>
      </span>
    </button>
  )
}

export default ThemeToggle

import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Globe, Home, PawPrint, Sprout, Earth } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

const links = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/animals', label: 'Animals', icon: PawPrint },
  { to: '/plants', label: 'Plants', icon: Sprout },
  { to: '/environment', label: 'Environment', icon: Earth },
]

function Navbar() {
  const { pathname } = useLocation()
  const listRef = useRef(null)
  const indicatorRef = useRef(null)
  const linkRefs = useRef([])

  const activeIndex = Math.max(
    0,
    links.findIndex(({ to }) =>
      to === '/' ? pathname === '/' : pathname.startsWith(to),
    ),
  )

  // One shared pill is moved/sized to the active link instead of each link
  // painting its own background. It only travels when the page changes, so
  // hovering never breaks the slide.
  const sync = useCallback(() => {
    const link = linkRefs.current[activeIndex]
    const pill = indicatorRef.current
    if (!link || !pill) return
    pill.style.transform = `translate(${link.offsetLeft}px, ${link.offsetTop}px)`
    pill.style.width = `${link.offsetWidth}px`
    pill.style.height = `${link.offsetHeight}px`
  }, [activeIndex])

  useLayoutEffect(() => {
    sync()
  }, [sync, pathname])

  // Links change width while the labels expand/collapse on nav hover, so keep
  // re-measuring whenever the list or a link resizes.
  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(() => sync())
    if (listRef.current) observer.observe(listRef.current)
    linkRefs.current.forEach((link) => link && observer.observe(link))
    return () => observer.disconnect()
  }, [sync])

  return (
    <header className="sticky top-4 z-50 flex justify-center px-4">
      <ThemeToggle />
      <nav className="group flex items-center gap-3 rounded-full glass-dark px-4 py-3 text-white sm:gap-6 sm:px-5">
        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-2 font-heading text-lg font-bold sm:text-xl"
        >
          <Globe size={28} />
          SYMBIO
        </NavLink>

        {/* Links */}
        <ul ref={listRef} className="relative flex items-center gap-0.5 sm:gap-1">
          <span ref={indicatorRef} aria-hidden="true" className="nav-pill" />
          {links.map(({ to, label, icon: Icon }, index) => (
            <li key={to}>
              <NavLink
                ref={(node) => {
                  linkRefs.current[index] = node
                }}
                to={to}
                end={to === '/'}
                aria-label={label}
                className={({ isActive }) =>
                  `relative z-10 flex items-center rounded-full p-1.5 transition-[color,filter] duration-200 sm:p-2 ${
                    isActive
                      ? 'text-white'
                      : 'text-white/60 hover:text-white hover:drop-shadow-[0_0_8px_rgb(255_255_255_/_0.65)]'
                  }`
                }
              >
                <Icon size={20} />
                <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 md:group-hover:ml-2 md:group-hover:max-w-28 md:group-hover:opacity-100 md:group-focus-within:ml-2 md:group-focus-within:max-w-28 md:group-focus-within:opacity-100">
                  {label}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export default Navbar

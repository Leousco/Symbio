import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/animals', label: 'Animals' },
  { to: '/plants', label: 'Plants' },
  { to: '/recycling', label: 'Recycling' },
]

function Navbar() {
  const [open, setOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    `rounded-full px-4 py-2 font-semibold transition ${
      isActive ? 'bg-leaf-500 text-white' : 'hover:bg-leaf-100'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-leaf-100 bg-cream/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <NavLink to="/" className="font-heading text-2xl font-bold text-leaf-600">
          🌱 Symbio
        </NavLink>

        {/* Desktop links */}
        <ul className="hidden gap-2 md:flex">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} className={linkClass}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Mobile menu button */}
        <button
          className="rounded-lg px-3 py-2 text-2xl md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile links */}
      {open && (
        <ul className="flex flex-col gap-1 px-4 pb-4 md:hidden">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}

export default Navbar
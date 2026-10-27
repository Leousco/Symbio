import { NavLink } from 'react-router-dom'
import { Globe, Home, PawPrint, Sprout, Earth } from 'lucide-react'

const links = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/animals', label: 'Animals', icon: PawPrint },
  { to: '/plants', label: 'Plants', icon: Sprout },
  { to: '/environment', label: 'Environment', icon: Earth },
]

function Navbar() {
  return (
    <header className="sticky top-4 z-50 flex justify-center px-4">
      <nav className="group flex items-center gap-6 rounded-full glass-dark px-5 py-3 text-white">
        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-2 font-heading text-xl font-bold"
        >
          <Globe size={28} />
          SYMBIO
        </NavLink>

        {/* Links */}
        <ul className="flex items-center gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                aria-label={label}
                className={({ isActive }) =>
                  `flex items-center rounded-full p-2 transition-colors hover:bg-white/15 ${
                    isActive ? 'bg-leaf-600' : ''
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
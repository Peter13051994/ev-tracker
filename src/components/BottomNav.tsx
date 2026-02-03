import { NavLink } from "react-router-dom"

export default function BottomNav() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center text-xs ${
      isActive ? "text-blue-600" : "text-gray-500"
    }`

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-around py-2">
      <NavLink to="/" className={linkClass}>
        <span>📊</span>
        <span>Prehľad</span>
      </NavLink>

      <NavLink to="/trips" className={linkClass}>
        <span>🚗</span>
        <span>Jazdy</span>
      </NavLink>

      <NavLink to="/charging" className={linkClass}>
        <span>⚡</span>
        <span>Nabíjanie</span>
      </NavLink>

      <NavLink to="/cars" className={linkClass}>
        <span>🚘</span>
        <span>Autá</span>
      </NavLink>

      <NavLink to="/settings" className={linkClass}>
        <span>⚙️</span>
        <span>Nastavenia</span>
      </NavLink>
    </nav>
  )
}

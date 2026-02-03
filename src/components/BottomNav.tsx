import { NavLink } from "react-router-dom"

export default function BottomNav() {
  const base =
    "flex flex-col items-center justify-center text-xs flex-1 py-2"

  const active = "text-blue-600"
  const inactive = "text-gray-400"

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `${base} ${isActive ? active : inactive}`
        }
      >
        🏠
        <span>Prehľad</span>
      </NavLink>

      <NavLink
        to="/trips"
        className={({ isActive }) =>
          `${base} ${isActive ? active : inactive}`
        }
      >
        🚗
        <span>Jazdy</span>
      </NavLink>

      <NavLink
        to="/charging"
        className={({ isActive }) =>
          `${base} ${isActive ? active : inactive}`
        }
      >
        🔌
        <span>Nabíjanie</span>
      </NavLink>

      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `${base} ${isActive ? active : inactive}`
        }
      >
        ⚙️
        <span>Nastavenia</span>
      </NavLink>
    </nav>
  )
}

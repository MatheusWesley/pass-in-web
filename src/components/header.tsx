import NLWUniteIcon from "../assets/nlw-unite-icon.svg"
import { NavLink } from "./nav-link"

export function Header () {
  return (
    <div className="flex items-center gap-5 h-12 py-2">
      <img src={NLWUniteIcon} />
      <nav className="flex items-center gap-5">
        <NavLink href="#" className="text-zinc-300">Eventos</NavLink>
        <NavLink href="#">Participantes</NavLink>
      </nav>
    </div>
  )
}
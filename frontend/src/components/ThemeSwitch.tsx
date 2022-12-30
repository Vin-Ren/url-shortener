import { MoonIcon, SunIcon } from "./Icon"
import './ThemeSwitch.css';
import { ThemeToggler } from "../hooks/useTheme";


export default function ThemeSwitch({ theme, setTheme }: { theme: any, setTheme: Function }) {
  return (
    <button className="dark-mode-switch" onClick={(e) => setTheme(ThemeToggler)}>
      {(theme == 'dark') ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}

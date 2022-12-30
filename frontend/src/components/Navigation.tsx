import { Link, NavLink } from 'react-router-dom';
import './Navigation.css';

export { Link };

export function NavItem({ to, children, ...props }: { to: string, children: any }) {
    return (<NavLink to={to} className={({ isActive }) => isActive ? "nav-item-active" : "nav-item"} {...props}>{children}</NavLink>)
}


export function NavBar({ children, ...props }: { children: any }) {
    return (<ul className="nav-bar" {...props}>{children}</ul>)
}

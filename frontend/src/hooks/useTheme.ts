import {useEffect} from 'react';
import useLocalStorage from "./useLocalStorage";


export const ThemeToggler = (prevTheme:any) => (prevTheme === 'light') ? 'dark' : 'light'


export default function useTheme() {
    const [theme, setTheme] = useLocalStorage('theme', () => (window.matchMedia('(prefers-color-scheme: dark)').matches)? "dark" : "light");
    return [theme, setTheme]
}

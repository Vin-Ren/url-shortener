import axios from "axios";
import useLocalStorage from "./useLocalStorage";
import { AuthData } from "../context/AuthContext";
import { useEffect } from "react";


export default function useAuth() {
    const [auth, setAuth] = useLocalStorage('auth_data', () : AuthData => {
        return {authenticated:false}
    });
    useEffect(()=>{
        if (!(auth.authenticated)) {
            axios.defaults.headers.common['Authorization'] = '';
            return;
        };
        axios.defaults.headers.common['Authorization'] = `Bearer ${auth.accessToken}`
    }, [auth])
    return [auth, setAuth]
}

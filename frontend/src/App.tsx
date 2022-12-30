import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard';
import Profile from './pages/User/Profile';
import Register from './pages/User/Register';
import Login from './pages/User/Login';
import { NavItem, NavBar } from './components/Navigation'
import ThemeSwitch from './components/ThemeSwitch';
import { UserIcon } from './components/Icon';
import Alert from './components/Alert';
import useTheme from './hooks/useTheme';
import useAuth from './hooks/useAuth';
import { AuthContext } from './context/AuthContext';
import CreateShortener from './pages/Dashboard/CreateShortener';
import EditShortener from './pages/Dashboard/EditShortener';


function App() {
  const { state } = useLocation();
  const [theme, setTheme] = useTheme();

  const [auth, setAuth] = useAuth();

  // console.log(state)
  return (
    <div className={theme}> {/* Solely for dark mode*/}
      <div id="app"> {/* For styling, as if styling body */}
        <NavBar>
          <NavItem to="/" >Home</NavItem>
          <NavItem to="/dashboard">Dashboard</NavItem>
          <NavItem to="/profile"><UserIcon /></NavItem>
        </NavBar>
        {/* state={{type:'element', element: <ELEMENT HERE />}} */}
        {(state?.type === 'alert' && (!(state?.target) || state?.target==='root')) ? <Alert {...state?.alert}/> : null}
        <div className="main">
          <AuthContext.Provider value={{ auth, setAuth }}>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/create' element={<CreateShortener />} />
              <Route path='/edit/:id' element={<EditShortener />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/register' element={<Register />} />
              <Route path='/login' element={<Login />} />
            </Routes>
          </AuthContext.Provider>
        </div>
        <ThemeSwitch theme={theme} setTheme={setTheme} />
      </div>
    </div>
  )
}

export default App

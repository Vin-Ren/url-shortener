import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Form, EmailInput, SubmitButton, NewPasswordInput } from '../../components/Form';
import { AuthContext } from '../../context/AuthContext';
import logo from '../../assets/logo.svg';
import './index.css'


export default function Login({ }) {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (auth.authenticated) {
      navigate("/", { state: { type: 'alert', alert: { className: 'info-alert', info: 'Redirected', detail: "You have already logged in." } } })
    }
  }, [])

  const handleOnSubmit = () => {
    let cancel: any;
    axios({
      method: 'POST',
      url: '/api/login',
      data: {
        'email': email,
        'password': password
      },
      cancelToken: new axios.CancelToken(c => cancel = c)
    }).then((res) => {
      setAuth({ authenticated: true, email: res.data.email, accessToken: res.data.token })
      navigate("/dashboard", { state: { type: 'alert', alert: { className: 'success-alert', info: 'Redirected', detail: "You have successfully logged in." } } })
    }).catch((error) => {
      if (axios.isCancel(error)) return;
      else if (error.response) {
        let alert = { className: 'danger-alert', info: '', detail: '' };
        if (error.response.status === 400) {
          alert = { ...alert, info: 'Invalid Credentials.', detail: 'Please fill both fields correctly.' }
        } else {
          return
        }
        navigate('/login', { state: { type: 'alert', alert: alert } })
      } else {
        console.log('Error', error.message)
      }
    })
    return () => cancel()
  }

  return (
    <div className='user-form-container'>
      <Form onSubmit={handleOnSubmit} className="user-form">
        <header>
          <img src={logo} />
          <div>Login</div>
        </header>
        <EmailInput placeholder='Email' value={email} onChange={setEmail} />
        <NewPasswordInput placeholder='Password' value={password} onChange={setPassword} minLength={8} autoComplete="new-password" />
        <div className='actions-container'>
          <Link to="/register"><small>Dont have an account? Register</small></Link>
          <SubmitButton>Login</SubmitButton>
        </div>
      </Form>
    </div>)
}

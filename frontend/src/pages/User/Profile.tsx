import axios from 'axios'
import './Profile.css'
import { ExitIcon, TrashIcon } from '../../components/Icon'
import DeleteAccountModal from './components/DeleteAccountModal'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'


export default function Profile({ }) {
  const navigate = useNavigate();
  const {auth, setAuth} = useContext(AuthContext);
  const [data, setData] = useState({ email: '?', shortener_count: '?', total_hits: '?' });
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  useEffect(() => {
    if (!(auth.authenticated)) {
      navigate("/login", { state: { type: 'alert', alert: {className:'warning-alert', info:'Forbidden!' , detail:'Please login before accessing page.'}} })
      return
    }

    let cancel: any;
    axios({
      method: 'GET',
      url: '/api/summary',
      cancelToken: new axios.CancelToken(c => cancel = c)
    }).then((res) => {
      setData({ email: res.data.email, shortener_count: res.data.shortener_count, total_hits: (res.data.shorteners_hits.reduce((currSum: any, entry: any) => currSum + entry.hits, 0)) });
    }).catch((error) => {
      if (axios.isCancel(error)) return;
      if (error.response) {
        if (error.response.status === 403) {
          navigate('/', { state: { type: 'alert', alert: { className: 'danger-alert', info: 'Something went wrong.', detail: 'Please refresh the page. If this message still shows, please logout and login again.' } } })
        }
      } else {
        console.log('Error', error.message)
      }
    })
    return () => cancel()
  }, [])

  const handleLogout = () => {
    setAuth({authenticated:false});
    navigate("/", {state:{type: 'alert', alert: {className: 'success-alert', info:'Redirected', detail:"You have logged out."}}})
  }

  return (<div className='profile'>
    <div className="header">Profile</div>
    <section>
      <p>Email: {data.email}</p>
      <p>Shortener count: {data.shortener_count}</p>
      <p>Total hits: {data.total_hits}</p>
    </section>
    <section>
      <div className="actions-header">Actions</div>
      <button className="logout-button" onClick={(e) => handleLogout()}><ExitIcon/> Logout</button>
      <button className='delete-account' onClick={(e) => setDeleteModalVisible(true) }><TrashIcon /> Delete account</button>
      <DeleteAccountModal visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)} />
    </section>
  </div>)
}

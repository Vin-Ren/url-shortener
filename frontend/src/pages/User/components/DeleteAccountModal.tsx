import axios from "axios";
import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Alert from "../../../components/Alert";
import { EmailInput, Form, PasswordInput, SubmitButton } from "../../../components/Form";
import { XMarkIcon } from "../../../components/Icon";
import ModalWrapper from "../../../components/Modal";
import { AuthContext } from "../../../context/AuthContext";
import './DeleteAccountModal.css';


export default function DeleteAccountModal({ visible, onClose, ...props }: { visible: boolean, onClose: Function }) {
  const {state} = useLocation();
  const navigate = useNavigate();
  const {setAuth} = useContext(AuthContext);
  const [password, setPassword] = useState("");

  if (!visible) return <></>
  
  const onSubmitHandler = async () => {
    let cancel:any
    axios({
      method:'DELETE',
      url:'/api/delete_account',
      data:{
        'password':password
      },
      cancelToken: new axios.CancelToken(c=>cancel=c)
    }).then((res) => {
      setAuth({authenticated:false})
      navigate('/', {state:{type:'alert', alert:{className:'success-alert', info:'Account successfully deleted!'}}})
    }).catch((error) => {
      if (error.response) {
        if (error.response.status === 409) {
          navigate('/profile', {state:{type:'alert', target:'delete-account-modal', alert:{className:'danger-alert', info:'Failed to delete account.', detail:'Please delete all of your shorteners before retrying.'}}})
        } else if (error.response.status === 400) {
          navigate('/profile', {state:{type:'alert', target:'delete-account-modal', alert:{className:'danger-alert', info:'Failed to delete account.', detail:'Invalid credentials supplied.'}}})
        }
      }
    })
  }

  return (
    <ModalWrapper className="delete-account-modal" {...props}>
      <Form className="delete-account-form" onSubmit={onSubmitHandler}>
        <header>Delete Account</header>
        <p>Your account will be deleted immediately. This action cannot be undone.</p>
        <EmailInput hidden/>
        <PasswordInput value={password} placeholder="Password" minLength={8} onChange={setPassword}/>
        {(state?.type === 'alert' && (state?.target === 'delete-account-modal')) ? <Alert {...state?.alert}/> : null}
        <div className="actions-container">
          <button className="cancel-button close-modal" onClick={(e) => (onClose())}>Cancel</button>
          <SubmitButton className="confirm-button">Delete Account</SubmitButton>
        </div>
      </Form>
    </ModalWrapper>)
}

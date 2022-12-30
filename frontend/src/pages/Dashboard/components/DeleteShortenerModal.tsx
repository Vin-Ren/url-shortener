import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Alert from "../../../components/Alert";
import { Form, SubmitButton } from "../../../components/Form";
import ModalWrapper from "../../../components/Modal";
import { ShortenerInfoCard } from "./Card";
import './DeleteShortenerModal.css';


export default function DeleteShortenerModal({ targetId, visible, onClose, onDelete, ...props }: { targetId: number, visible: boolean, onClose: Function, onDelete: Function }) {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  if (!visible) return <></>

  useEffect(() => {
    let cancel: any;
    axios({
      method: 'GET',
      url: `/api/info/${targetId}`,
      cancelToken: new axios.CancelToken(c => cancel = c)
    }).then((res) => {
      setData(res.data);
    }).catch((error) => {
      if (axios.isCancel(error)) return;
      else if (error.response) {
        if (error.response.status === 404) {
          navigate('/dashboard', { state: { type: 'alert', target: 'delete-shortener-modal', alert: { className: 'danger-alert', info: 'Error.', detail: 'The shortener is not found, try refreshing the page before retrying.' } } })
        } else if (error.response.status === 403) {
          navigate('/dashboard', { state: { type: 'alert', target: 'delete-shortener-modal', alert: { className: 'danger-alert', info: 'Error.', detail: 'You do not have access to edit this shortener.' } } })
        }
      }
    })
  }, [])

  const onSubmitHandler = () => {
    let cancel: any
    axios({
      method: 'DELETE',
      url: `/api/delete/${targetId}`,
      cancelToken: new axios.CancelToken(c => cancel = c)
    }).then((res) => {
      onClose()
      onDelete()
      navigate('/dashboard', { state: { type: 'alert', alert: { className: 'warning-alert', info: 'Shortener successfully deleted!' } } })
    }).catch((error) => {
      if (error.response) {
        if (error.response.status === 404) {
          navigate('/dashboard', { state: { type: 'alert', target: 'delete-shortener-modal', alert: { className: 'danger-alert', info: 'Failed.', detail: 'The shortener is not found, try refreshing the page before retrying.' } } })
        } else if (error.response.status === 403) {
          navigate('/dashboard', { state: { type: 'alert', target: 'delete-shortener-modal', alert: { className: 'danger-alert', info: 'Failed.', detail: 'Your login session might have expired.' } } })
        }
      }
    })
  }

  return (
    <ModalWrapper className="delete-shortener-modal" {...props}>
      <Form className="delete-shortener-form" onSubmit={onSubmitHandler}>
        <header>Delete Shortener</header>
        {(!(data)) || <ShortenerInfoCard onDelete={() => { }} onEdit={() => { }} noActions={true} {...(data as any)} />}
        <p>This will delete the shortener immediately. All the statistics accumulated will also be deleted. The shortener will not be recoverable.</p>
        {(state?.type === 'alert' && (state?.target === 'delete-shortener-modal')) ? <Alert {...state?.alert} /> : null}
        <div className="actions-container">
          <button className="cancel-button close-modal" onClick={(e) => (onClose())}>Cancel</button>
          <SubmitButton className="confirm-button">Confirm</SubmitButton>
        </div>
      </Form>
    </ModalWrapper>)
}

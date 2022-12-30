import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Alert from "../../components/Alert";
import { Form, SubmitButton, TextInput } from "../../components/Form";
import { BackIcon } from "../../components/Icon";
import { AuthContext } from "../../context/AuthContext";
import './ShortenerForm.css'


export default function EditShortener({ }) {
  const { id } = useParams()
  const { state } = useLocation();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [suffix, setSuffix] = useState("");
  const [target, setTarget] = useState("");

  useEffect(() => {
    if (!(auth.authenticated)) {
      navigate("/login", { state: { type: 'alert', alert: { className: 'warning-alert', info: 'Forbidden!', detail: 'Please login before accessing page.' } } })
      return
    }

    axios({
      method: 'GET',
      url: `/api/info/${id}`
    }).then((res) => {
      setSuffix(res.data.suffix);
      setTarget(res.data.target);
    }).catch((err) => {
      if (err.response) {
        if (err.response.status === 403) {
          return navigate('/dashboard', { state: { type: 'alert', alert: { className: 'danger-alert', info: 'Cannot edit shortener.', detail: 'It is not your shortener.' } } })
        }
      }
    })

  }, [])

  const handleBackButton = () => {
    navigate('/dashboard');
  }

  const handleOnSubmit = async () => {
    axios({
      method: 'PATCH',
      url: `/api/edit/${id}`,
      data: {
        'suffix': suffix,
        'target': target
      }
    }).then((res) => {
      navigate("/dashboard", { state: { type: 'alert', alert: { className: 'success-alert', info: 'Shortener Edited.', detail: 'You can now use the updated shortener.' } } })
    }).catch((err) => {
      if (err.response) {
        if (err.response.status === 400) {
          return navigate(`/edit/${id}`, { state: { type: 'alert', target: 'edit-shortener-page', alert: { className: 'danger-alert', info: 'Cannot edit shortener.', detail: 'Please make sure your suffix and target fields are valid.' } } })
        } else if (err.response.status === 409) {
          return navigate(`/edit/${id}`, { state: { type: 'alert', target: 'edit-shortener-page', alert: { className: 'danger-alert', info: 'Cannot edit shortener.', detail: 'The suffix is already used by another shortener.' } } })
        } else if (err.response.status === 403) {
          return navigate('/dashboard', { state: { type: 'alert', alert: { className: 'danger-alert', info: 'Cannot edit shortener.', detail: 'It is not your shortener.' } } })
        }
      }

    })
  }

  return (
    <div className="shortener-form-container">
      <div className="header">
        <button className="back-button" onClick={handleBackButton}><BackIcon /></button>
        <div className="shortener-form-title">Edit shortener</div>
      </div>
      {(state?.target === 'edit-shortener-page') ? <Alert {...state?.alert} /> : null}
      <Form onSubmit={handleOnSubmit} className="shortener-form">
        <TextInput value={suffix} onChange={setSuffix} label="Suffix:" small="Suffix can contain all alphanumerics and a dash as well as an underscore. Keep in mind that suffix is case sensitive." placeholder={"e.g: google"}></TextInput>
        <TextInput value={target} onChange={setTarget} label="Target:" small="Target must be a valid web URL. If no schema is given, defaults to https." placeholder={"e.g: www.google.com"}></TextInput>
        <SubmitButton>Edit</SubmitButton>
      </Form>
    </div>
  )
}

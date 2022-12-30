import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Alert from "../../components/Alert";
import { Form, SubmitButton, TextInput } from "../../components/Form";
import { BackIcon } from "../../components/Icon";
import { AuthContext } from "../../context/AuthContext";
import './ShortenerForm.css'


export default function CreateShortener({ }) {
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
  }, [])

  const handleBackButton = () => {
    navigate('/dashboard');
  }

  const handleOnSubmit = async () => {
    axios({
      method: 'POST',
      url: '/api/create',
      data: {
        'suffix': suffix,
        'target': target
      }
    }).then((res) => {
      navigate("/dashboard", { state: { type: 'alert', alert: { className: 'success-alert', info: 'Shortener Created!', detail: 'You can now use the shortener.' } } })
    }).catch((err) => {
      if (err.response) {
        if (err.response.status === 400) {
          return navigate("/create", { state: { type: 'alert', target: 'create-shortener-page', alert: { className: 'danger-alert', info: 'Cannot create shortener.', detail: 'Please make sure your suffix and target fields are valid.' } } })
        } else if (err.response.status === 409) {
          return navigate("/create", { state: { type: 'alert', target: 'create-shortener-page', alert: { className: 'danger-alert', info: 'Cannot create shortener.', detail: 'The suffix is already used by another shortener.' } } })
        }
      }
    })
  }

  return (
    <div className="shortener-form-container">
      <div className="header">
        <button className="back-button" onClick={handleBackButton}><BackIcon /></button>
        <div className="shortener-form-title">Create shortener</div>
      </div>
      {(state?.target === 'create-shortener-page') ? <Alert {...state?.alert} /> : null}
      <Form onSubmit={handleOnSubmit} className="shortener-form">
      <TextInput value={suffix} onChange={setSuffix} label="Suffix:" small="Suffix can contain all alphanumerics and a dash as well as an underscore. Keep in mind that suffix is case sensitive." placeholder={"e.g: google"}></TextInput>
        <TextInput value={target} onChange={setTarget} label="Target:" small="Target must be a valid web URL. If no schema is given, defaults to https." placeholder={"e.g: www.google.com"}></TextInput>
        <SubmitButton>Create</SubmitButton>
      </Form>
    </div>
  )
}

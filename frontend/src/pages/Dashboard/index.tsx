import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShortenerInfoCard } from "./components/Card";
import { PlusIcon } from "../../components/Icon";
import { AuthContext } from "../../context/AuthContext";
import './index.css'
import DeleteShortenerModal from "./components/DeleteShortenerModal";


export default function Dashboard({ }) {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [shorteners, setShorteners] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [targetId, setTargetId] = useState(-1);

  useEffect(() => {
    if (!(auth.authenticated)) {
      navigate("/login", { state: { type: 'alert', alert: {className:'warning-alert', info:'Forbidden!' , detail:'Please login before accessing page.'}} })
      return
    }

    let canceler: any;
    axios({
      method: 'GET',
      url: '/api/dash',
      cancelToken: new axios.CancelToken(c => canceler = c)
    })
      .then((res) => { setShorteners(res.data.shorteners) })
      .catch((e) => { if (axios.isCancel(e)) return; console.log(e) })
    return () => canceler()
  }, [])

  const handleAddShortener = () => {
    navigate("/create")
  }

  const handleDelete = (id:number) => {
    setTargetId(id);
    setDeleteModalVisible(true);
  }

  const handleEdit = (id:number) => {
    navigate(`/edit/${id}`)
  }

  const onDeleteHandler = () => {
    setShorteners((prevShorteners)=>prevShorteners.filter((shortener:any)=>shortener.id!==targetId))
  }

  return (
    <div className="dashboard-container">
      <div className="header">
        <div className="dashboard-title">Your Shorteners:</div>
        <button className="add-shortener" onClick={(e) => handleAddShortener()}><PlusIcon /></button>
      </div>
      <br />
      {
        (shorteners.length) ?
          (<div className="shorteners">
            {shorteners.map(({ id, suffix, target, hits }) => <ShortenerInfoCard key={id} id={id} suffix={suffix} target={target} hits={hits} onDelete={handleDelete} onEdit={handleEdit}/>)}
          </div>)
          :
          (<div className="shorteners empty">You have no shorteners...<br />Start by creating one!</div>)
      }
      {(!deleteModalVisible) || <DeleteShortenerModal targetId={targetId} visible={deleteModalVisible} onClose={()=>setDeleteModalVisible(false)} onDelete={()=>onDeleteHandler()}/>}
    </div>
  )
}

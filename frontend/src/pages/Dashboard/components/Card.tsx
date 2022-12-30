import { QRCodeCanvas } from 'qrcode.react';
import './Card.css'
import { Card } from '../../../components/Card';
import { Link } from '../../../components/Navigation'
import { LinkIcon, CopyIcon, MinusIcon, EditIcon, QRIcon } from '../../../components/Icon'


export const ShortenerInfoCard = ({ id, suffix, target, hits, noActions=false, onDelete=()=>{}, onEdit=()=>{} }: { id: number, suffix: string, target: string, hits: number, noActions?: boolean, onDelete?: Function, onEdit?: Function }) => {
  const relUrl = `/s/${suffix}`
  const url = `${window.location.hostname}${relUrl}`

  const copyQR = () => {
    const canvas: any = document.getElementById(`qr-${id}`);
    if (!(canvas)) return;
    canvas.toBlob((blob: Blob) => {
      const item = new ClipboardItem({ "image/png": blob });
      try {
        navigator.clipboard.write([item]);
      } catch (exc) { }
    })
  }

  const deleteShortener = () => { onDelete(id) }

  const editShortener = () => { onEdit(id) }

  return (
    <Card className="shortener-info-card">
      <div className="image-container">
        <QRCodeCanvas id={`qr-${id}`} className="qr-code" value={url} /> {/*Using canvas instead of svg to be copyable.*/}
      </div>
      <div>
        <div className="title suffix">{relUrl}</div>
        <p className="target">Target: {target}</p>
        <p className="hits">Hits: {hits}</p>
      </div>
      {(noActions) ||
      <div className="actions">
        <button onClick={deleteShortener}><MinusIcon tooltip="Delete" /></button>
        <button onClick={editShortener}><EditIcon tooltip="Edit" /></button>
        <a href={relUrl}><LinkIcon tooltip="Go to link" /></a>
        <button onClick={copyQR}><QRIcon tooltip="Copy QR" /></button>
      </div>
      }
    </Card>
  )
}

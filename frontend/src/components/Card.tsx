import { QRCodeCanvas } from 'qrcode.react';
import './Card.css'
import { Link } from './Navigation'
import { LinkIcon, CopyIcon, MinusIcon, EditIcon } from './Icon'


export const Card = ({ className = '', children }: { className?: string, children: any }) => {
  return (
    <div className={`card ${className}`}>
      {children}
    </div>
  )
}

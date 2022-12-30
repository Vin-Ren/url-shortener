import './Icon.css';
import moon from '../assets/icons/moon.svg';
import sun from '../assets/icons/sun.svg';
import user from '../assets/icons/user.svg';
import link from '../assets/icons/link.svg';
import copy from '../assets/icons/copy.svg';
import plus from '../assets/icons/plus.svg';
import minus from '../assets/icons/minus.svg';
import trash from '../assets/icons/trash.svg';
import edit from '../assets/icons/edit.svg';
import _exit from '../assets/icons/exit.svg';
import xMark from '../assets/icons/x-mark.svg';
import back from '../assets/icons/back.svg';
import qr from '../assets/icons/qr.svg';


export default function Icon({ className = '', src, tooltip }: { className?: string, src: any, tooltip?: string }) {
  if (!(tooltip)) return (<i><img className={`icon ${className}`} src={src} /></i>)
  else return (<i className={`icon ${className}`}><img className={``} src={src} /><span className={`tooltip scale-0`}>{tooltip}</span></i>)
}

export const MoonIcon = (props: any) => {
  return <Icon className="moon-icon" src={moon} {...props} />
}

export const SunIcon = (props: any) => {
  return <Icon className="sun-icon" src={sun} {...props} />
}

export const UserIcon = (props: any) => {
  return <Icon className="user-icon" src={user} {...props} />
}

export const LinkIcon = (props: any) => {
  return <Icon className="link-icon" src={link} {...props} />
}

export const CopyIcon = (props: any) => {
  return <Icon className="copy-icon" src={copy} {...props} />
}

export const PlusIcon = (props: any) => {
  return <Icon className="plus-icon" src={plus} {...props} />
}

export const MinusIcon = (props: any) => {
  return <Icon className="minus-icon" src={minus} {...props} />
}

export const TrashIcon = (props: any) => {
  return <Icon className="trash-icon" src={trash} {...props} />
}

export const EditIcon = (props: any) => {
  return <Icon className="edit-icon" src={edit} {...props} />
}

export const ExitIcon = (props: any) => {
  return <Icon className="exit-icon" src={_exit} {...props} />
}

export const XMarkIcon = (props: any) => {
  return <Icon className="x-mark-icon" src={xMark} {...props} />
}

export const BackIcon = (props: any) => {
  return <Icon className="back-icon" src={back} {...props} />
}

export const QRIcon = (props: any) => {
  return <Icon className="qr-icon" src={qr} {...props} />
}
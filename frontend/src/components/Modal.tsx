import { useState } from 'react'
import './Modal.css'

export default function ModalWrapper({ className = '', children, ...props }: { className?: string, children: any }) {
  return (
    <div className="backdrop">
      <div className={`modal-container ${className}`} {...props}>
        {children}
      </div>
    </div>)
}


export const DefaultModal = ({ className, children, ...props }: { className?: string, children: any }) => {
  return <ModalWrapper className={`default-modal-container ${className}`} {...props}>{children}</ModalWrapper>
}


export const SelfManagedModal = ({ open_text, close_text, children, ...props }: { open_text: string, close_text: string, children: any }) => {
  const [visible, setVisible] = useState(false);
  const toggleVisibility = () => { setVisible((visible) => !visible) }

  return (
    <div className='self-managed-modal'>
      <button className="open-button" onClick={toggleVisibility}>{open_text}</button>
      {!visible ||
        <ModalWrapper {...props}>
          {children}
          <button className="close-button" onClick={toggleVisibility}>{close_text}</button>
        </ModalWrapper>}
    </div>
  )
}

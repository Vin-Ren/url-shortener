import './Alert.css'

export default function Alert({ className = '', info, detail }: { className?: string, info: string, detail: string }) {
  // https://flowbite.com/docs/components/alerts/
  return (
    <div className={`alert ${className}`} role="alert">
      <span>{info}</span> {detail}
    </div>
  )
}


export const InfoAlert = (props: any) => {
  return <Alert className='info-alert' {...props} />
}

export const DangerAlert = (props: any) => {
  return <Alert className='danger-alert' {...props} />
}

export const SuccessAlert = (props: any) => {
  return <Alert className='success-alert' {...props} />
}

export const WarningAlert = (props: any) => {
  return <Alert className='warning-alert' {...props} />
}
import './Form.css'


export const Form = ({ onSubmit, className = '', children, ...props }: { onSubmit: Function, className?: string, children: any }) => {
  return (<form onSubmit={(e) => { e.preventDefault(); onSubmit(e) }} {...props}>
    <div className={`form ${className}`}>
      {children}
    </div>
  </form>)
}

export const Input = ({ className='', type, value, onChange, label, small, ...props }: { className?:string, type: string, value: any, onChange: Function, label?: string, small?: string}) => {
  if (!(label)) return (<input className={className} type={type} value={value} onChange={(e) => { onChange(e.target.value) }} {...props}></input>)
  else return (
  <div className={`input-group ${className}`}>
    {(!label) || <label>{label}</label>}
    <input type={type} value={value} onChange={(e) => { onChange(e.target.value) }} {...props}></input>
    {(!small) || <small>{small}</small>}
  </div>)
}

export const TextInput = (props: any) => {
  return <Input type='text' {...props} />
}

export const EmailInput = (props: any) => {
  return <Input type='email' autoComplete='email' {...props} />
}

export const PasswordInput = (props: any) => {
  return <Input type='password' autoComplete='current-password' {...props} />
}

export const NewPasswordInput = (props: any) => {
  return <Input type='password' autoComplete='new-password' {...props} />
}

export const SubmitButton = ({ className = '', children="Submit", ...props }: { className?: string, children?: any }) => {
  return <button className={`submit-button ${className}`} type='submit' {...props}>{children}</button>
}

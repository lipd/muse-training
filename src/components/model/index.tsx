import { FC } from 'react'
import ReactDOM from 'react-dom'
import './style/model.scss'

interface ModelElementProps {
  setDisplay: (display: boolean) => void
}
const ModelElement: FC<ModelElementProps> = ({ children, setDisplay }) => {
  return (
    <div
      className="model-container"
      onClick={() => {
        setDisplay(false)
      }}
    >
      <div className="model">{children}</div>
    </div>
  )
}

export const Model: FC<ModelElementProps> = ({ children, setDisplay }) => {
  const modelDom = document.querySelector('#model') as HTMLElement
  return ReactDOM.createPortal(<ModelElement children={children} setDisplay={setDisplay} />, modelDom)
}

import { useEffect } from 'react'

interface IUseKeyBoard {
  handleKeyDown: (e: KeyboardEvent) => void
  handleKeyUp: (e: KeyboardEvent) => void
}
export const useKeyBoard = ({ handleKeyDown, handleKeyUp }: IUseKeyBoard) => {
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])
}

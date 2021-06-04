import { useEffect } from 'react'

export const useMount = (cb: any) => {
  useEffect(() => {
    cb()
  }, [])
}

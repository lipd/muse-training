import { Board } from '@components/board'
import { KEYS } from '@components/piano/key-data'
import { pitch2Note } from '@utils/note'
import { useEffect, useLayoutEffect, useState } from 'react'
import { ReadingPiano } from './reading-piano'
import './style/reading.scss'

const getRandomNote = () => {
  const randomIndex = Math.floor(Math.random() * KEYS.length)
  const key = KEYS[randomIndex]
  return pitch2Note(key.pitch)
}

export const Reading = () => {
  const [userNotes, setUserNotes] = useState<Set<string>>(() => new Set())
  const [comNote, setComNote] = useState<string>(getRandomNote)
  const [correctNotes, setCorrectNotes] = useState<string[]>([])
  const [wrongNotes, setWrongNotes] = useState<string[]>([])

  useEffect(() => {
    // 只要第一个输入
    if (userNotes.size > 1) return
    if (userNotes.size === 0) {
      // 生成新的 comNote
      setComNote(getRandomNote())
    } else if (userNotes.size === 1) {
      const inputNote = [...userNotes][0]
      if (inputNote === comNote) {
        setCorrectNotes([inputNote])
        setWrongNotes([])
        setComNote('')
      } else {
        setCorrectNotes([comNote])
        setWrongNotes([inputNote])
        setComNote('')
      }
    }
  }, [userNotes])

  return (
    <div className="reading-container">
      <div className="playground">
        <Board normalNotes={comNote ? [comNote] : []} correctNotes={correctNotes} wrongNotes={wrongNotes} />
        <ReadingPiano setNotes={setUserNotes} />
      </div>
    </div>
  )
}

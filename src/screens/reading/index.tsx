import { Board } from '@components/board'
import { Chord } from '@components/chord'
import { Piano } from '@components/piano'
import { useState } from 'react'
import './style/reading.scss'

export const Reading = () => {
  const [notes, setNotes] = useState<Set<string>>(() => new Set())
  return (
    <div className="reading-container">
      <div className="playground">
        <Board notes={notes} />
        <Chord notes={notes} />
        <Piano setNotes={setNotes} />
      </div>
    </div>
  )
}

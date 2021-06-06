import { Board } from '@components/board'
import { Chord } from '@components/chord'
import { PlaygroundPiano } from '@screens/playground/playground-piano'
import { useState } from 'react'
import './style/playground.scss'

export const Playground = () => {
  const [notes, setNotes] = useState<Set<string>>(() => new Set())
  return (
    <div className="reading-container">
      <div className="playground">
        <Board notes={notes} />
        <Chord notes={notes} />
        <PlaygroundPiano setNotes={setNotes} />
      </div>
    </div>
  )
}

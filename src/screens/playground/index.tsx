import { Board } from '@components/board'
import { Chord } from '@components/chord'
import { useState } from 'react'
import { PlaygroundPiano } from './playground-piano'
import './style/playground.scss'

export const Playground = () => {
  const [notes, setNotes] = useState<Set<string>>(() => new Set())
  return (
    <div className="reading-container">
      <div className="playground">
        <Board normalNotes={[...notes]} />
        <Chord notes={notes} />
        <PlaygroundPiano setNotes={setNotes} />
      </div>
    </div>
  )
}

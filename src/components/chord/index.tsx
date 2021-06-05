import { getStructure, noteSorter } from '@utils/note'
import { detect } from '@tonaljs/chord-detect'
import { useMemo } from 'react'
import './style/chord.scss'

interface ChordProps {
  notes: Set<string>
}
export const Chord = ({ notes }: ChordProps) => {
  const names = [...notes].sort(noteSorter).map((note) => {
    const [letter, acc] = getStructure(note).slice(1) as [string, string]
    return letter + acc
  })

  const chord = useMemo(() => detect(names), [notes])

  return (
    <div className="chord-container">
      <h1 className="chord-name">
        {names} {chord}
      </h1>
    </div>
  )
}

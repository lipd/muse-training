import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import './style/piano.scss'
import { Synth } from 'tone'
import classNames from 'classnames'
import { KEYS, KEYType, KEY_MAP } from './key-data'

export interface KEYState extends KEYType {
  active: boolean
}

export enum ActionKind {
  Activate = 'ACTIVATE',
  Deactivate = 'DEACTIVATE',
}

export interface Action {
  type: ActionKind
  pitch: string
}

interface KeysCache {
  [p: string]: boolean
}

const getNotes = (cache: KeysCache) => {
  const notes: string[] = []
  const keys = Object.keys(cache)

  for (const key of keys) {
    const alphabet = KEY_MAP[key]
    if (alphabet) notes.push(`${alphabet.pitch}/${alphabet.octave}`)
  }

  return new Set(notes)
}

const reducer = (state: KEYState[], action: Action) => {
  switch (action.type) {
    case ActionKind.Activate:
      return state.map((key) => {
        if (key.pitch !== action.pitch) return key
        return { ...key, active: true }
      })
    case ActionKind.Deactivate:
      return state.map((key) => {
        if (key.pitch !== action.pitch) return key
        return { ...key, active: false }
      })
    default:
      return state
  }
}

const initialState = KEYS.map((key) => ({
  ...key,
  active: false,
}))

interface PianoProps {
  setNotes: (state: Set<string>) => void
}
export const Piano = ({ setNotes }: PianoProps) => {
  const synth = useMemo(() => new Synth().toDestination(), [])
  const [pianoState, dispatch] = useReducer(reducer, initialState)
  const activeKeysRef = useRef<KeysCache>({})

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (activeKeysRef.current[e.key]) return
    activeKeysRef.current[e.key] = true
    setNotes(getNotes(activeKeysRef.current))
    const keyState = pianoState.find((each) => each.key === e.key)
    if (keyState) {
      const { pitch } = keyState
      synth.triggerAttackRelease(pitch, '8n')
      dispatch({ type: ActionKind.Activate, pitch })
    }
  }, [])

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    delete activeKeysRef.current[e.key]
    setNotes(getNotes(activeKeysRef.current))
    const keyState = pianoState.find((each) => each.key === e.key)
    if (keyState) {
      const { pitch } = keyState
      dispatch({ type: ActionKind.Deactivate, pitch })
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  const handlePianoKeyDown = (pitch: string) => {
    synth.triggerAttackRelease(pitch, '8n')
    dispatch({ type: ActionKind.Activate, pitch })
  }

  const handlePianoKeyUp = (pitch: string) => {
    dispatch({ type: ActionKind.Deactivate, pitch })
  }

  return (
    <div className="piano-container">
      {pianoState.map((key) => (
        <div
          key={key.pitch}
          className={classNames({ 'black-key': key.blackKey, 'white-key': !key.blackKey, active: key.active })}
          onMouseDown={() => handlePianoKeyDown(key.pitch)}
          onMouseUp={() => handlePianoKeyUp(key.pitch)}
          onMouseLeave={() => handlePianoKeyUp(key.pitch)}
          onDragStart={(e) => e.preventDefault()}
        />
      ))}
    </div>
  )
}

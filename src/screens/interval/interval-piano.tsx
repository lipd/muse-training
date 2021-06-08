import { useCallback, useEffect, useReducer, useRef } from 'react'
import { Synth, SynthOptions } from 'tone'
import { useKeyBoard } from '@hooks/use-keyboard'
import { Piano } from '@components/piano'
import { KEYS, KEYType, KEY_MAP } from '@components/piano/key-data'
import WebMidi, { InputEventNoteoff, InputEventNoteon } from 'webmidi'
import { key2Pitch, pitch2Note } from '@utils/note'

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

interface PitchCache {
  [p: string]: boolean
}

const getNotes = (pitchCache: PitchCache) => {
  const notes: string[] = []
  const pitches = Object.keys(pitchCache)

  for (const pitch of pitches) {
    const note = pitch2Note(pitch)
    notes.push(note)
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
  setNotes: React.Dispatch<React.SetStateAction<Set<string>>>
  synth: Synth<SynthOptions>
}
export const IntervalPiano = ({ setNotes, synth }: PianoProps) => {
  const [pianoState, dispatch] = useReducer(reducer, initialState)
  const pitchCacheRef = useRef<PitchCache>({})

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!KEY_MAP[e.key]) return
    const pitchCache = pitchCacheRef.current
    const pitch = key2Pitch(e.key)
    if (pitchCache[pitch] || Object.keys(pitchCache).length > 0) return
    pitchCache[pitch] = true
    setNotes(getNotes(pitchCache))
    synth.triggerAttackRelease(pitch, '8n')
    dispatch({ type: ActionKind.Activate, pitch })
  }, [])

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (!KEY_MAP[e.key]) return
    const pitchCache = pitchCacheRef.current
    const pitch = key2Pitch(e.key)
    if (!pitchCache[pitch]) return
    delete pitchCache[pitch]
    setNotes(getNotes(pitchCacheRef.current))
    dispatch({ type: ActionKind.Deactivate, pitch })
  }, [])

  useKeyBoard({ handleKeyDown, handleKeyUp })

  useEffect(() => {
    return () => {
      WebMidi.disable()
    }
  }, [])

  const handleNoteon = (e: InputEventNoteon) => {
    const pitchCache = pitchCacheRef.current
    const pitch = `${e.note.name}${e.note.octave}`
    const note = pitch2Note(pitch)
    if (pitchCache[pitch] || Object.keys(pitchCache).length > 0) return
    pitchCache[pitch] = true
    setNotes((prev) => {
      const next = new Set(prev)
      next.add(note)
      return next
    })
    dispatch({ type: ActionKind.Activate, pitch })
  }

  const handleNoteoff = (e: InputEventNoteoff) => {
    const pitchCache = pitchCacheRef.current
    const pitch = `${e.note.name}${e.note.octave}`
    const note = pitch2Note(pitch)
    if (!pitchCache[pitch]) return
    delete pitchCache[pitch]
    setNotes((prev) => {
      const next = new Set(prev)
      next.delete(note)
      return next
    })
    dispatch({ type: ActionKind.Deactivate, pitch })
  }

  const handleConnectMidi = () => {
    WebMidi.enable(() => {
      const input = WebMidi.inputs[0]
      input.addListener('noteon', 'all', handleNoteon)
      input.addListener('noteoff', 'all', handleNoteoff)
    })
  }

  const handleDisconnectMidi = () => {
    WebMidi.disable()
  }

  const handlePianoKeyDown = (pitch: string) => {
    const pitchCache = pitchCacheRef.current
    if (pitchCache[pitch] || Object.keys(pitchCache).length > 0) return
    pitchCache[pitch] = true
    synth.triggerAttackRelease(pitch, '8n')
    dispatch({ type: ActionKind.Activate, pitch })
    setNotes((prev) => {
      const next = new Set(prev)
      next.add(pitch2Note(pitch))
      return next
    })
  }

  const handlePianoKeyUp = (pitch: string) => {
    const pitchCache = pitchCacheRef.current
    delete pitchCache[pitch]
    dispatch({ type: ActionKind.Deactivate, pitch })
    setNotes((prev) => {
      const note = pitch2Note(pitch)
      if (!prev.has(note)) return prev
      const next = new Set(prev)
      next.delete(note)
      return next
    })
  }

  return (
    <Piano
      pianoState={pianoState}
      handlePianoKeyDown={handlePianoKeyDown}
      handlePianoKeyUp={handlePianoKeyUp}
      handleConnectMidi={handleConnectMidi}
      handleDisconnectMidi={handleDisconnectMidi}
    />
  )
}

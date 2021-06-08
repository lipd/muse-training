import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { Synth } from 'tone'
import { useKeyBoard } from '@hooks/use-keyboard'
import { Piano } from '@components/piano'
import { KEYS, KEYType, KEY_MAP } from '@components/piano/key-data'
import { pitch2Note } from '@utils/note'
import WebMidi, { InputEventNoteoff, InputEventNoteon } from 'webmidi'

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
  setNotes: React.Dispatch<React.SetStateAction<Set<string>>>
}
export const PlaygroundPiano = ({ setNotes }: PianoProps) => {
  const synth = useMemo(() => new Synth().toDestination(), [])
  const [pianoState, dispatch] = useReducer(reducer, initialState)
  const activeKeysRef = useRef<KeysCache>({})
  const [midiConnected, setMidiConnected] = useState(false)

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

  useKeyBoard({ handleKeyDown, handleKeyUp })

  useEffect(() => {
    return () => {
      WebMidi.disable()
      setMidiConnected(false)
    }
  }, [])

  const handleNoteon = (e: InputEventNoteon) => {
    const pitch = `${e.note.name}${e.note.octave}`
    const note = pitch2Note(pitch)
    setNotes((prev) => {
      const next = new Set(prev)
      next.add(note)
      return next
    })
    synth.triggerAttackRelease(pitch, '8n')
    dispatch({ type: ActionKind.Activate, pitch })
  }

  const handleNoteoff = (e: InputEventNoteoff) => {
    const pitch = `${e.note.name}${e.note.octave}`
    const note = pitch2Note(pitch)
    setNotes((prev) => {
      const next = new Set(prev)
      next.delete(note)
      return next
    })
    dispatch({ type: ActionKind.Deactivate, pitch })
  }

  const handleConnectMidi = () => {
    if (!navigator.requestMIDIAccess) {
      alert('当前浏览器不支持 MIDI 连接，请使用 Chrome 等支持 Web MIDI 的浏览器')
      return
    }
    WebMidi.enable(() => {
      if (WebMidi.inputs.length === 0) {
        alert('没有找到可连接的 MIDI 设备，请检查 MIDI 设备是否正确连接')
        return
      }
      const input = WebMidi.inputs[0]
      input.addListener('noteon', 'all', handleNoteon)
      input.addListener('noteoff', 'all', handleNoteoff)
      setMidiConnected(true)
    })
  }

  const handleDisconnectMidi = () => {
    WebMidi.disable()
    setMidiConnected(false)
  }

  const handlePianoKeyDown = (pitch: string) => {
    synth.triggerAttackRelease(pitch, '8n')
    dispatch({ type: ActionKind.Activate, pitch })
    setNotes((prev) => {
      const next = new Set(prev)
      next.add(pitch2Note(pitch))
      return next
    })
  }

  const handlePianoKeyUp = (pitch: string) => {
    dispatch({ type: ActionKind.Deactivate, pitch })
    setNotes((prev) => {
      const next = new Set(prev)
      next.delete(pitch2Note(pitch))
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
      midiConnected={midiConnected}
      instruction="自由练习：你可以通过鼠标、键盘和 MIDI 设备输入音符，系统会将输入显示在五线谱和虚拟键盘上，并显示你输入的和弦性质。"
    />
  )
}

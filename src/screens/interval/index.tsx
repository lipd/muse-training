import { Board } from '@components/board'
import { KEYS, KEYType } from '@components/piano/key-data'
import { pitch2Note } from '@utils/note'
import { useEffect, useMemo, useReducer, useState } from 'react'
import produce from 'immer'
import * as Tone from 'tone'
import { Display } from './display'
import { IntervalPiano } from './interval-piano'
import './style/interval.scss'

const getRandomDirction = (baseIndex: number, distance: number) => {
  let direction = Math.random() >= 0.5 ? -1 : 1
  direction = KEYS[baseIndex + direction * distance] ? direction : direction * -1
  return direction
}

const getRandomInterval = () => {
  const baseIndex = Math.floor(Math.random() * KEYS.length)
  const baseKey = KEYS[baseIndex]
  const distance = Math.floor(Math.random() * 12 + 1)
  const direction = getRandomDirction(baseIndex, distance)
  const targetIndex = baseIndex + distance * direction
  const targetKey = KEYS[targetIndex]
  return { baseKey, targetKey, distance, direction }
}

export interface Recorder {
  amount: {
    correct: number
    wrong: number
  }
  dict: { [p: number]: { correct: number; wrong: number } }
}

export enum ActionType {
  WRONG,
  CORRECT,
  RESET,
}

export interface Action {
  type: ActionType
  mode: number
}

const initalRecorder: Recorder = {
  amount: {
    correct: 0,
    wrong: 0,
  },
  dict: {},
}

const reducer = (state: Recorder, action: Action) => {
  switch (action.type) {
    case ActionType.CORRECT: {
      return produce(state, (draftState) => {
        draftState.amount.correct += 1
        if (state.dict[action.mode]) {
          draftState.dict[action.mode].correct += 1
        } else {
          draftState.dict[action.mode] = { correct: 1, wrong: 0 }
        }
      })
    }

    case ActionType.WRONG: {
      return produce(state, (draftState) => {
        draftState.amount.wrong += 1
        if (state.dict[action.mode]) {
          draftState.dict[action.mode].wrong += 1
        } else {
          draftState.dict[action.mode] = { correct: 0, wrong: 1 }
        }
      })
    }

    case ActionType.RESET: {
      return { ...initalRecorder }
    }

    default:
      return state
  }
}

export interface ComInterval {
  baseKey: KEYType
  targetKey: KEYType
  distance: number
  direction: number
}

export const Interval = () => {
  const synth = useMemo(() => new Tone.Synth().toDestination(), [])
  const [userNotes, setUserNotes] = useState<Set<string>>(() => new Set())
  // 没必要在这里生成随机音程，这里纯粹为了占位
  const [comInterval, setComInterval] = useState<ComInterval>(getRandomInterval())
  const [normalNotes, setNormalNotes] = useState<string[]>([])
  const [correctNotes, setCorrectNotes] = useState<string[]>([])
  const [wrongNotes, setWrongNotes] = useState<string[]>([])
  const [recorder, dispatch] = useReducer(reducer, initalRecorder)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (!started) return
    if (userNotes.size > 1) return
    if (userNotes.size === 0) {
      // 生成新的 comNote
      const interval = getRandomInterval()
      setComInterval(interval)
      const { baseKey, targetKey } = interval
      const baseNote = pitch2Note(baseKey.pitch)
      setNormalNotes([baseNote])
      // 播放
      const now = Tone.now()
      synth.triggerAttackRelease(baseKey.pitch, '8n', now + 1.5)
      synth.triggerAttackRelease(targetKey.pitch, '8n', now + 2)
    } else if (userNotes.size === 1) {
      const inputNote = [...userNotes][0]
      const targetNote = pitch2Note(comInterval.targetKey.pitch)
      const mode = comInterval.distance * comInterval.direction
      if (inputNote === targetNote) {
        // 输入正确答案
        setCorrectNotes([inputNote])
        setWrongNotes([])
        setNormalNotes([])
        dispatch({ type: ActionType.CORRECT, mode })
      } else {
        // 输入错误答案
        setCorrectNotes([targetNote])
        setWrongNotes([inputNote])
        setNormalNotes([])
        dispatch({ type: ActionType.WRONG, mode })
      }
    }
  }, [userNotes, started])

  return (
    <div className="interval-container">
      <div className="interval">
        <Board normalNotes={normalNotes} correctNotes={correctNotes} wrongNotes={wrongNotes} />
        <Display
          recorder={recorder}
          started={started}
          dispatch={dispatch}
          setStarted={setStarted}
          synth={synth}
          comInterval={comInterval}
        />
        <IntervalPiano synth={synth} setNotes={setUserNotes} />
      </div>
    </div>
  )
}

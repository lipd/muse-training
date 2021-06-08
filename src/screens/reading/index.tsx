import { Board } from '@components/board'
import { KEYS } from '@components/piano/key-data'
import { pitch2Note } from '@utils/note'
import { useEffect, useReducer, useState } from 'react'
import produce from 'immer'
import { Display } from './display'
import { ReadingPiano } from './reading-piano'
import './style/reading.scss'

const getRandomNote = () => {
  const randomIndex = Math.floor(Math.random() * KEYS.length)
  const key = KEYS[randomIndex]
  return pitch2Note(key.pitch)
}

export interface Recorder {
  amount: {
    correct: number
    wrong: number
  }
  dict: { [p: string]: { correct: number; wrong: number } }
}

export enum ActionType {
  WRONG,
  CORRECT,
  RESET,
}

export interface Action {
  type: ActionType
  pitch: string
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
        if (state.dict[action.pitch]) {
          draftState.dict[action.pitch].correct += 1
        } else {
          draftState.dict[action.pitch] = { correct: 1, wrong: 0 }
        }
      })
    }

    case ActionType.WRONG: {
      return produce(state, (draftState) => {
        draftState.amount.wrong += 1
        if (state.dict[action.pitch]) {
          draftState.dict[action.pitch].wrong += 1
        } else {
          draftState.dict[action.pitch] = { correct: 0, wrong: 1 }
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

export const Reading = () => {
  const [userNotes, setUserNotes] = useState<Set<string>>(() => new Set())
  const [comNote, setComNote] = useState<string>(getRandomNote)
  const [correctNotes, setCorrectNotes] = useState<string[]>([])
  const [wrongNotes, setWrongNotes] = useState<string[]>([])
  const [recorder, dispatch] = useReducer(reducer, initalRecorder)

  useEffect(() => {
    // 只要第一个输入
    if (userNotes.size > 1) return
    if (userNotes.size === 0) {
      // 生成新的 comNote
      setComNote(getRandomNote())
    } else if (userNotes.size === 1) {
      const inputNote = [...userNotes][0]
      if (inputNote === comNote) {
        // 输入正确答案
        setCorrectNotes([inputNote])
        setWrongNotes([])
        setComNote('')
        dispatch({ type: ActionType.CORRECT, pitch: comNote })
      } else {
        // 输入错误答案
        setCorrectNotes([comNote])
        setWrongNotes([inputNote])
        setComNote('')
        dispatch({ type: ActionType.WRONG, pitch: comNote })
      }
    }
  }, [userNotes])

  return (
    <div className="reading-container">
      <div className="reading">
        <Board normalNotes={comNote ? [comNote] : []} correctNotes={correctNotes} wrongNotes={wrongNotes} />
        <Display recorder={recorder} dispatch={dispatch} />
        <ReadingPiano setNotes={setUserNotes} />
      </div>
    </div>
  )
}

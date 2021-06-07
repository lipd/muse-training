import { Model } from '@components/model'
import { useState } from 'react'
import * as Tone from 'tone'
import { Report } from './report'
import { Action, ActionType, ComInterval, Recorder } from '.'
import './style/display.scss'

interface DisplayProps {
  recorder: Recorder
  started: boolean
  dispatch: React.Dispatch<Action>
  setStarted: (value: boolean) => void
  synth: Tone.Synth<Tone.SynthOptions>
  comInterval: ComInterval
}
export const Display = ({ recorder, started, dispatch, setStarted, synth, comInterval }: DisplayProps) => {
  const [display, setDisplay] = useState(false)
  const { correct, wrong } = recorder.amount
  const amount = correct + wrong
  const accuracy = amount ? Math.floor((correct / (correct + wrong)) * 100) : '--'

  const handleReset = () => {
    dispatch({ type: ActionType.RESET, mode: 0 })
  }

  const handleReplay = () => {
    const now = Tone.now()
    const { baseKey, targetKey } = comInterval
    synth.triggerAttackRelease(baseKey.pitch, '8n', now + 1.5)
    synth.triggerAttackRelease(targetKey.pitch, '8n', now + 2)
  }

  return (
    <div className="display-container">
      <h1 className="accuracy">正确率： {accuracy} %</h1>
      {!started ? (
        <div className="button start-button" onClick={() => setStarted(true)}>
          开始
        </div>
      ) : (
        <div className="button replay-button" onClick={handleReplay}>
          重播
        </div>
      )}
      <div className="button report-button" onClick={() => setDisplay(true)}>
        练习统计
      </div>
      <div className="button reset-button" onClick={handleReset}>
        重置
      </div>
      {display && (
        <Model setDisplay={setDisplay}>
          <Report recorder={recorder} />
        </Model>
      )}
    </div>
  )
}

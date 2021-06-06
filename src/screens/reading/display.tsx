import { Model } from '@components/model'
import { useState } from 'react'
import { Report } from './report'
import { Action, ActionType, Recorder } from '.'
import './style/display.scss'

interface DisplayProps {
  recorder: Recorder
  dispatch: React.Dispatch<Action>
}
export const Display = ({ recorder, dispatch }: DisplayProps) => {
  const [display, setDisplay] = useState(false)
  const { correct, wrong } = recorder.amount
  const amount = correct + wrong
  const accuracy = amount ? Math.floor((correct / (correct + wrong)) * 100) : '--'

  const handleReset = () => {
    dispatch({ type: ActionType.RESET, pitch: '' })
  }

  return (
    <div className="display-container">
      <h1 className="accuracy">正确率： {accuracy} %</h1>
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

import { getStructure } from '@utils/note'
import { Recorder } from '.'
import './style/report.scss'

export const Report = ({ recorder }: { recorder: Recorder }) => {
  return (
    <div className="report-container">
      <h1 className="report-title">不同键位的练习数据</h1>
      <div className="tag-group">
        {Object.keys(recorder.dict).map((pitch) => {
          const [octave, letter, acc] = getStructure(pitch)
          const { correct, wrong } = recorder.dict[pitch]
          const amount = correct + wrong
          return (
            <div className="tag" key={pitch}>
              {`${letter}${acc}${octave}: ${correct} / ${amount}`}
            </div>
          )
        })}
      </div>
    </div>
  )
}

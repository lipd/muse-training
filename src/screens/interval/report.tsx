import { INTERVAL_MAP } from '@components/piano/key-data'
import { Recorder } from '.'
import './style/report.scss'

export const Report = ({ recorder }: { recorder: Recorder }) => {
  return (
    <div className="report-container">
      <h1 className="report-title">不同音程的练习数据</h1>
      <div className="tag-group">
        {Object.keys(recorder.dict).map((modeStr) => {
          const mode = Number(modeStr)
          const distance = mode > 0 ? mode : -mode
          const intervalName = INTERVAL_MAP[distance]
          const directionName = mode > 0 ? '上行' : '下行'
          const { correct, wrong } = recorder.dict[mode]
          const amount = correct + wrong
          return (
            <div className="tag" key={mode}>
              {`${directionName}${intervalName}: ${correct} / ${amount}`}
            </div>
          )
        })}
      </div>
    </div>
  )
}

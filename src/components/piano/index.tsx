import './style/piano.scss'
import classNames from 'classnames'
import { KEYType } from './key-data'

export interface KEYState extends KEYType {
  active: boolean
}

interface PianoProps {
  pianoState: KEYState[]
  handlePianoKeyDown: (pitch: string) => void
  handlePianoKeyUp: (pitch: string) => void
  handleConnectMidi?: any
  handleDisconnectMidi?: any
}
export const Piano = ({
  pianoState,
  handlePianoKeyDown,
  handlePianoKeyUp,
  handleConnectMidi = () => {},
  handleDisconnectMidi = () => {},
}: PianoProps) => {
  return (
    <div className="piano-container">
      <button type="button" onClick={handleConnectMidi}>
        midi
      </button>
      <button type="button" onClick={handleDisconnectMidi}>
        cancle
      </button>
      <div className="piano-keyboard-container">
        {pianoState.map((key) => (
          <div
            key={key.pitch}
            className={classNames({ 'black-key': key.blackKey, 'white-key': !key.blackKey, active: key.active })}
            onMouseDown={() => handlePianoKeyDown(key.pitch)}
            onMouseUp={() => handlePianoKeyUp(key.pitch)}
            onMouseLeave={() => handlePianoKeyUp(key.pitch)}
            onDragStart={(e) => e.preventDefault()}
          >
            <div className="pitch-name">{key.pitch}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

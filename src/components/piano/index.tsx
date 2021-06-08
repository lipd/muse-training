import './style/piano.scss'
import classNames from 'classnames'
import { useState } from 'react'
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
  instruction?: string
  banMidi?: boolean
  midiConnected?: boolean
}
export const Piano = ({
  pianoState,
  handlePianoKeyDown,
  handlePianoKeyUp,
  handleConnectMidi = () => {},
  handleDisconnectMidi = () => {},
  banMidi = false,
  midiConnected = false,
  instruction = '',
}: PianoProps) => {
  const [displayAlphabet, setDisplayAlphabet] = useState(true)
  const [displayInstruction, setDisplayInstruction] = useState(false)
  const [displayMap, setDisplayMap] = useState(true)
  return (
    <div className="piano-container">
      <div className="button-group">
        {banMidi ? (
          <button type="button" className="ban" disabled>
            禁用 MIDI
          </button>
        ) : midiConnected ? (
          <button type="button" onClick={handleDisconnectMidi}>
            断开 MIDI 键盘
          </button>
        ) : (
          <button type="button" onClick={handleConnectMidi}>
            连接 MIDI 键盘
          </button>
        )}

        {displayInstruction ? (
          <button type="button" onClick={() => setDisplayInstruction(false)}>
            隐藏说明
          </button>
        ) : (
          <button type="button" onClick={() => setDisplayInstruction(true)}>
            使用说明
          </button>
        )}
        {displayAlphabet ? (
          <button type="button" onClick={() => setDisplayAlphabet(false)}>
            隐藏音名
          </button>
        ) : (
          <button type="button" onClick={() => setDisplayAlphabet(true)}>
            显示音名
          </button>
        )}
        {displayMap ? (
          <button type="button" onClick={() => setDisplayMap(false)}>
            隐藏键盘映射
          </button>
        ) : (
          <button type="button" onClick={() => setDisplayMap(true)}>
            显示键盘映射
          </button>
        )}
      </div>

      <div className="keyboard-container">
        {pianoState.map((key) => (
          <div
            key={key.pitch}
            className={classNames({ 'black-key': key.blackKey, 'white-key': !key.blackKey, active: key.active })}
            onMouseDown={() => handlePianoKeyDown(key.pitch)}
            onMouseUp={() => handlePianoKeyUp(key.pitch)}
            onMouseLeave={() => handlePianoKeyUp(key.pitch)}
            onDragStart={(e) => e.preventDefault()}
          >
            {displayMap && <div className="key-map">{key.key}</div>}
            {displayAlphabet && <div className="pitch-name">{key.pitch}</div>}
          </div>
        ))}
      </div>
      {displayInstruction && (
        <div className="instruction-container">
          <div className="instruction">{instruction}</div>
        </div>
      )}
    </div>
  )
}

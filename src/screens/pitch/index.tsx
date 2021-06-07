import Pitchfinder from 'pitchfinder'
import { Board } from '@components/board'
import { useEffect, useRef, useState } from 'react'
import { freqToMidi, midiToNoteName, midiToFreq } from '@tonaljs/midi'
import { pitch2Note, enharmonic } from '@utils/note'
import { Display } from './display'
import { PitchPiano } from './pitch-piano'
import './style/pitch.scss'

interface IDisplay {
  currentPitch: string
  idealFreq: string
  actualFreq: string
  diff: string
}

const initDisplay: IDisplay = {
  currentPitch: '--',
  idealFreq: '--',
  actualFreq: '--',
  diff: '--',
}

const detectPitch = Pitchfinder.AMDF()

export const Pitch = () => {
  const [notes, setNotes] = useState<Set<string>>(() => new Set())
  const [display, setDisplay] = useState<IDisplay>(initDisplay)
  const streamRef = useRef<MediaStream>()

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((stream) => {
        streamRef.current = stream
        const context = new AudioContext()
        const source = context.createMediaStreamSource(stream)
        const processor = context.createScriptProcessor(1024 * 4, 1, 1)

        source.connect(processor)
        processor.connect(context.destination)

        processor.onaudioprocess = (e) => {
          const buffer = e.inputBuffer
          const float32Array = buffer.getChannelData(0)
          const freq = detectPitch(float32Array)
          if (freq) {
            const midi = Math.floor(freqToMidi(freq))
            const idealFreq = Math.floor(midiToFreq(midi))
            const pitch = midiToNoteName(midi)
            const enharmonicNote = enharmonic(pitch2Note(pitch))
            setDisplay({
              currentPitch: pitch,
              idealFreq: String(idealFreq),
              actualFreq: String(Math.floor(freq)),
              diff: String(Math.floor(freq - idealFreq)),
            })
            const note = enharmonicNote
            setNotes(new Set([note]))
          } else {
            setNotes(new Set())
            setDisplay(initDisplay)
          }
        }

        return true
      })
      .catch(() => {
        alert('无权访问或没有连接麦克风')
      })
    return () => {
      const stream = streamRef.current
      if (stream) {
        const tracks = stream.getTracks()
        tracks.forEach((track) => {
          track.stop()
        })
      }
    }
  }, [])

  return (
    <div className="pitch-container">
      <div className="pitch">
        <Board normalNotes={[...notes]} />
        <Display>
          <h1>{`当前音高: ${display.currentPitch} 理想频率：${display.idealFreq} 实际频率：${display.actualFreq} 差值：${display.diff}`}</h1>
        </Display>
        <PitchPiano notes={[...notes]} />
      </div>
    </div>
  )
}

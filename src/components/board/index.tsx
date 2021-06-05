import { getStructure } from '@utils/note'
import { useEffect, useRef } from 'react'
import Vex from 'vexflow'
import './style/index.scss'

interface ScoreRef {
  renderer?: Vex.Flow.Renderer
  tickContext?: Vex.Flow.TickContext
  stave?: Vex.Flow.Stave
  context?: Vex.IRenderContext
  svg?: SVGElement
}

type Score = {
  [P in keyof ScoreRef]-?: ScoreRef[P]
}

const VF = Vex.Flow

const { Renderer, Stave, StaveNote, TickContext, Accidental } = VF

const addAcc = (note: Vex.Flow.Note, notes: string[]) => {
  notes.forEach((each, i) => {
    const acc = getStructure(each)[2]
    if (acc) {
      // @ts-ignore
      note.addAccidental(i, new Accidental(acc))
    }
  })
}

interface IDrawAppend {
  notes: string[]
  score: Score
  prevSVGRef: React.MutableRefObject<SVGElement | null>
}
const drawNotes = ({ notes, score, prevSVGRef }: IDrawAppend) => {
  const note = new StaveNote({
    clef: 'treble',
    keys: notes,
    duration: '4',
  })
    .setContext(score.context as any)
    .setStave(score.stave as any)

  addAcc(note, notes)

  score.tickContext.addTickable(note)
  const group = score.context.openGroup() as SVGAElement
  score.tickContext.preFormat().setX(70)
  // @ts-ignore
  note.draw()
  score.context.closeGroup()
  prevSVGRef.current = group
}

interface IWipeNotes {
  prevSVGRef: React.MutableRefObject<SVGElement | null>
}
const wipeNotes = ({ prevSVGRef }: IWipeNotes) => {
  const element = prevSVGRef.current
  if (element) {
    element.remove()
  }
}

interface BoardProps {
  notes: Set<string>
}
export const Board = ({ notes }: BoardProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const scoreRef = useRef<ScoreRef>({})
  const prevSVGRef = useRef<SVGElement | null>(null)
  const prevNotes = useRef<Set<string>>(new Set())

  useEffect(() => {
    const score = scoreRef.current as Score
    score.renderer = new Renderer(containerRef.current as HTMLDivElement, Renderer.Backends.SVG)
    score.context = score.renderer.getContext()
    score.context.resize(500, 300)
    // @ts-ignore
    score.context.setViewBox(0, 0, 250, 250)
    score.svg = (score.context as any).svg as SVGElement
    score.tickContext = new TickContext()
    score.stave = new Stave(0, 80, 260).addClef('treble')
    score.stave.setContext(score.context).draw()
  }, [])

  useEffect(() => {
    const score = scoreRef.current as Score
    prevNotes.current = notes
    prevSVGRef.current && wipeNotes({ prevSVGRef })
    notes.size > 0 && drawNotes({ notes: [...notes], score, prevSVGRef })
  }, [notes])

  return (
    <div className="board-container">
      <div id="vf" ref={containerRef} />
    </div>
  )
}

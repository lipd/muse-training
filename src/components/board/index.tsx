import { getStructure, noteSorter } from '@utils/note'
import { useEffect, useRef } from 'react'
import Vex from 'vexflow'
import './style/board.scss'

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

interface Flag {
  note: string
  state: 'correct' | 'wrong' | 'normal'
}

const FlagColors = {
  wrong: 'red',
  correct: 'green',
  normal: 'black',
}

const flagSorter = (f1: Flag, f2: Flag) => {
  return noteSorter(f1.note, f2.note)
}

interface IGetKeys {
  correctNotes: string[]
  wrongNotes: string[]
}

const getFlags = ({ correctNotes = [], wrongNotes = [] }: IGetKeys) => {
  const flags: Flag[] = []
  correctNotes.forEach((note) => {
    flags.push({ note, state: 'correct' })
  })
  wrongNotes.forEach((note) => {
    flags.push({ note, state: 'wrong' })
  })
  flags.sort(flagSorter)
  return flags
}

interface IDrawAppend {
  normalNotes: string[]
  correctNotes?: string[]
  wrongNotes?: string[]
  score: Score
  prevSVGRef: React.MutableRefObject<SVGElement | null>
}
const drawNotes = ({ normalNotes = [], correctNotes = [], wrongNotes = [], score, prevSVGRef }: IDrawAppend) => {
  if (normalNotes.length > 0) {
    const normal = new StaveNote({
      clef: 'treble',
      keys: normalNotes.sort(noteSorter),
      duration: '1',
    })
      .setContext(score.context)
      .setStave(score.stave)

    addAcc(normal, normalNotes)

    score.tickContext.addTickable(normal)
    const group = score.context.openGroup() as SVGAElement
    score.tickContext.preFormat().setX(70)
    // @ts-ignore
    normal.draw()
    score.context.closeGroup()
    prevSVGRef.current = group
  } else {
    const flags = getFlags({ correctNotes, wrongNotes })
    const sortedNotes = [...correctNotes, ...wrongNotes].sort(noteSorter)
    const diff = new StaveNote({
      clef: 'treble',
      keys: sortedNotes,
      duration: '1',
    })
      .setContext(score.context)
      .setStave(score.stave)

    addAcc(diff, sortedNotes)
    flags.forEach((flag, index) => {
      const color = FlagColors[flag.state]
      // @ts-ignore
      diff.setKeyStyle(index, { fillStyle: color })
    })
    score.tickContext.addTickable(diff)
    const group = score.context.openGroup() as SVGAElement
    score.tickContext.preFormat().setX(70)
    // @ts-ignore
    diff.draw()
    score.context.closeGroup()
    prevSVGRef.current = group
  }
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
  normalNotes: string[]
  correctNotes?: string[]
  wrongNotes?: string[]
}
export const Board = ({ normalNotes = [], correctNotes = [], wrongNotes = [] }: BoardProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const scoreRef = useRef<ScoreRef>({})
  const prevSVGRef = useRef<SVGElement | null>(null)

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
    prevSVGRef.current && wipeNotes({ prevSVGRef })
    const hasNote = normalNotes.length + correctNotes.length + wrongNotes.length > 0
    hasNote && drawNotes({ normalNotes, correctNotes, wrongNotes, score, prevSVGRef })
  }, [normalNotes, correctNotes, wrongNotes])

  return (
    <div className="board-container">
      <div id="vf" ref={containerRef} />
    </div>
  )
}

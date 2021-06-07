import { ENHARMONIC_MAP } from '@components/piano/key-data'

const letterOrder: string[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const accOrder: string[] = ['bb', 'b', '', '#', '##']

export const pitch2Note = (pitch: string) => {
  const regex = /(\D*)(\d*)/
  const res = regex.exec(pitch) as string[]
  return `${res[1]}/${res[2]}`
}

export const getStructure = (note: string): [number, string, string] => {
  const [name, octave] = note.split('/')
  const letter = name[0]
  const acc = name.slice(1)
  return [+octave, letter, acc]
}

export const noteSorter = (n1: string, n2: string) => {
  const [octave1, letter1, acc1] = getStructure(n1)
  const [octave2, letter2, acc2] = getStructure(n2)
  if (octave1 !== octave2) {
    return octave1 - octave2
  }
  if (letter1 !== letter2) {
    return letterOrder.indexOf(letter1) - letterOrder.indexOf(letter2)
  }
  if (acc1 !== acc2) {
    return accOrder.indexOf(acc1) - accOrder.indexOf(acc2)
  }

  return 0
}

export const enharmonic = (note: string) => {
  const [octave, letter, acc] = getStructure(note)
  const enharmonicName = ENHARMONIC_MAP[letter + acc]
  if (!enharmonicName) return note
  return `${enharmonicName}/${octave}`
}

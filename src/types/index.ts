import { Change, diffLines } from 'diff'

export type GameProcessInit = {
  process: 'init'
}
export type GameProcessPlay = {
  process: 'play'
  startTime: number
  gameText: string
  okText: string
  diffs: Change[]
}
export type GameProcessFinish = {
  process: 'finish'
  time: number
}
export type GameProcess = GameProcessInit | GameProcessPlay | GameProcessFinish

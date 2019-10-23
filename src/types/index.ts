import { Change } from 'diff'

export type GameProcessInit = { readonly process: 'init' }

export type GameFields = {
  readonly startTime: number
  readonly gameText: string
  readonly okText: string
  readonly diffs: Change[]
}
export type GameProcessPlay = {
  readonly process: 'play'
} & GameFields

export type GameProcessFinish = {
  readonly process: 'finish'
  readonly time: number
}
export type GameProcess = GameProcessInit | GameProcessPlay | GameProcessFinish

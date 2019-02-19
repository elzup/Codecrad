import { Change } from 'diff'

export type StartAction = {
  type: 'start'
  payload: {
    startTime: number
    gameText: string
    okText: string
    diffs: Change[]
  }
}

export type UpdateDiffAction = {
  type: 'updateDiff'
  payload: {
    gameText: string
    diffs: Change[]
  }
}

export type FinishAction = {
  type: 'finish'
  payload: {
    endTime: number
  }
}

export type Action = StartAction | UpdateDiffAction | FinishAction

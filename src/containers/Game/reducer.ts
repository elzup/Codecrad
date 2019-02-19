import { GameProcess } from '../../types'
import { Action } from './actions'

export function reducer(state: GameProcess, action: Action): GameProcess {
  switch (action.type) {
    case 'start': {
      return { process: 'play', ...action.payload }
    }
    case 'updateDiff': {
      return { ...state, ...action.payload }
    }
    case 'finish': {
      if (state.process !== 'play') {
        return state // unreach
      }
      return {
        process: 'finish',
        time: action.payload.endTime - state.startTime,
      }
    }
    default: {
      return state
    }
  }
}

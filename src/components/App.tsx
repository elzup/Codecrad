import * as React from 'react'

import { Color } from 'ink'
import { Change, diffLines } from 'diff'
import * as chokidar from 'chokidar'
import * as fs from 'fs-extra'
import { read } from '../utils'
import { paths } from '../config'
const { worldGameFile, worldOkFile, worldPath } = paths

const { useContext, useEffect, useReducer, createContext } = React

type Props = {
  stage: string
}
type GameState =
  | {
      process: 'init'
    }
  | {
      process: 'play'
      startTime: number
      gameText: string
      okText: string
      diffs: Change[]
    }
  | {
      process: 'finish'
      time: number
    }
type State = GameState

const initialState: State = {
  process: 'init',
}

type StartAction = {
  type: 'start'
  payload: {
    startTime: number
    gameText: string
    okText: string
    diffs: Change[]
  }
}

type UpdateDiffAction = {
  type: 'updateDiff'
  payload: {
    gameText: string
    diffs: Change[]
  }
}

type FinishAction = {
  type: 'finish'
  payload: {
    endTime: number
  }
}

type Action = StartAction | UpdateDiffAction | FinishAction

function reducer(state: State, action: Action): State {
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

const StateContext = createContext<State>(null as any)
const DispatchContext = createContext<React.Dispatch<Action>>(null as any)

const App: React.SFC<Props> = props => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <Game {...props} />
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

const Game: React.SFC<Props> = props => {
  const game = useContext(StateContext)
  const dispatch = useContext(DispatchContext)
  useEffect(() => {
    const { stage } = props
    const sourceStagePath = paths.stagesPath + '/' + stage
    fs.removeSync(worldPath)
    fs.copySync(sourceStagePath, worldPath)
    fs.copySync(paths.prettierFile, worldPath + '/' + '.prettierrc')
    const gameText = read(worldGameFile)
    const okText = read(worldOkFile)
    const diffs = diffLines(gameText, okText)
    dispatch({
      type: 'start',
      payload: {
        startTime: Date.now(),
        gameText,
        okText,
        diffs,
      },
    })

    const watcher = chokidar.watch(worldGameFile, { persistent: true })
    watcher.on('all', (event, path) => {
      const gameText = read(worldGameFile)
      const diffs = diffLines(gameText, okText)
      if (diffs.length > 1) {
        dispatch({
          type: 'updateDiff',
          payload: {
            gameText,
            diffs,
          },
        })
      } else {
        watcher.close()
        dispatch({
          type: 'finish',
          payload: {
            endTime: Date.now(),
          },
        })
      }
    })
    return () => {}
  }, [])

  switch (game.process) {
    case 'init':
      return <Color green>loading ...</Color>
    case 'play':
      const { diffs } = game
      return (
        <div>
          <div>--------------------</div>
          <div>{worldGameFile}</div>
          <div>--------------------</div>
          <DiffView changes={diffs} />
        </div>
      )
    case 'finish':
      return (
        <div>
          <div>
            <Color white>Finish</Color>
          </div>
          <div>
            <Color green>Time: {toSecondTime(game.time)}</Color>
          </div>
          <div>
            <Color white>gg!</Color>
          </div>
        </div>
      )
  }
}

const toSecondTime = (time: number): string => {
  return `${Math.floor(time / 1000)}.${time % 1000}`
}

const DiffView: React.SFC<{ changes: Change[] }> = props => {
  return (
    <div>
      <div>
        {props.changes.map((change, i) => {
          const color = change.added ? 'green' : change.removed ? 'red' : 'gray'
          return (
            <Color key={i} keyword={color}>
              {change.value}
            </Color>
          )
        })}
      </div>
    </div>
  )
}

export default App

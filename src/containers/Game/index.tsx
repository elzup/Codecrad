import * as React from 'react'

import { Color } from 'ink'
import { diffLines } from 'diff'
import * as fs from 'fs-extra'
import * as chokidar from 'chokidar'
import { read } from '../../utils'
import { paths } from '../../config'
import { GameProcess } from '../../types'
import GamePlayScreen from './components/GamePlayScreen'
import GameFinishScreen from './components/GameFinishScreen'
import { reducer } from './reducer'
import { Action } from './actions'
const { worldGameFile, worldOkFile, worldPath } = paths

const { useContext, useEffect, useReducer, createContext } = React

type Props = {
  stage: string
}
type State = GameProcess

const initialState: State = {
  process: 'init',
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
    return () => {
      watcher.close()
    }
  }, [])

  switch (game.process) {
    case 'init':
      return <Color green>loading ...</Color>
    case 'play':
      return <GamePlayScreen game={game} filePath={worldGameFile} />
    case 'finish':
      return <GameFinishScreen game={game} />
  }
}

export default App

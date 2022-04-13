import * as React from 'react'
import { diffLines } from 'diff'
import { Text, useApp } from 'ink'
import * as fs from 'fs-extra'
import * as chokidar from 'chokidar'
import { read } from '../../utils'
import { paths } from '../../config'
import { GameProcess, GameFields } from '../../types'
import { log } from '../../logger'
import GamePlayScreen from './components/GamePlayScreen'
import GameFinishScreen from './components/GameFinishScreen'

const { worldGameFile, worldOkFile, worldPath } = paths

const { useEffect } = React

type Props = {
  stage: string
}
type State = GameProcess

const initialState: State = {
  process: 'init',
}

function Game({ stage }: Props) {
  log(`render app: ${stage}`)
  const { exit } = useApp()
  const [game, setGame] = React.useState<State>(initialState)

  const start = (fields: GameFields) => setGame({ process: 'play', ...fields })

  const finish = (endTime: number) => {
    setGame((state) => {
      if (state.process !== 'play') {
        throw new Error()
      }
      return { process: 'finish', time: endTime - state.startTime }
    })
  }

  const updateDiff = (fields: Pick<GameFields, 'gameText' | 'diffs'>) =>
    setGame((state) => ({ ...state, ...fields }))

  useEffect(() => {
    const sourceStagePath = paths.stagesPath + '/' + stage

    log(`load game: ${stage}`)

    fs.removeSync(worldPath)
    fs.copySync(sourceStagePath, worldPath)
    fs.copySync(paths.prettierFile, worldPath + '/' + '.prettierrc')
    const gameText = read(worldGameFile)
    const okText = read(worldOkFile)
    const diffs = diffLines(gameText, okText)

    start({ startTime: Date.now(), gameText, okText, diffs })
    const watcher = chokidar.watch(worldGameFile, { ignoreInitial: true })
    const close = () => {
      watcher.close()
    }

    watcher.on('all', () => {
      log(`game: update`)
      const gameText = read(worldGameFile)
      const diffs = diffLines(gameText, okText, { newlineIsToken: true })

      if (diffs.length > 1) {
        updateDiff({ gameText, diffs })
      } else {
        finish(Date.now())
        close()
        exit()
      }
    })
    return () => {
      close()
    }
  }, [])

  switch (game.process) {
    case 'init':
      return <Text color="green">loading ...</Text>
    case 'play':
      return <GamePlayScreen game={game} filePath={worldGameFile} />
    case 'finish':
      return <GameFinishScreen game={game} />
    default:
      return null
  }
}

export default Game

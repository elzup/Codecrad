import { h, Color, Component, Fragment, StatelessComponent } from 'ink'
import { Change, diffLines } from 'diff'
import * as chokidar from 'chokidar'

import * as fs from 'fs-extra'
import chalk from 'chalk'
import { read } from '../utils'
import { paths } from '../config'
const { worldGameFile, worldOkFile, worldPath } = paths

type Props = {
  stage: string
}
type GameState =
  | {
      process: 'init'
    }
  | {
      process: 'play'
      gameText: string
      okText: string
      diffs: Change[]
    }
  | {
      process: 'finish'
      time: number
    }
type State = {
  hs: number
  game: GameState
}

class App extends Component<Props, State> {
  timer = null as ReturnType<typeof setInterval> | null
  watcher = null as chokidar.FSWatcher | null
  state = {
    hs: 0,
    game: {
      process: 'init',
    } as GameState,
  }

  componentDidMount() {
    this.initialize()
  }
  async initialize() {
    const { stage } = this.props
    const sourceStagePath = paths.stages.root + '/' + stage
    fs.removeSync(worldPath)
    fs.copySync(sourceStagePath, worldPath)
    const gameText = read(worldGameFile)
    const okText = read(worldOkFile)
    const diffs = diffLines(gameText, okText)
    this.setState({
      game: { process: 'play', gameText, okText, diffs },
    })

    this.timer = setInterval(() => {
      this.setState({
        hs: this.state.hs + 1,
      })
    }, 10)
    this.watcher = chokidar.watch(worldGameFile, { persistent: true })
    console.log('hello')
    this.watcher.on('all', (event, path) => {
      console.log({ event, path })
      const gameText = read(worldGameFile)
      const diffs = diffLines(gameText, okText)
      if (diffs.length > 1) {
        this.setState({
          game: { process: 'play', gameText, okText, diffs },
        })
      } else {
        clearInterval(this.timer!)
        this.setState({
          game: { process: 'finish', time: this.state.hs },
        })
      }
    })
  }

  componentWillUnmount() {
    clearInterval(this.timer!)
    if (this.watcher) {
      this.watcher.close()
    }
  }

  render() {
    const { game } = this.state
    switch (game.process) {
      case 'init':
        return (
          <Fragment>
            <Color green>loading ...</Color>
          </Fragment>
        )
      case 'play':
        const { diffs } = game
        return (
          <Fragment>
            <div>
              <Color white>{this.state.hs}</Color>
            </div>
            <DiffView changes={diffs} />
          </Fragment>
        )
      case 'finish':
        return (
          <Fragment>
            <Color white>Finish!!</Color>
            <Color green>Time: {toSecondTime(game.time)}</Color>
            <Color white>GG</Color>
          </Fragment>
        )
    }
  }
}

const toSecondTime = (hs: number): string => {
  return `${Math.floor(hs / 100)}.${hs % 100}`
}

const DiffView: StatelessComponent<{ changes: Change[] }> = props => {
  return (
    <div>
      <Fragment>
        {props.changes.map(change => {
          const color = change.added ? 'green' : change.removed ? 'red' : 'gray'
          return <Color keyword={color}>{change.value}</Color>
        })}
      </Fragment>
    </div>
  )
}

export const printDiffText = (changes: Change[]) => {
  changes.forEach(part => {
    const color = part.added
      ? chalk.green
      : part.removed
      ? chalk.red
      : chalk.gray
    process.stdout.write(color(part.value))
  })
}

export default App

import { h, Color, Component, Fragment, StatelessComponent } from 'ink'
import { Change, diffChars, diffLines, convertChangesToDMP } from 'diff'
import * as fs from 'fs-extra'
import chalk from 'chalk'
import { read } from '../utils'
import { stages } from '../config'

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
    }
  | {
      process: 'finish'
    }
type State = {
  i: number
  game: GameState
}

class App extends Component<Props, State> {
  timer = null as ReturnType<typeof setInterval> | null
  state = {
    i: 0,
    game: {
      process: 'init',
    } as GameState,
  }

  componentDidMount() {
    this.initialize()
    this.timer = setInterval(() => {
      this.setState({
        i: this.state.i + 1,
      })
    }, 100)
  }
  async initialize() {
    const { stage } = this.props
    await fs.copy(stage, './')
    const gameText = read(stages.game(stage))
    const okText = read(stages.ok(stage))
    this.setState({
      game: { process: 'play', gameText, okText },
    })
  }

  componentWillUnmount() {
    clearInterval(this.timer!)
  }

  render() {
    const { game } = this.state
    if (game.process === 'init') {
      return (
        <Fragment>
          <Color green>{this.state.i}</Color>
          <Color green>loading ...</Color>
        </Fragment>
      )
    } else if (game.process === 'play') {
      const { gameText, okText } = game
      const diffs = diffLines(gameText, okText)
      return (
        <Fragment>
          <Color green>{this.state.i}</Color>
          <DiffView changes={diffs} />
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          <Color green>{this.state.i}</Color>
          <Color green>Finish!! GG</Color>
        </Fragment>
      )
    }
  }
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

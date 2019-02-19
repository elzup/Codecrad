import * as React from 'react'
import { GameProcessPlay } from '../../../types'
import { Change } from 'diff'
import { Color } from 'ink'

const GamePlayScreen: React.SFC<{
  game: GameProcessPlay
  filePath: string
}> = props => {
  return (
    <div>
      <div>--------------------</div>
      <div>{props.filePath}</div>
      <div>--------------------</div>
      <DiffView changes={props.game.diffs} />
    </div>
  )
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

export default GamePlayScreen

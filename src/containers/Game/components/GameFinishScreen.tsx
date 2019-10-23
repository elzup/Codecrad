import * as React from 'react'
import { Color } from 'ink'
import { GameProcessFinish } from '../../../types'

const toSecondTime = (time: number): string => {
  return `${Math.floor(time / 1000)}.${time % 1000}`
}

const GameFinishScreen: React.SFC<{
  game: GameProcessFinish
}> = props => {
  const { game } = props

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

export default GameFinishScreen

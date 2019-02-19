import * as React from 'react'
import { GameProcessFinish } from '../../../types'
import { Color } from 'ink'

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
const toSecondTime = (time: number): string => {
  return `${Math.floor(time / 1000)}.${time % 1000}`
}

export default GameFinishScreen

import * as React from 'react'
import { Box, Text } from 'ink'
import { GameProcessFinish } from '../../../types'

const toSecondTime = (time: number): string => {
  return `${Math.floor(time / 1000)}.${time % 1000}`
}

const GameFinishScreen: React.SFC<{
  game: GameProcessFinish
}> = (props) => {
  const { game } = props

  return (
    <Box>
      <Box>
        <Text color="white">Finish</Text>
      </Box>
      <Box>
        <Text color="green">Time: {toSecondTime(game.time)}</Text>
      </Box>
      <Box>
        <Text color="white">gg!</Text>
      </Box>
    </Box>
  )
}

export default GameFinishScreen

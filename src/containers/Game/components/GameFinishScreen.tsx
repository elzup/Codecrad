import * as React from 'react'
import { Box, Text } from 'ink'
import { GameProcessFinish } from '../../../types'

const toSecondTime = (time: number): string => {
  return `${Math.floor(time / 1000)}.${time % 1000}`
}

const GameFinishScreen = (props: { game: GameProcessFinish }) => {
  const { game } = props

  return (
    <Box flexDirection="column">
      <Text color="white">Finish</Text>
      <Text color="green">
        Time: <Text bold>{toSecondTime(game.time)}</Text>
      </Text>
      <Text color="white">gg!</Text>
    </Box>
  )
}

export default GameFinishScreen

import * as React from 'react'
import { Change } from 'diff'
import { Box, Text } from 'ink'
import { GameProcessPlay } from '../../../types'

const GamePlayScreen = (props: { game: GameProcessPlay; filePath: string }) => {
  return (
    <Box flexDirection="column">
      <Text>--------------------</Text>
      <Text>./{props.filePath}</Text>
      <Text>---</Text>
      <DiffView changes={props.game.diffs} />
      <Text>---</Text>
      <Text>./{props.filePath}</Text>
      <Text>--------------------</Text>
    </Box>
  )
}

const trimLine = (text: string) => text.replace(/^\n*|\n*$/g, '')

const DiffView = (props: { changes: Change[] }) => {
  return (
    <Box flexDirection="column">
      {props.changes.map((change, i) => {
        const color = change.added ? 'green' : change.removed ? 'red' : 'gray'
        const head = change.added ? '+' : change.removed ? '-' : ' '

        return (
          <Text key={i} color={color}>
            {head}
            {trimLine(change.value)}
          </Text>
        )
      })}
    </Box>
  )
}

export default GamePlayScreen

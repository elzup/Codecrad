import * as React from 'react'
import { Change } from 'diff'
import { Box, Text } from 'ink'
import { GameProcessPlay } from '../../../types'

const GamePlayScreen: React.SFC<{
  game: GameProcessPlay
  filePath: string
}> = (props) => {
  return (
    <Box flexDirection="column">
      <Text>--------------------</Text>
      <Text>{props.filePath}</Text>
      <Text>--------------------</Text>
      <DiffView changes={props.game.diffs} />
    </Box>
  )
}

const trimLine = (text: string) => text.replace(/^\n*|\n*$/g, '')

const DiffView: React.SFC<{ changes: Change[] }> = (props) => {
  return (
    <Box flexDirection="column">
      {props.changes.map((change, i) => {
        const color = change.added ? 'green' : change.removed ? 'red' : 'gray'

        return (
          <Text key={i} color={color}>
            {trimLine(change.value)}
          </Text>
        )
      })}
    </Box>
  )
}

export default GamePlayScreen

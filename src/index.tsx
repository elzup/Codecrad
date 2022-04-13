import { render } from 'ink'
import * as React from 'react'
import Game from './containers/Game'

export default (gameKey: string) => {
  return render(<Game stage={gameKey} />)
}

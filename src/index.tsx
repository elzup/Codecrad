import { render } from 'ink'
import * as React from 'react'
import App from './containers/Game'

export default (gameKey: string) => {
  return render(<App stage={gameKey} />)
}

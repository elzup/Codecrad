import * as React from 'react'

import { render } from 'ink'
import App from './components/App'
import { paths } from './config'

export default async () => {
  render(<App stage={paths.stages.fizzbuzz.id} />)
}

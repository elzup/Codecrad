import * as React from 'react'

import { render } from 'ink'
import App from './components/App'
import { paths } from './config'
import { Stream } from 'stream'

type Option = {
  stdin?: Stream
  stdout?: Stream
}

export default async (options?: Option) => {
  render(<App stage={paths.stages.fizzbuzz.id} />, { ...options })
}

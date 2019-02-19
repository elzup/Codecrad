import * as React from 'react'

import { render } from 'ink'
import App from './containers/Game'
import { paths } from './config'
import { Stream } from 'stream'

type Option = {
  stdin?: Stream
  stdout?: Stream
}

export default async (options?: Option) => {
  render(<App stage={'fizzbuzz'} />, { ...options })
}

import * as React from 'react'

import { render } from 'ink'
import App from './containers/Game'
import { paths } from './config'
import { Stream } from 'stream'

type Option = {
  stdin?: any
  stdout?: any
}

export default (options?: Option) => {
  return render(<App stage={'fizzbuzz'} />, { ...options })
}

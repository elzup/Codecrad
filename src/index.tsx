import * as React from 'react'

import { render } from 'ink'
import App from './containers/Game'

type Option = {
  stdin?: unknown
  stdout?: unknown
}

export default (options?: Option) => {
  return render(<App stage={'fizzbuzz'} />, { ...options })
}

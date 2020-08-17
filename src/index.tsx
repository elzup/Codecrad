import { render } from 'ink'
import * as React from 'react'
import App from './containers/Game'

export default () => {
  return render(<App stage={'fizzbuzz'} />)
}

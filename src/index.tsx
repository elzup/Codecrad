import * as React from 'react'

import { render, AppContext } from 'ink'
import App from './containers/Game'

export default () => {
  return render(
    <AppContext.Consumer>
      {({ exit }) => <App stage={'fizzbuzz'} exit={exit} />}
    </AppContext.Consumer>
  )
}

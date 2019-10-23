import * as React from 'react'
import { render } from 'ink-testing-library'
import App from '../containers/Game'

test('simple', () => {
  const { lastFrame, unmount } = render(
    <App stage={'fizzbuzz'} exit={() => {}} />
  )

  expect(lastFrame()).toMatchInlineSnapshot(`"[32mloading ...[39m"`)
  unmount()
})

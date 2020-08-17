import { render } from 'ink-testing-library'
import * as React from 'react'
import App from '../containers/Game'

const sleep = (msec: number) =>
  new Promise((resolve) => setTimeout(resolve, msec))

test('simple', async () => {
  const { lastFrame, unmount, cleanup, rerender } = render(
    <App stage={'fizzbuzz'} />
  )

  expect(lastFrame()).toMatchInlineSnapshot(`"loading ..."`)
  rerender(<App stage={'fizzbuzz'} stop />)
  unmount()
  cleanup()
  await sleep(2000)
})

import { render } from 'ink-testing-library'
import * as React from 'react'
import App from '../containers/Game'

const sleep = (msec: number) =>
  new Promise((resolve) => setTimeout(resolve, msec))

test('simple', async () => {
  const { lastFrame, unmount, cleanup, rerender } = render(
    <App stage={'fizzbuzz'} />
  )

  expect(lastFrame()).toMatchInlineSnapshot(`"[32mloading ...[39m"`)
  rerender(<App stage={'fizzbuzz'} stop />)
  await sleep(2000)
  unmount()
  cleanup()
  await sleep(2000)
})

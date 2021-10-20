import { render } from 'ink-testing-library'
import React from 'react'
import App from '../containers/Game'

const sleep = (msec: number) =>
  new Promise((resolve) => setTimeout(resolve, msec))

test('simple', async () => {
  const { lastFrame, unmount, cleanup } = render(<App stage={'fizzbuzz'} />)

  expect(lastFrame()).toMatchInlineSnapshot(`"loading ..."`)
  unmount()
  cleanup()
  await sleep(2000)
})

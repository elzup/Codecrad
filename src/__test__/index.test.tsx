import EventEmitter from 'events'
import * as React from 'react'
import stripAnsi from 'strip-ansi'

import { spy, stub } from 'sinon'
import renderToString from 'ink/build/render-to-string'
import App from '../containers/Game'
import m from '..'

const stripOutput = (str: string) => stripAnsi(str).trim()

test('simple', () => {
  const res = renderToString(<App stage={'fizzbuzz'} />)

  expect(res).toMatchInlineSnapshot(`"[32mloading ...[39m"`)
})

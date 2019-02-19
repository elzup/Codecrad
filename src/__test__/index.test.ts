import m from '../'
import * as stream from 'stream'

const sleep = (msec: number) =>
  new Promise(resolve => setTimeout(resolve, msec))

test('run', async () => {
  const spy = jest.spyOn(process.stdout, 'write')
  const p = m()
  await sleep(1000)
  expect(spy).toHaveBeenCalled()
  expect(spy.mock.calls[0][0]).toMatchInlineSnapshot(`
"[32mloading ...[39m
"
`)
  expect(spy.mock.calls[1][0]).toMatchInlineSnapshot(`"[?25l"`)
  expect(spy.mock.calls[2][0]).toMatchInlineSnapshot(`
"[2K[1A[2K[G--------------------
world/game.js
--------------------
[38;2;255;0;0m// delete me[39m

[38;2;128;128;128mconst fizzBuzz = n =>[39m
[38;2;128;128;128m  [...Array(n).keys()].map(i => {[39m

[38;2;255;0;0m    if (i % 3 == 0) {[39m

[38;2;0;128;0m    if (i % 15 === 0) {[39m
[38;2;0;128;0m      return 'FizzBuzz'[39m
[38;2;0;128;0m    }[39m
[38;2;0;128;0m    if (i % 3 === 0) {[39m

[38;2;128;128;128m      return 'Fizz'[39m
[38;2;128;128;128m    }[39m

[38;2;255;0;0m    if (i % 5 == 0) {[39m
[38;2;255;0;0m      return 'Yuzz'[39m

[38;2;0;128;0m    if (i % 5 === 0) {[39m
[38;2;0;128;0m      return 'Buzz'[39m

[38;2;128;128;128m    }[39m

[38;2;255;0;0m    if (i % 15 == 0) {[39m
[38;2;255;0;0m      return 'FizzYuzz'[39m
[38;2;255;0;0m    }[39m

[38;2;128;128;128m    return \`\${i}\`[39m
[38;2;128;128;128m  })[39m


[38;2;255;0;0m// delete me[39m

[38;2;255;0;0mconsole.log(fizzBuzz(150).join('\\\\n')) // delete me[39m

[38;2;0;128;0mconsole.log(fizzBuzz(15).join('\\\\n'))[39m

"
`)

  spy.mockRestore()
})

afterAll(done => {
  // process.exit(0)
})

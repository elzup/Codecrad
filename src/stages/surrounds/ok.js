// happy surrounds
fn = () => {}

fn(100)
fn()
fn(fun())
fn('wrapMe')

fn(200)
const me = 0
fn(`embed ${me}`)
fn("'a', 'b', 'c'")
fn(['a', 'b', 'c'])

fn(300)
fn(() => ({}))
fn(() => ({}))
fn(() => ({ ok: true }))

// carry

const trays = {
  aTray: 'lorem ipsum',
  bTray: 'dolor sit amet consectetur',
  cTray: 'adipisicing elit sed do eiusmod',
  dTray: 'tempor incididunt ut',
}

const statue = {
  a: 'lorem ipsum',
  b: 'dolor sit amet consectetur',
  c: 'adipisicing elit sed do eiusmod',
  d: 'tempor incididunt ut',
}

// sahve

fn('bb->', 'bb->')
fn('<-cc', '<-cc')
fn('bb->', 'bb->')
fn('bb->', 'bb->', 'bb->')
fn('aa->', '<-aa')
fn('aa->', 'aa->', '<-aa')
fn(0, 1, 2, 3)

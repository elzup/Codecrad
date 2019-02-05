import * as fs from 'fs-extra'
import { diffChars, diffLines, Change } from 'diff'
import chalk from 'chalk'

const stages = {
  fizzbuzz: 'stages/fizzbuzz',
  ok: (path: string) => `${path}/ok.js`,
  game: (path: string) => `${path}/game.js`,
}

const read = (path: string) => fs.readFileSync(path, { encoding: 'utf8' })

const printDiffText = (changes: Change[]) => {
  changes.forEach(part => {
    const color = part.added
      ? chalk.green
      : part.removed
      ? chalk.red
      : chalk.gray
    process.stdout.write(color(part.value))
  })
}

export default async () => {
  const id = stages.fizzbuzz
  await fs.copy(id, './')
  const gameText = read(stages.game(id))
  const okText = read(stages.ok(id))
  printDiffText(diffChars(gameText, okText))
  printDiffText(diffLines(gameText, okText))
}

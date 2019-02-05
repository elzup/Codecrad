import * as fs from 'fs-extra'
export const read = (path: string) =>
  fs.readFileSync(path, { encoding: 'utf8' })

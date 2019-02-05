const okFile = 'ok.js'
const gameFile = 'game.js'
const stagesPath = 'stages'
const worldPath = 'world'
const fizzbuzz = 'fizzbuzz'

export const paths = {
  worldPath,
  worldGameFile: `${worldPath}/${gameFile}`,
  worldOkFile: `${worldPath}/${okFile}`,
  stagesPath,
  stages: {
    root: stagesPath,
    fizzbuzz: {
      id: fizzbuzz,
      path: `${stagesPath}/${fizzbuzz}`,
    },
  },
  okFile,
  gameFile,
}

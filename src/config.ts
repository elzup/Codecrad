const okFile = 'ok.js'
const gameFile = 'game.js'
const stagesPath = __dirname + '/stages'
const worldPath = 'world'

export const paths = {
  worldPath,
  worldGameFile: `${worldPath}/${gameFile}`,
  worldOkFile: `${worldPath}/${okFile}`,
  stagesPath,
  stages: {
    root: stagesPath,
  },
  okFile,
  gameFile,
}

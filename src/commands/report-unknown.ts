import { Roll20Object } from '../types'
import { whisperToPlayer } from '../helpers'

function reportUnknownCommandToPlayer(command: string, player: Roll20Object) {
  // Notify of available commands
  whisperToPlayer(player, `Unknown command IIM "${command}"`)
}

export {
  reportUnknownCommandToPlayer
}
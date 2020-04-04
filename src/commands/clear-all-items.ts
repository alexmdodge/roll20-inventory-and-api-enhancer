import {
  IIM_ITEM_IDENTIFIER
} from '../constants'

import { Roll20ObjectType, isString, Roll20Object, IIMContext } from '../types'
import { whisperToPlayer } from '../helpers'

function isIIMItem(test: string): boolean {
  return test.indexOf(IIM_ITEM_IDENTIFIER) > -1
}

function clearHandoutItemForPlayer(player: Roll20Object, handout: Roll20Object) {
  const name = handout.get('name')

  handout.get('notes', function (notes) {
    if (!isString(notes)) { return }

    if (isIIMItem(notes)) {
      whisperToPlayer(player, `Removing handout: ${name}`)
      handout.remove()
    }
  })
}

function clearAllItems(context: IIMContext) {
  findObjs({ type: Roll20ObjectType.Handout }).forEach(
    handout => clearHandoutItemForPlayer(context.player, handout)
  )
}

export {
  clearAllItems
}
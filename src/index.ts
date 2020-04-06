import { Roll20Message } from './types'
import { parseChatMessage } from './helpers'
import {
  reportUnknownCommandToPlayer,
  loadAllItems,
  updateAllItems,
  createItem,
  addInventoryItem,
  copyItem,
  updateInventoryItem,
  deleteInventoryItem,
  updateItem,
  updateItemImage,
  updateItemDescription,
  updateInventory
} from './commands/index'
import { createInventory } from './commands/create-inventory'

on('ready', () => {
  on('chat:message', msg => {
    detectCommand(msg)
  })
})

function detectCommand(message: Roll20Message) {
  const context = parseChatMessage(message)
  const { type, player, command } = context

  if (type !== 'api') { /* Not an API command */ return }
  if (command.id !== '!iim') { /* Not our API trigger */ return }
  
  if (!player) {
    log('[detectCommand] No player exists for provided ID')
    return
  }

  switch(command.trigger) {
    case 'load-all-items':
      loadAllItems(context)
      break

    case 'update-all-items':
      updateAllItems(context)
      break

    case 'update-item':
      updateItem(context)
      break

    case 'update-item-image':
      updateItemImage(context)
      break

    case 'update-item-description':
      updateItemDescription(context)
      break

    case 'create-item':
      createItem(context)
      break

    case 'copy-item':
      copyItem(context)
      break

    case 'create-inventory':
      createInventory(context)
      break

    case 'update-inventory':
      updateInventory(context)
      break

    case 'add-inventory-item':
      addInventoryItem(context)
      break

    case 'update-inventory-item':
      updateInventoryItem(context)
      break

    case 'delete-inventory-item':
      deleteInventoryItem(context)
      break

    default:
      reportUnknownCommandToPlayer(command.trigger, player)
  }
}

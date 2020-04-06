import { IIM_INVENTORY_IDENTIFIER } from '../constants'
import {
  IIMContext,
  IIMInventoryMetadata
} from '../types'
import { whisperToPlayer, getInventoryDataById } from '../helpers'
import { InventoryTemplate } from '../templates'

function updateInventory(context: IIMContext) {
  const { command, player } = context
  const commandOptions = command.options

  const data = commandOptions.split(/\s/g)
  const inventoryId = data[0].trim()

  getInventoryDataById(inventoryId).then(({ meta: inventoryMeta, handout: inventoryHandout }) => {
    if (!inventoryMeta) {
      whisperToPlayer(player, `Unable to retrieve ${inventoryHandout.get('name')} data during update.`)
      return
    }

    const updatedInventoryMetadata: IIMInventoryMetadata = {
      id: IIM_INVENTORY_IDENTIFIER,
      handoutId: inventoryMeta.handoutId,
      inventory: inventoryMeta.inventory.map(itemMeta => ({
        ...itemMeta,
        item: {
          ...itemMeta.item,

          // Always ensure descriptions are empty
          description: ''
        }
      }))
    }

    // Ensure we don't get any stack errors
    setTimeout(() => {
      inventoryHandout.set('notes', InventoryTemplate(inventoryMeta))
      inventoryHandout.set('gmnotes', JSON.stringify(updatedInventoryMetadata, null, 2))
    }, 0)

    const invNameStyled = `<span style="font-weight:bold;">${inventoryHandout.get('name')}</span>`
    whisperToPlayer(player, `Updated inventory for ${invNameStyled}`)
  })
}

function updateInventoryCommandTemplate(inventoryHandoutId: string): string {
  return [
    '!iim',
    'update-inventory',
    inventoryHandoutId
  ].join(' ')
}

export {
  updateInventory,
  updateInventoryCommandTemplate
}
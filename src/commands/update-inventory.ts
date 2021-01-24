import { IIM_INVENTORY_IDENTIFIER } from '../constants'
import {
  IIMContext,
  IIMInventoryMetadata
} from '../types'
import { whisperToPlayer, getInventoryDataByCharName, getTotalWealth, getTotalWeight, normalizeInventoryMeta } from '../helpers'
import { InventoryTemplate } from '../templates'

function updateInventory(context: IIMContext) {
  const { command, player } = context
  const commandOptions = command.options

  const data = commandOptions.split(/\s/g)
  const charName = data[0].trim()

  getInventoryDataByCharName(charName, player).then(({ meta: inventoryMeta, handout: inventoryHandout }) => {
    if (!inventoryMeta) {
      whisperToPlayer(player, `Unable to retrieve ${inventoryHandout.get('name')} data during update.`)
      return
    }

    const normalizedMeta = normalizeInventoryMeta(inventoryMeta)

    const updatedInventoryMetadata: IIMInventoryMetadata = {
      id: IIM_INVENTORY_IDENTIFIER,
      characterName: normalizedMeta.characterName,
      characterId: normalizedMeta.characterId,
      handoutId: normalizedMeta.handoutId,
      totalWealth: getTotalWealth(normalizedMeta.inventory),
      totalWeight: getTotalWeight(normalizedMeta.inventory),
      inventory: normalizedMeta.inventory.map(itemMeta => ({
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
      inventoryHandout.set('notes', InventoryTemplate(updatedInventoryMetadata))
      inventoryHandout.set('gmnotes', JSON.stringify(updatedInventoryMetadata, null, 2))
    }, 0)

    const invNameStyled = `<span style="font-weight:bold;">${inventoryHandout.get('name')}</span>`
    whisperToPlayer(player, `Updated inventory for ${invNameStyled}`)
  })
}

function updateInventoryCommandTemplate(charName: string): string {
  return [
    '!iim',
    'update-inventory',
    charName
  ].join(' ')
}

export {
  updateInventory,
  updateInventoryCommandTemplate
}
import { Roll20Object, IIMContext, Roll20ObjectType, IIMInventoryMetadata } from '../types'
import { whisperToPlayer, parseInventory, getCharacterByName, getTotalWealth, getTotalWeight, trimWhitespace, normalizeInventoryMeta } from '../helpers'
import { InventoryTemplate } from '../templates'
import { IIM_INVENTORY_IDENTIFIER } from '../constants'

function getAllInventories(player: Roll20Object): Promise<{ handout: Roll20Object; invMeta: IIMInventoryMetadata }[]> {
  const allHandouts = findObjs({
    type: Roll20ObjectType.Handout
  })

  const processingHandouts = allHandouts.map(handout => {
    return new Promise<{ handout: Roll20Object; invMeta: IIMInventoryMetadata } | null>(resolve => {
      handout.get('gmnotes', metadata => {
        if (metadata.indexOf(IIM_INVENTORY_IDENTIFIER) === -1) {
          // In this case only inventories will have these identifiers, items won't
          resolve(null)
          return
        }

        const inventoryMetadata = parseInventory(metadata)

        // In the future perform any updates or transformations here
        if (!inventoryMetadata) {
          whisperToPlayer(player, `Error parsing data for inventory: ${handout.get('name')}`)
          resolve(null)
          return
        }

        resolve({
          invMeta: inventoryMetadata,
          handout: handout
        })
      })
    })
  })

  return Promise.all(processingHandouts)
    .then(inventories => inventories.filter(inv => inv !== null))
}

function updateAllInventories({ player }: IIMContext) {
  getAllInventories(player).then(allInventories => {
    whisperToPlayer(player, `Acting on inventories of length: ${allInventories.length}`)
    allInventories.forEach(({ handout, invMeta }) => {

      const normalizedMeta = normalizeInventoryMeta(invMeta)

      const invName = handout.get('name')
      const characterName = invName.slice(invName.indexOf('(') + 1, invName.indexOf(')'))
      const character = getCharacterByName(characterName, player)

      if (!character) {
        whisperToPlayer(player, `No character by the name of <b>${characterName}</b> exists, skipping inventory update`)
        return
      }

      const totalWealth = getTotalWealth(normalizedMeta.inventory)
      const totalWeight = getTotalWeight(normalizedMeta.inventory)

      const updatedInventoryMetadata: IIMInventoryMetadata = {
        id: IIM_INVENTORY_IDENTIFIER,
        characterName: characterName,
        characterId: character ? character.id : 'unknown',
        handoutId: trimWhitespace(normalizedMeta.handoutId),
        totalWealth,
        totalWeight,
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
        handout.set('notes', InventoryTemplate(updatedInventoryMetadata))
        handout.set('gmnotes', JSON.stringify(updatedInventoryMetadata, null, 2))
      }, 0)
    })

    whisperToPlayer(player, `Updated ${allInventories.length} inventories`)
  })
}

export {
  updateAllInventories
}
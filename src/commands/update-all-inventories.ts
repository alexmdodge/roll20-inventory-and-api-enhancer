import { Roll20Object, IIMContext, Roll20ObjectType, IIMInventoryMetadata } from '../types'
import { whisperToPlayer, parseInventory, getCharacterByName } from '../helpers'
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

      const invName = handout.get('name')
      const characterName = invName.slice(invName.indexOf('(') + 1, invName.indexOf(')'))
      const character = getCharacterByName(characterName)

      const updatedInventoryMetadata: IIMInventoryMetadata = {
        id: IIM_INVENTORY_IDENTIFIER,
        characterId: character ? character.id : 'unknown',
        handoutId: invMeta.handoutId,
        totalWealth: {
          copper: '0',
          silver: '0',
          electrum: '0',
          gold: '0',
          platinum: '0'
        },
        totalWeight: '0',
        inventory: invMeta.inventory.map(itemMeta => ({
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
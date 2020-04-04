import { Roll20Object, IIMContext, IIMItemMetadata, Roll20ObjectType } from '../types'
import { whisperToPlayer, parseItem } from '../helpers'
import { ItemTemplate } from '../templates'
import { IIM_ITEM_IDENTIFIER, IIM_INVENTORY_IDENTIFIER } from '../constants'

function getAllItems(player: Roll20Object): Promise<{ handout: Roll20Object; itemMeta: IIMItemMetadata }[]> {
  const allHandouts = findObjs({
    type: Roll20ObjectType.Handout
  })

  const processingHandouts = allHandouts.map(handout => {
    return new Promise<{ handout: Roll20Object; itemMeta: IIMItemMetadata } | null>(resolve => {
      handout.get('gmnotes', metadata => {
        if (metadata.indexOf(IIM_ITEM_IDENTIFIER) === -1) {
          resolve(null)
          return
        }

        if (metadata.indexOf(IIM_INVENTORY_IDENTIFIER) > -1) {
          // We don't want to get inventories
          resolve(null)
          return
        }

        const itemMetadata = parseItem(metadata)

        // In the future perform any updates or transformations here
        if (!itemMetadata) {
          whisperToPlayer(player, `Error parsing data for item: ${handout.get('name')}`)
          resolve(null)
          return
        }

        resolve({
          itemMeta: itemMetadata,
          handout: handout
        })
      })
    })
  })

  return Promise.all(processingHandouts)
    .then(items => items.filter(item => item !== null))
}

function updateAllItems({ player }: IIMContext) {
  getAllItems(player).then(allItems => {
    whisperToPlayer(player, `Acting on items of length: ${allItems.length}`)
    allItems.forEach(({ handout, itemMeta }) => {
      const updatedItemMetadata: IIMItemMetadata = {
        id: IIM_ITEM_IDENTIFIER,
        handoutId: handout.id,
        item: itemMeta.item
      }

      // Ensure we don't get any stack errors
      setTimeout(() => {
        handout.set('notes', ItemTemplate(updatedItemMetadata))
        handout.set('gmnotes', JSON.stringify(updatedItemMetadata, null, 2))
      }, 0)
    })

    whisperToPlayer(player, `Updated ${allItems.length} items`)
  })
}

export {
  updateAllItems
}
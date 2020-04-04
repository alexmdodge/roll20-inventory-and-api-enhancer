import { Roll20Object, IIMContext, IIMItem, IIMItemMetadata, Roll20ObjectType } from '../types'
import { whisperToPlayer, parseItem, getItemDataById, getItemById } from '../helpers'
import { ItemTemplate } from '../templates'
import { IIM_ITEM_IDENTIFIER } from '../constants'
import { isUrl } from '../utils'

function getAllItems(player: Roll20Object): Promise<{ handout: Roll20Object; itemData: IIMItem }[]> {
  const allHandouts = findObjs({
    type: Roll20ObjectType.Handout
  })

  const processingHandouts = allHandouts.map(handout => {
    return new Promise<{ handout: Roll20Object; itemData: IIMItem } | null>(resolve => {
      handout.get('gmnotes', metadata => {
        if (metadata.indexOf(IIM_ITEM_IDENTIFIER) === -1) {
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
          itemData: itemMetadata.item,
          handout: handout
        })
      })
    })
  })

  return Promise.all(processingHandouts)
    .then(items => items.filter(item => item !== null))
}

function updateItem(context: IIMContext) {
  const { command, player } = context
  const commandOptions = command.options

  const data = commandOptions.split(/\s/g, 4)
  const itemId = data[0].trim()

  const itemHandout = getItemById(itemId)

  if (itemHandout === null) {
    whisperToPlayer(player, 'Item could not be found.')
    return
  }

  getItemDataById(itemId).then(itemMetadata => {
    if (!itemMetadata) {
      whisperToPlayer(player, `Unable to retrieve ${itemHandout.get('name')} data during update.`)
      return
    }

    const updatedItemNotes = ItemTemplate(itemMetadata)
    const updatedItemMetadata: IIMItemMetadata = {
      id: IIM_ITEM_IDENTIFIER,
      handoutId: itemMetadata.handoutId,
      item: itemMetadata.item
    }

    // Ensure we don't get any stack errors
    setTimeout(() => {
      itemHandout.set('notes', updatedItemNotes)
      itemHandout.set('gmnotes', JSON.stringify(updatedItemMetadata, null, 2))
    }, 0)

    const itemNameStyled = `<span style="font-weight:bold;">${itemMetadata.item.name}</span>`
    whisperToPlayer(player, `Updated information for ${itemNameStyled}`)
  })
}

function updateItemImage(context: IIMContext) {
  const { command, player } = context
  const commandOptions = command.options

  const data = commandOptions.split(/\s/g)
  const itemId = data[0].trim()
  const itemImageUrl = data[1].trim()

  if (!isUrl(itemImageUrl)) {
    whisperToPlayer(player, 'Image URL is invalid, skipping update.')
    return
  }

  const itemHandout = getItemById(itemId)

  if (itemHandout === null) {
    whisperToPlayer(player, 'Item could not be found.')
    return
  }

  getItemDataById(itemId).then(itemMetadata => {
    if (!itemMetadata) {
      whisperToPlayer(player, `Unable to retrieve ${itemHandout.get('name')} data during update.`)
      return
    }

    const updatedItemMetadata: IIMItemMetadata = {
      id: IIM_ITEM_IDENTIFIER,
      handoutId: itemMetadata.handoutId,
      item: itemMetadata.item
    }

    updatedItemMetadata.item.imageUrl = itemImageUrl

    // Ensure we don't get any stack errors
    setTimeout(() => {
      itemHandout.set('notes', ItemTemplate(updatedItemMetadata))
      itemHandout.set('gmnotes', JSON.stringify(updatedItemMetadata, null, 2))
    }, 0)

    const itemNameStyled = `<span style="font-weight:bold;">${itemMetadata.item.name}</span>`
    whisperToPlayer(player, `Updated information for ${itemNameStyled}`)
  })
}

function updateItemDescription(context: IIMContext) {
  const { command, player } = context
  const commandOptions = command.options

  const data = commandOptions.split(/\s/g, 1)
  const itemId = data[0].trim()
  const itemDescription = commandOptions.slice(itemId.length + 1)

  if (!playerIsGM(player.id)) {
    whisperToPlayer(player, 'You must be the GM to update the description.')
    return
  }

  const itemHandout = getItemById(itemId)

  if (itemHandout === null) {
    whisperToPlayer(player, 'Item could not be found.')
    return
  }

  getItemDataById(itemId).then(itemMetadata => {
    if (!itemMetadata) {
      whisperToPlayer(player, `Unable to retrieve ${itemHandout.get('name')} data during update.`)
      return
    }

    const updatedItemMetadata: IIMItemMetadata = {
      id: IIM_ITEM_IDENTIFIER,
      handoutId: itemMetadata.handoutId,
      item: itemMetadata.item
    }

    const prevDesc = updatedItemMetadata.item.description
    const isDescriptionEmpty = prevDesc.length < 1
    const textDivider = isDescriptionEmpty ? '' : '<br><br>'
    updatedItemMetadata.item.description = `${prevDesc}${textDivider}${itemDescription}`

    // Ensure we don't get any stack errors
    setTimeout(() => {
      itemHandout.set('notes', ItemTemplate(updatedItemMetadata))
      itemHandout.set('gmnotes', JSON.stringify(updatedItemMetadata, null, 2))
    }, 0)

    const itemNameStyled = `<span style="font-weight:bold;">${itemMetadata.item.name}</span>`
    whisperToPlayer(player, `Updated description for ${itemNameStyled}`)
  })
}

function updateItemCommandTemplate(itemHandoutId: string): string {
  return [
    '!iim',
    'update-item',
    itemHandoutId
  ].join(' ')
}

function updateItemImageCommandTemplate(itemHandoutId: string): string {
  return [
    '!iim',
    'update-item-image',
    itemHandoutId,
    '?{Image URL}'
  ].join(' ')
}

function updateItemDescCommandTemplate(itemHandoutId: string): string {
  return [
    '!iim',
    'update-item-description',
    itemHandoutId,
    '?{Item Description}'
  ].join(' ')
}

export {
  updateItem,
  updateItemImage,
  updateItemDescription,
  updateItemCommandTemplate,
  updateItemImageCommandTemplate,
  updateItemDescCommandTemplate
}
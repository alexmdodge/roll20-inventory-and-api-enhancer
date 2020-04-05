import { IIMContext, IIMItemMetadata } from '../types'
import { whisperToPlayer, getItemDataById, getItemById, getCommandTextAfter } from '../helpers'
import { ItemTemplate } from '../templates'
import { IIM_ITEM_IDENTIFIER } from '../constants'
import { isUrl } from '../utils'

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

  const [ itemId ] = commandOptions.split(/\s/g)
  let itemImageUrl: string | null = getCommandTextAfter(itemId, commandOptions)

  if (!isUrl(itemImageUrl)) {
    whisperToPlayer(player, 'Image URL is invalid, setting as empty.')
    itemImageUrl = null
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
  const itemDescription = getCommandTextAfter(itemId, commandOptions)

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
    const textDivider = isDescriptionEmpty ? '' : '<br>'
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
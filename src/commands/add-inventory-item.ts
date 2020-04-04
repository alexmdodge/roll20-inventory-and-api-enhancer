import { IIM_INVENTORY_IDENTIFIER } from '../constants'
import {
  Roll20Object,
  IIMContext,
  IIMInventoryMetadata,
  IIMItemMetadata,
  IIMInvItemMetadata,
  IIMInventoryItemUpdateType
} from '../types'
import {
  whisperToPlayer,
  getCharacterByName,
  getInventoryByCharacter,
  getInventoryById,
  parseInventory,
  getItemDataById,
  sayAsPlayer,
  handoutLink
} from '../helpers'
import { InventoryTemplate } from '../templates'

function updateInventoryWithItem(
  current: IIMInvItemMetadata[],
  itemMeta: IIMItemMetadata,
  itemAmount: string,
  price?: string
): IIMInvItemMetadata[] {
  let newInventory = [...current]
  let itemExists = false

  newInventory = newInventory.map(currentItemMeta => {
    if (currentItemMeta.item.name === itemMeta.item.name) {
      itemExists = true
      const currentAmount = parseInt(currentItemMeta.amount, 10)
      const newAmount = parseInt(itemAmount, 10)

      const finalAmount = Math.max(0, currentAmount + newAmount)
      currentItemMeta.amount = `${finalAmount}`

      if (price) {
        currentItemMeta.item.price = price
      }

      currentItemMeta.item.weight = itemMeta.item.weight
    }

    return currentItemMeta
  })

  if (!itemExists) {
    const itemWithPrice = price ? { price } : {}

    const newItem: IIMInvItemMetadata = {
      id: itemMeta.id,
      handoutId: itemMeta.handoutId,
      amount: itemAmount,
      item: {
        ...itemMeta.item,
        ...itemWithPrice
      }
    }
    newInventory.push(newItem)
  }

  newInventory.sort((currentItem, nextItem) => {
    const currentName = currentItem?.item?.name.toLowerCase()
    const nextName = nextItem?.item?.name.toLowerCase()
    if(currentName < nextName ) { return -1 }
    if(currentName > nextName) { return 1 }
    return 0
  })

  return newInventory
}

function addInventoryItem(context: IIMContext) {
  const { command, player } = context
  const commandOptions = command.options

  const data = commandOptions.split(/\s/g, 4)
  const characterName = data[0].trim()
  const isPriceShowing = data[1].trim() === 'yes'
  const itemAmount = data[2].trim()
  const itemId = data[3].trim()
  const itemName = commandOptions.slice(commandOptions.indexOf(itemId) + itemId.length + 1)
  const isPlayerGm = playerIsGM(player.id)

  const character = getCharacterByName(characterName)
  
  if (character === null) {
    whisperToPlayer(player, `Character of name <b>${characterName}</b> doesn't exist`)
    return
  }
  
  const inventory = getInventoryByCharacter(character)
  
  if (inventory === null) {
    whisperToPlayer(player, `Inventory could not be found for <b>${characterName}</b>`)
    return
  }

  if (inventory === null) {
    whisperToPlayer(player, `Error retrieving ${itemName} from the Roll20 Journal`)
    return
  }

  inventory.get('gmnotes', inventoryMetadata => {
    const currentInventoryMetadata: IIMInventoryMetadata | null = parseInventory(inventoryMetadata)
  
    if (currentInventoryMetadata === null) {
      whisperToPlayer(player, `Error parsing the inventory for <b>${characterName}</b>`)
      return
    }

    const currentInventoryItems = currentInventoryMetadata.inventory

    if (currentInventoryItems === null) {
      whisperToPlayer(player, 'Error while retrieving inventory, no items are present, inventory may be corrupted')
    }

    getItemDataById(itemId).then(itemMetadata => {
      if (!itemMetadata) {
        whisperToPlayer(player, `Unable to retrieve item data for ${itemName}`)
        return
      }

      // Only allow the GM to override price display settings
      let gmPriceOverride: string | undefined = undefined

      if (isPlayerGm) {
        gmPriceOverride = isPriceShowing ? itemMetadata.item.price : '---'
      }

      const newInventory: IIMInvItemMetadata[] = updateInventoryWithItem(
        currentInventoryItems,
        itemMetadata,
        itemAmount,
        gmPriceOverride
      )
  
      const newInventoryMetadata: IIMInventoryMetadata = {
        id: IIM_INVENTORY_IDENTIFIER,
        handoutId: currentInventoryMetadata.handoutId,
        inventory: newInventory
      }

      setTimeout(() => {
        inventory.set('notes', InventoryTemplate(newInventoryMetadata))
        inventory.set('gmnotes', JSON.stringify(newInventoryMetadata, null, 2))
  
        const inventoryHandoutLink = `<b><a href="http://journal.roll20.net/handout/${inventory.id}">${characterName}'s Inventory</a></b>`
        const itemNameStyled = `<span style="color:darkgreen;font-weight:bold;">${itemName}</span>`
        const itemAmountStyled = `<span style="color:darkgoldenrod;font-weight:bold;">${itemAmount}</span>`
        sayAsPlayer(player, `[${itemAmountStyled}] ${itemNameStyled} was added to ${inventoryHandoutLink}.`)
      }, 0)
    })
  })
}

function updateInventoryItem(context: IIMContext) {
  const { command, player } = context
  const commandOptions = command.options

  const data = commandOptions.split(/\s/g)
  const updateType: IIMInventoryItemUpdateType = data[0].trim() === 'add'
    ? IIMInventoryItemUpdateType.Add
    : IIMInventoryItemUpdateType.Remove
  const origItemAmount = data[1].trim()
  const itemAmount = updateType === IIMInventoryItemUpdateType.Add
    ? `${origItemAmount}`
    : `-${origItemAmount}`
  const inventoryHandoutId = data[2].trim()
  const itemHandoutId = data[3].trim()

  const inventory = getInventoryById(inventoryHandoutId)
  
  if (inventory === null) {
    whisperToPlayer(player, 'Inventory could not be found when attempting item update')
    return
  }

  inventory.get('gmnotes', inventoryMetadata => {
    const currentInventoryMetadata: IIMInventoryMetadata | null = parseInventory(inventoryMetadata)
  
    if (currentInventoryMetadata === null) {
      whisperToPlayer(player, 'Error parsing the inventory for an item update')
      return
    }

    const currentInventoryItems = currentInventoryMetadata.inventory

    if (currentInventoryItems === null) {
      whisperToPlayer(player, 'Error while retrieving inventory, no items are present, inventory may be corrupted')
    }

    getItemDataById(itemHandoutId).then(itemMetadata => {
      if (!itemMetadata) {
        whisperToPlayer(player, 'Unable to retrieve item data for inventory update')
        return
      }

      const newInventory: IIMInvItemMetadata[] = updateInventoryWithItem(
        currentInventoryItems,
        itemMetadata,
        itemAmount
      )
  
      const newInventoryMetadata: IIMInventoryMetadata = {
        id: IIM_INVENTORY_IDENTIFIER,
        handoutId: currentInventoryMetadata.handoutId,
        inventory: newInventory
      }

      setTimeout(() => {
        inventory.set('notes', InventoryTemplate(newInventoryMetadata))
        inventory.set('gmnotes', JSON.stringify(newInventoryMetadata, null, 2))
        
        const inventoryHandoutLink = `<b><a href="${handoutLink(inventory.id)}">${inventory.get('name')}</a></b>`
        const itemHandoutLink = `<a style="color:darkgreen;" href="${handoutLink(itemHandoutId)}">${itemMetadata.item.name}</a>`
        const itemNameStyled = `<span style="font-weight:bold;">${itemHandoutLink}</span>`
        const itemAmountStyled = `<span style="color:darkgoldenrod;font-weight:bold;">${origItemAmount}</span>`

        const updatePrefix = updateType === IIMInventoryItemUpdateType.Add
          ? 'Added'
          : 'Removed'
        const updatePreposition = updateType === IIMInventoryItemUpdateType.Add
          ? 'to'
          : 'from'
        sayAsPlayer(player, `${updatePrefix} [${itemAmountStyled}] ${itemNameStyled} ${updatePreposition} ${inventoryHandoutLink}`)
      }, 0)
    })
  })
}

function deleteInventoryItem(context: IIMContext) {
  const { command, player } = context
  const commandOptions = command.options

  const data = commandOptions.split(/\s/g)
  const inventoryHandoutId = data[0].trim()
  const itemHandoutId = data[1].trim()

  const inventory = getInventoryById(inventoryHandoutId)
  
  if (inventory === null) {
    whisperToPlayer(player, 'Inventory could not be found when attempting item update')
    return
  }

  inventory.get('gmnotes', inventoryMetadata => {
    const currentInventoryMetadata: IIMInventoryMetadata | null = parseInventory(inventoryMetadata)
  
    if (currentInventoryMetadata === null) {
      whisperToPlayer(player, 'Error parsing the inventory for an item update')
      return
    }

    const currentInventoryItems = currentInventoryMetadata.inventory

    if (currentInventoryItems === null) {
      whisperToPlayer(player, 'Error while retrieving inventory, no items are present, inventory may be corrupted')
    }

    let itemToRemove = 'Unknown'
    const newInventoryItems = currentInventoryItems.filter(itemMeta => {
      if (itemMeta.handoutId === itemHandoutId) {
        itemToRemove = itemMeta.item.name
        return false
      } else {
        return true
      }
    })
    currentInventoryMetadata.inventory = newInventoryItems

    setTimeout(() => {
      inventory.set('notes', InventoryTemplate(currentInventoryMetadata))
      inventory.set('gmnotes', JSON.stringify(currentInventoryMetadata, null, 2))
      
      const inventoryHandoutLink = `<b><a href="${handoutLink(inventory.id)}">${inventory.get('name')}</a></b>`
      const itemHandoutLink = `<a style="color:darkgreen;" href="${handoutLink(itemHandoutId)}">${itemToRemove}</a>`
      const itemNameStyled = `<span style="font-weight:bold;">${itemHandoutLink}</span>`

      sayAsPlayer(player, `${itemNameStyled} was cleared from ${inventoryHandoutLink}`)
    }, 0)
  })
}

function addItemToInventoryCommandTemplate(handoutId: string, name: string): string {
  return [
    '!iim',
    'add-inventory-item',
    '?{Character Name}',
    '?{Show Price|Yes,yes|No,no}',
    '?{Number to Add}',
    handoutId,
    name
  ].join(' ')
}

function updateInventoryItemCommandTemplate(inventoryHandoutId: string, itemHandoutId: string): string {
  return [
    '!iim',
    'update-inventory-item',
    '?{Add or Remove|Add,add|Remove,remove}',
    '?{Amount}',
    inventoryHandoutId,
    itemHandoutId
  ].join(' ')
}

function deleteInventoryItemCommandTemplate(inventoryHandoutId: string, itemHandoutId: string): string {
  return [
    '!iim',
    'delete-inventory-item',
    inventoryHandoutId,
    itemHandoutId
  ].join(' ')
}

export {
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  addItemToInventoryCommandTemplate,
  updateInventoryItemCommandTemplate,
  deleteInventoryItemCommandTemplate
}
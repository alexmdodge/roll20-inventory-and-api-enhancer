import { IIM_INVENTORY_IDENTIFIER } from '../constants'
import {
  IIMContext,
  IIMInventoryMetadata,
  IIMItemMetadata,
  IIMInvItemMetadata,
  IIMInventoryItemUpdateType,
  Roll20Object
} from '../types'
import {
  whisperToPlayer,
  getCharacterByName,
  getInventoryByCharacter,
  getInventoryById,
  parseInventory,
  getItemDataById,
  sayAsPlayer,
  handoutLink,
  getCommandTextAfter,
  getTotalWealth,
  getTotalWeight
} from '../helpers'
import { InventoryTemplate } from '../templates'

function updateInventoryWithItem(
  current: IIMInvItemMetadata[],
  itemMeta: IIMItemMetadata,
  itemAmount: string,
  player: Roll20Object,
  price?: string,
): IIMInvItemMetadata[] {
  let newInventory = [...current]
  let itemExists = false
  let itemUpdated = false

  newInventory = newInventory.map(currentItemMeta => {
    const isSameId = currentItemMeta.handoutId === itemMeta.handoutId
    
    // Update purely based on ID in the table
    if (isSameId) {
      if (itemUpdated) {
        whisperToPlayer(player, `Duplicate of ${itemMeta.item.name} detected, removing from inventory`)
        return null
      }
      itemExists = true

      const currentAmount = parseInt(currentItemMeta.amount, 10)
      const newAmount = parseInt(itemAmount, 10)
  
      if (Number.isNaN(currentAmount) || Number.isNaN(newAmount)) {
        whisperToPlayer(player, 'Incorrect amount passed, unable to update')
      } else {
        const finalAmount = Math.max(0, currentAmount + newAmount)
        currentItemMeta.amount = `${finalAmount}`
      }

      if (price) {
        currentItemMeta.item.price = price
      }

      currentItemMeta.item.name = itemMeta.item.name
      currentItemMeta.item.weight = itemMeta.item.weight
      currentItemMeta.item.imageUrl = itemMeta.item.imageUrl

      itemUpdated = true
    }

    return currentItemMeta
  }).filter(item => item !== null)

  if (!itemExists) {
    const itemWithPrice = price ? { price } : {}

    const newItem: IIMInvItemMetadata = {
      id: itemMeta.id,
      handoutId: itemMeta.handoutId,
      amount: itemAmount,
      item: {
        ...itemMeta.item,
        ...itemWithPrice,

        // Need to override description to prevent rendering errors in the future
        // and description isn't metadata that's needed and can always be
        // retrieved
        description: ''
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

  const character = getCharacterByName(characterName, player)
  
  if (!character) {
    whisperToPlayer(player, `Character of name <b>${characterName}</b> doesn't exist`)
    return
  }
  
  const inventory = getInventoryByCharacter(character, player)
  
  if (inventory === null) {
    whisperToPlayer(player, `Inventory could not be found for <b>${characterName}</b>`)
    return
  }

  if (itemName === null) {
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
      let gmPriceOverride = '---'

      if (isPlayerGm) {
        gmPriceOverride = isPriceShowing ? itemMetadata.item.price : '---'
      }

      const newInventory: IIMInvItemMetadata[] = updateInventoryWithItem(
        currentInventoryItems,
        itemMetadata,
        itemAmount,
        player,
        gmPriceOverride,
      )
  
      const newInventoryMetadata: IIMInventoryMetadata = {
        id: IIM_INVENTORY_IDENTIFIER,
        characterName: currentInventoryMetadata.characterName,
        characterId: currentInventoryMetadata.characterId,
        handoutId: currentInventoryMetadata.handoutId,
        totalWealth: getTotalWealth(newInventory),
        totalWeight: getTotalWeight(newInventory),
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
  const charName = data[2].trim()
  const itemHandoutId = data[3].trim()

  const character = getCharacterByName(charName, player)

  if (!character) {
    whisperToPlayer(player, `Character by the name [${charName}] could not be found`)
    return
  }

  const inventory = getInventoryByCharacter(character, player)
  
  if (inventory === null) {
    whisperToPlayer(player, `Inventory could not be found for [${charName}] when attempting item update`)
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
        itemAmount,
        player
      )
  
      const newInventoryMetadata: IIMInventoryMetadata = {
        id: IIM_INVENTORY_IDENTIFIER,
        characterName: currentInventoryMetadata.characterName,
        characterId: currentInventoryMetadata.characterId,
        handoutId: currentInventoryMetadata.handoutId,
        totalWealth: getTotalWealth(newInventory),
        totalWeight: getTotalWeight(newInventory),
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
  const charName = data[0].trim()
  const itemName = getCommandTextAfter(charName, commandOptions)

  const character = getCharacterByName(charName, player)

  if (!character) {
    whisperToPlayer(player, `Character by the name [${charName}] could not be found`)
    return
  }

  const inventory = getInventoryByCharacter(character, player)
  
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

    const newInventoryItems = currentInventoryItems.filter(itemMeta => {
      return itemMeta.item.name !== itemName
    })

    currentInventoryMetadata.inventory = newInventoryItems

    setTimeout(() => {
      inventory.set('notes', InventoryTemplate(currentInventoryMetadata))
      inventory.set('gmnotes', JSON.stringify(currentInventoryMetadata, null, 2))
      
      const inventoryHandoutLink = `<b><a href="${handoutLink(inventory.id)}">${inventory.get('name')}</a></b>`
      const itemHandoutLink = `<span style="color:darkgreen;font-weight:bold">${itemName}</span>`
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

function updateInventoryItemCommandTemplate(charName: string, itemHandoutId: string): string {
  return [
    '!iim',
    'update-inventory-item',
    '?{Add or Remove|Add,add|Remove,remove}',
    '?{Amount}',
    charName,
    itemHandoutId
  ].join(' ')
}

function deleteInventoryItemCommandTemplate(charName: string, itemName: string): string {
  return [
    '!iim',
    'delete-inventory-item',
    charName,
    itemName
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
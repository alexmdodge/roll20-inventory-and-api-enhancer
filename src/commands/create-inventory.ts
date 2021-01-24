import { IIM_INVENTORY_IDENTIFIER, IIM_ITEM_IDENTIFIER } from '../constants'
import {
  Roll20ObjectType,
  Roll20Object,
  IIMContext,
  IIMInventoryMetadata,
  IIMInvItemMetadata
} from '../types'
import { whisperToPlayer, getCharacterByName, getInventoryByCharacter } from '../helpers'
import { InventoryTemplate } from '../templates'

function createNewInventory(player: Roll20Object, character: Roll20Object) {
  const charName = character.get('name')
  const inventoryName = `Inventory (${charName})`
  const inventoryHandout = createObj(Roll20ObjectType.Handout, {
    name: inventoryName
  })

  const defaultInventoryData: IIMInvItemMetadata[] = [
    {
      id: IIM_ITEM_IDENTIFIER,
      handoutId: null,
      amount: '---',
      item: {
        name: '---',
        source: '---',
        rarity: '---',
        type: '---',
        properties: '---',
        attunement: '---',
        weight: '---',
        imageUrl: '---',
        price: '---',
        description: ''
      }
    }
  ]

  const inventoryMetadata: IIMInventoryMetadata = {
    id: IIM_INVENTORY_IDENTIFIER,
    totalWealth: {
      copper: '0',
      silver: '0',
      electrum: '0',
      gold: '0',
      platinum: '0'
    },
    totalWeight: '0',
    characterName: charName,
    characterId: character.id,
    handoutId: inventoryHandout.id,
    inventory: defaultInventoryData
  } 

  inventoryHandout.set('notes', InventoryTemplate(inventoryMetadata))
  inventoryHandout.set('gmnotes', JSON.stringify(inventoryMetadata, null, 2))

  const inventoryHandoutLink = `<b><a href="http://journal.roll20.net/handout/${inventoryHandout.id}">${inventoryName}</a></b>`
  whisperToPlayer(player, `Created new inventory: ${inventoryHandoutLink}`)
}

function createInventoryForCharacter(player: Roll20Object, characterName: string) {
  const character = getCharacterByName(characterName, player)

  if (character === null) {
    whisperToPlayer(player, `Character of name <b>${characterName}</b> doesn't exist`)
    return
  }

  const potentialInventory = getInventoryByCharacter(character, player)

  if (potentialInventory) {
    const link = `<a href="http://journal.roll20.net/handout/${potentialInventory.id}">${characterName}</a>`
    whisperToPlayer(player, `Inventory already exists for <b>${link}</b>`)
    return
  }

  createNewInventory(player, character)
}

function createInventory(context: IIMContext) {
  const { command, player } = context
  const commandOptions = command.options

  const characterName = commandOptions.trim()

  if (characterName.length === 0) {
    whisperToPlayer(
      player,
      'Character name must be provided after command <pre>!iim create-inventory My Character Name</pre>'
    )
  } else {
    createInventoryForCharacter(player, characterName)
  }
}

export {
  createInventory
}
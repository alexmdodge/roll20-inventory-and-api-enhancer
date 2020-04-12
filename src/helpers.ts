import {
  Roll20Message,
  Roll20ObjectType,
  Roll20Object,
  IIMContext,
  Roll20JournalObjectAttributes,
  IIMInventoryMetadata,
  IIMItemMetadata,
  IIMInvItemMetadata,
  IIMInventoryCoins
} from './types'

declare global {
  function log(message: string): void;
  function on(event: 'ready', cb: () => void): void;
  function on(event: 'chat:message', cb: (data: Roll20Message) => void): void;
  function getObj(type: Roll20ObjectType, id: string): Roll20Object;
  function findObjs(attributes: { type?: Roll20ObjectType; name?: string; characterid?: string }): Roll20Object[];
  function createObj(
    type: Roll20ObjectType.Character | Roll20ObjectType.Handout,
    attributes: Roll20JournalObjectAttributes
  ): Roll20Object;
  function sendChat(speakAs: string, message: string): void;
  function playerIsGM(playerId: string): boolean;
  function getAttrByName(charId: string, attribute: string): string | null;
}

export function whisperToPlayer(player: Roll20Object, msg) {
  const displayName = player.get('displayname')
  sendChat('', `/w "${displayName}" ${msg}`)
}

export function sayAsPlayer(player: Roll20Object, msg) {
  sendChat(player.get('displayname'), msg)
}

export function parseChatMessage(message: Roll20Message): IIMContext {
  const { playerid, type, content } = message

  const commandArgs = content.split(/\s/g)

  const id = commandArgs[0].trim()

  const trigger = commandArgs.length > 1
    ? commandArgs[1].trim()
    : 'unknown'

  let options = ''
  if (commandArgs.length > 2) {
    const optionStart = content.indexOf(trigger) + trigger.length + 1
    options = content.slice(optionStart)
  }

  const player = getObj(Roll20ObjectType.Player, playerid)

  return {
    type,
    player,
    command: { id, trigger, options }
  }
}

export function getHandoutsByName(handoutName: string): Roll20Object[] {
  return findObjs({
    type: Roll20ObjectType.Handout,
    name: handoutName
  })
}

export function getCharacterByName(characterName: string): Roll20Object | null {
  const characters = findObjs({
    type: Roll20ObjectType.Character,
    name: characterName
  })

  if (!characters) {
    return null
  } else if (characters.length === 0) {
    return null
  } else if (characters.length > 0) {
    return characters[0]
  }
}

export function getCharacterById(id: string): Roll20Object | null {
  const character = getObj(Roll20ObjectType.Character, id)

  if (!character) {
    return null
  } else {
    return character
  }
}

export function getInventoryByCharacter(character: Roll20Object): Roll20Object | null {
  const inventory = findObjs({
    type: Roll20ObjectType.Handout,
    name: `Inventory (${character.get('name')})`
  })

  if (!inventory) {
    return null
  } else if (inventory.length === 0) {
    return null
  } else if (inventory.length > 0) {
    return inventory[0]
  }
}

export function getCharacterAttribute(id: string, name: string): Roll20Object {
  const attribute = findObjs({
    type: Roll20ObjectType.Attribute,
    characterid: id,
    name
  })

  if (!attribute) {
    return null
  } else if (attribute.length === 0) {
    return null
  } else if (attribute.length > 0) {
    return attribute[0]
  }
}

export function getInventoryById(id: string): Roll20Object | null {
  const inventory = getObj(Roll20ObjectType.Handout, id)

  if (!inventory) {
    return null
  } else {
    return inventory
  }
}

export function getItemById(id: string): Roll20Object | null {
  const item = getObj(Roll20ObjectType.Handout, id)

  if (!item) {
    return null
  } else {
    return item
  }
}

export function handoutLink(id: string): string {
  return `http://journal.roll20.net/handout/${id}`
}

export function parseInventory(invStr: string): IIMInventoryMetadata | null {
  let data = null
  
  try {
    data = JSON.parse(invStr)
  } catch(e) {
    // Error parsing
    log(`Error while parsing: ${e}`)
  }

  return data
}

export function parseItem(itemStr: string): IIMItemMetadata | null {
  let data = null

  // If the string contains a user script, we need to clear it
  let normalizedItemStr = itemStr
  if (itemStr.indexOf('userscript') > -1) {
    const userscriptRegex = /class="userscript-\\"/g
    normalizedItemStr = normalizedItemStr.replace(userscriptRegex, '')

    const hrefRegex = /href="\\"/g
    normalizedItemStr = normalizedItemStr.replace(hrefRegex, '')
  }
  
  try {
    data = JSON.parse(normalizedItemStr)
  } catch(e) {
    // Error parsing
    log(itemStr)
    log(`Error while processing item: ${e}`)
  }

  return data
}

export function splitOption(option: string): string {
  if (option.indexOf('-') > -1) {
    return option.split('-').join(' ')
  } else {
    return option
  }
}

export function mapItemTypeToImage(nameStr: string, typeStr: string) {
  const itemType = typeStr.toLowerCase()
  const nameBackup = nameStr.toLowerCase()

  const potentialTypesMap = {
    'ammunition': 'https://media-waterdeep.cursecdn.com/attachments/2/664/weapon.jpg',
    'amulet': 'https://media-waterdeep.cursecdn.com/attachments/2/668/ring.jpg',
    'ring': 'https://media-waterdeep.cursecdn.com/attachments/2/668/ring.jpg',
    'poison': 'https://media-waterdeep.cursecdn.com/attachments/2/667/potion.jpg',
    'flask': 'https://media-waterdeep.cursecdn.com/attachments/2/667/potion.jpg',
    'vial': 'https://media-waterdeep.cursecdn.com/attachments/2/667/potion.jpg',
    'rod': 'https://media-waterdeep.cursecdn.com/attachments/2/669/rod.jpg',
    'potion': 'https://media-waterdeep.cursecdn.com/attachments/2/667/potion.jpg',
    'scroll': 'https://media-waterdeep.cursecdn.com/attachments/2/661/scroll.jpg',
    'staff': 'https://media-waterdeep.cursecdn.com/attachments/2/662/staff.jpg',
    'gem': 'https://s3.amazonaws.com/files.d20.io/images/110741951/UuFYyw-c7HOq7CN-usZajw/max.jpg?1584900078',
    'wand': 'https://media-waterdeep.cursecdn.com/attachments/2/663/wand.jpg',
    'weapon': 'https://media-waterdeep.cursecdn.com/attachments/2/664/weapon.jpg',
    'belt': 'https://media-waterdeep.cursecdn.com/attachments/2/666/armor.jpg',
    'shield': 'https://media-waterdeep.cursecdn.com/attachments/2/666/armor.jpg',
    'armor': 'https://media-waterdeep.cursecdn.com/attachments/2/666/armor.jpg',
    'armour': 'https://media-waterdeep.cursecdn.com/attachments/2/666/armor.jpg',
    'wondrous': 'https://media-waterdeep.cursecdn.com/attachments/2/665/wondrousitem.jpg'
  }

  let imageUrl = null

  Object.keys(potentialTypesMap).forEach(potentialType => {
    if (itemType.indexOf(potentialType) > -1) {
      imageUrl = potentialTypesMap[potentialType]
    } else if (nameBackup.indexOf(potentialType) > -1) {
      imageUrl = potentialTypesMap[potentialType]
    }
  })

  return imageUrl
}

export function getItemDataById(id: string): Promise<IIMItemMetadata | null> {
  return new Promise(resolve => {
    const item = getItemById(id)

    if (!item) {
      resolve(null)
      return
    }

    item.get('gmnotes', data => {
      const itemMetadata = parseItem(data)

      if (!itemMetadata) {
        resolve(null)
        return
      }

      resolve(itemMetadata)
    })
  })
}

export type InventoryDataResult = {
  meta: IIMInventoryMetadata;
  handout: Roll20Object;
}

export function getInventoryDataById(id: string): Promise<InventoryDataResult | null> {
  return new Promise(resolve => {
    const inventory = getInventoryById(id)

    if (!inventory) {
      resolve(null)
      return
    }

    inventory.get('gmnotes', data => {
      const inventoryMetadata = parseInventory(data)

      if (!inventoryMetadata) {
        resolve(null)
        return
      }

      resolve({
        meta: inventoryMetadata,
        handout: inventory
      })
    })
  })
}

/**
 * Assuming a pattern that a space will always follow whatever
 * text is provided, then it will return the remaining text in
 * a provided command.
 */
export function getCommandTextAfter(matcher: string, command: string): string {
  return command.slice(command.indexOf(matcher) + matcher.length + 1)
}

export function getCharacterCarryWeight(characterId: string, currentWeight: string): string {
  // Default strength to 10
  const strengthAttr = getCharacterAttribute(characterId, 'strength')

  const strengthStr = strengthAttr ? strengthAttr.get('current') : '10'
  let strength = 10
  
  try {
    strength = parseInt(strengthStr, 10)
  } catch(e) {
    // Error parsing, keeping default strength value
  }

  // Default rules for determining carry weight
  const defaultCarryMod = 15
  const totalCarryWeight = strength * defaultCarryMod

  const currentWeightAmount = parseInt(currentWeight, 10)
  let encumbered = ''

  if (!Number.isNaN(currentWeightAmount)) {
    encumbered = currentWeightAmount > totalCarryWeight ? '[<b>Encumbered</b>]' : ''
  }

  return `${currentWeight} / ${totalCarryWeight} ${encumbered} (<b>STR ${strength}</b>)`
}

export function getTotalWealth(inventory: IIMInvItemMetadata[]): IIMInventoryCoins {
  const totalWealth = {
    copper: 0,
    silver: 0,
    electrum: 0,
    gold: 0,
    platinum: 0
  }

  const coinMatchers = {
    copper: [ 'cp', 'copper' ],
    silver: [ 'sp', 'silver' ],
    electrum: [ 'ep', 'electrum' ],
    gold: [ 'gp', 'gold' ],
    platinum: [ 'pp', 'platinum' ]
  }

  for (const itemMeta of inventory) {
    const { amount, item: itemData } = itemMeta
    const { price } = itemData

    Object.keys(coinMatchers).forEach(coinKey => {
      const matchPositions = coinMatchers[coinKey]
        .map(key => price.indexOf(key))
        .filter(pos => pos > -1)

      const identifierPosition = matchPositions.length === 1
        ? matchPositions[0]
        : null
      
      const isValidAmount = !!identifierPosition

      if (!isValidAmount) { return } /* Not a valid amount identifier */

      // Ensure that no whitespace or commas exist
      const amountStr = price.slice(0, identifierPosition).replace(/,/g, '').trim()

      const floatRegex = /^\d+(\.\d+)?$/g
      const isFloat = floatRegex.test(amountStr)

      if (!isFloat) { return } /* Not a valid float for parsing */

      const parsedPrice = parseFloat(amountStr)
      let itemAmount = parseInt(amount, 10)
      
      if (Number.isNaN(parsedPrice)) { return } /* Error while parsing the amount */
      
      itemAmount = Number.isNaN(itemAmount) ? 1 : itemAmount
      const previousPrice = totalWealth[coinKey]
      totalWealth[coinKey] = Math.round(previousPrice + (parsedPrice * itemAmount))
    })
  }

  const totalWealthStrings: IIMInventoryCoins = {
    copper: '0',
    silver: '0',
    electrum: '0',
    gold: '0',
    platinum: '0'
  }
  Object.keys(totalWealth).forEach(coinKey => {
    totalWealthStrings[coinKey] = `${totalWealth[coinKey]}`
  })

  return totalWealthStrings
}

export function getTotalWeight(inventory: IIMInvItemMetadata[]): string {
  let totalWeight = 0

  for (const itemMeta of inventory) {
    const { amount } = itemMeta
    const { weight } = itemMeta.item

    const weightMatchers = [ 'lb', 'pound' ]

    const weightMatchPositions = weightMatchers
      .map(key => weight.indexOf(key))
      .filter(pos => pos > -1)

    const identifierPosition: number | null = weightMatchPositions.length === 1
      ? weightMatchPositions[0]
      : null

    const isWeight = !!identifierPosition

    if (!isWeight) { continue } /* Not a valid weight identifier */

    const weightStr = weight.slice(0, identifierPosition)
    const parsedWeight = parseFloat(weightStr)

    let itemAmount = parseInt(amount, 10)
      
    if (Number.isNaN(parsedWeight)) { return } /* Error while parsing the amount */
      
    itemAmount = Number.isNaN(itemAmount) ? 1 : itemAmount
    totalWeight = totalWeight + (parsedWeight * itemAmount)
  }

  totalWeight = Math.round(totalWeight)
  return `${totalWeight}`
}

export function trimWhitespace(value: string): string {
  return value.replace(/\s/g, '')
}

/**
 * Sometimes property keys can become corrupted, all whitespace needs to be removed
 * from handout ids, as well as keys of properties
 * @param invMeta Metadata that needs to be normalized
 */
export function normalizeInventoryMeta(invMeta: IIMInventoryMetadata): IIMInventoryMetadata {
  const normalizeKeys = (target: any, source: any) => {
    Object.keys(source).forEach(key => {
      const value = source[key]
      const normalizedKey = trimWhitespace(key)
  
      target[normalizedKey] = value 
    })

    return target
  }

  const topLevelNormalized: any = normalizeKeys({}, invMeta)
  topLevelNormalized.handoutId = trimWhitespace(topLevelNormalized.handoutId)
  topLevelNormalized['characterId'] = trimWhitespace(topLevelNormalized.characterId ?? '')

  const inventory = topLevelNormalized.inventory.map(itemMeta => {
    const normalizedItemMeta = normalizeKeys({}, itemMeta)

    normalizedItemMeta.handoutId = normalizedItemMeta.handoutId !== null
      ? trimWhitespace(normalizedItemMeta.handoutId)
      : null
    const normalizedItem = normalizeKeys({}, normalizedItemMeta.item)

    return {
      ...normalizedItemMeta,
      item: normalizedItem
    }
  })

  const normalizedInventory: IIMInventoryMetadata = {
    ...topLevelNormalized,
    inventory
  }

  return normalizedInventory
}
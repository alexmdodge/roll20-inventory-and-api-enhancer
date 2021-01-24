import {
  Roll20ObjectType,
  IIMContext,
  IIMItem,
  Roll20Object,
  IIMItemMetadata
} from '../types'
import { whisperToPlayer, splitOption, mapItemTypeToImage, parseItem, handoutLink, sayAsPlayer } from '../helpers'
import { ItemTemplate } from '../templates'
import { IIM_ITEM_IDENTIFIER } from '../constants'

function createNewItem(player: Roll20Object, itemData: IIMItem) {
  const handout = createObj(Roll20ObjectType.Handout, {
    name: itemData.name
  })

  const itemMetadata: IIMItemMetadata = {
    id: IIM_ITEM_IDENTIFIER,
    handoutId: handout.id,
    item: itemData
  }

  setTimeout(() => {
    handout.set('notes', ItemTemplate(itemMetadata))
    handout.set('gmnotes', JSON.stringify(itemMetadata, null, 2))
  
    const handoutLinkStr = `<a style="font-weight:bold;" href="${handoutLink(handout.id)}">${itemData.name}</a>`
    whisperToPlayer(player, `Created new item: ${handoutLinkStr}`)
  }, 0)
}

function createDefaultItem(player: Roll20Object, name: string) {
  createNewItem(player, {
    name,
    type: 'Item Type',
    rarity: 'unknown',
    source: '',
    properties: '',
    attunement: 'unknown',
    weight: '- lb.',
    imageUrl: null,
    price: '- gp',
    description: ''
  })
}

function createCopyItem(player: Roll20Object, name: string, handoutId: string) {
  const handout = getObj(Roll20ObjectType.Handout, handoutId)

  if (!handout) {
    createDefaultItem(player, name)
    return
  }

  handout.get('gmnotes', data => {
    const itemMetadata = parseItem(data)
    
    const rootName = handout.get('name')
    const itemData = itemMetadata.item
    itemData.name = `${rootName} (${name})`
    
    setTimeout(() => {
      createNewItem(player, itemData)
    }, 0)
  })
}

function copyItem(context: IIMContext) {
  const { command, player } = context
  const commandOptions = command.options

  const handoutId = commandOptions.split(/\s/g, 1)[0]
  const itemName = commandOptions.slice(handoutId.length + 1)

  if (handoutId === 'new') {
    createDefaultItem(player, itemName)
  } else {
    createCopyItem(player, itemName, handoutId)
  }
}

function createItem(context: IIMContext) {
  const { command, player } = context
  const commandOptions = command.options

  const itemAttributes = commandOptions.split(/\s/g)

  if (itemAttributes.length < 6) {
    whisperToPlayer(player, 'Not enough arguments provided to full item')
  }
  const [price, weight, rarity, attunement, type] = itemAttributes
  const itemName = commandOptions.slice(commandOptions.indexOf(type) + type.length + 1)

  whisperToPlayer(player, `Creating new item with name: ${itemName}`)

  createNewItem(player, {
    name: itemName,
    type: splitOption(type),
    rarity: splitOption(rarity),
    source: '',
    properties: '',
    attunement: splitOption(attunement),
    weight: splitOption(weight),
    imageUrl: mapItemTypeToImage(itemName, splitOption(type)),
    price: splitOption(price),
    description: ''
  })
}

function copyItemCommandTemplate(handoutId: string): string {
  return `!iim copy-item ${handoutId} ?{Item Name Suffix}`
}

function createItemCommandTemplate(): string {
  const rarity = '?{Rarity|Unknown,unknown|Common,common|Uncommon,uncommon|Rare,rare|Very Rare,very-rare|Legendary,legendary}'
  const attunement = '?{Attunement|None,none|Needed,needed}'
  const type = '?{Item Type|Armor,Armor|Potion,Potion|Scroll,Scroll|Ring,Ring|Rod,Rod|Staff,Staff|Wand,Wand|Weapon,Weapon|Wondrous Item,Wondrous-Item|Adventuring Gear,Adventuring-Gear|Gemstone,Gemstone|Ammunition,Ammunition|Tool,Tool|Custom Type,?{Custom Type}}'
  return `!iim create-item ?{Price} ?{Weight} ${rarity} ${attunement} ${type} ?{Item Name}`
}

export {
  copyItem,
  copyItemCommandTemplate,

  createItem,
  createItemCommandTemplate
}
import {
  whisperToPlayer,
  sayAsPlayer,
  parseChatMessage,
  getHandoutsByName,
  getCharacterByName,
  getInventoryByCharacter,
  getInventoryById,
  getItemById,
  handoutLink,
  parseInventory,
  parseItem,
  splitOption,
  mapItemTypeToImage,
  getItemDataById,
  getCommandTextAfter,
  getTotalWealth,
  getTotalWeight,
  normalizeInventoryMeta
} from '../../src/helpers'

// Inject globals into space
require('../mocks')
import { TEST_PLAYER_ID, mockInventory, blankItem } from '../data'
import { MOCK20player } from '../mocks/Objects/Mock20_player'
import { IIMInventoryCoins, IIMInvItemMetadata, IIMInventoryMetadata } from '../../src/types'
import { Items } from '../../src/items/items'
import { IIM_ITEM_IDENTIFIER, IIM_INVENTORY_IDENTIFIER } from '../../src/constants'

describe('whisperToPlayer', () => {
  beforeEach(() => {
    global.sendChat = jest.fn(global.sendChat)
  })

  it('should pass a string with whisper to the internal sendChat API', () => {
    const player = new MOCK20player(
      TEST_PLAYER_ID,
      { _displayname: TEST_PLAYER_ID },
      true // is GM
    )
    const sendChatMock = jest.fn(global.sendChat)
    global.sendChat = sendChatMock

    whisperToPlayer(player, 'Test Message')
    expect(sendChatMock.mock.calls.length).toStrictEqual(1)
    expect(sendChatMock.mock.calls[0][0]).toStrictEqual('')
    expect(sendChatMock.mock.calls[0][1]).toStrictEqual(`/w "${TEST_PLAYER_ID}" Test Message`)
  })
})

describe('getCommandTextAfter', () => {
  it('should return all the command text after a provided matching word', () => {
    const afterText = 'this is everything after'
    const commandOptions = 'firstOpt secondOpt this is everything after'
    const [firstOpt, secondOpt] = commandOptions.split(/\s/g)

    expect(getCommandTextAfter(secondOpt, commandOptions)).toStrictEqual(afterText)
  })
})

describe('getTotalWealth', () => {

  it('should return the wealth of a collection of priced items', () => {
    expect(getTotalWealth(mockInventory)).toMatchObject<IIMInventoryCoins>({
      copper: '42',
      silver: '4400',
      electrum: '0',
      gold: '6',
      platinum: '5'
    })
  })

  it('should return the wealth of a huge collecdtion of priced items', () => {
    const invItems: IIMInvItemMetadata[] = Items.map(item => ({
      id: IIM_ITEM_IDENTIFIER,
      handoutId: null,
      amount: '3',
      item
    }))
    expect(getTotalWealth(invItems)).toMatchObject<IIMInventoryCoins>({
      copper: '229',
      silver: '252',
      electrum: '0',
      gold: '26806995',
      platinum: '0'
    })
  })
})

describe('getTotalWeight', () => {
  it('should return the weight of a collection of weighted items', () => {
    expect(getTotalWeight(mockInventory)).toStrictEqual('136')
  })
})

describe('normalizeInventoryMeta', () => {
  it('should fix any whitespaces in handouts and keys', () => {
    const badItem: any = {
      'name ': 'Test Item',
      ' source': 'Test Source',
      'rarity': 'Test Rarity',
      'type ': 'Test Type',
      'properties ': '',
      'attunement ': '',
      ' weight': '2 lb.',
      'imageUrl  ': '',
      'price ': '2 sp',
      'description ': ''
    }
    const badInventoryKeys: IIMInventoryMetadata = {
      id: IIM_INVENTORY_IDENTIFIER,
      totalWealth: {
        copper: '0',
        silver: '0',
        electrum: '0',
        gold: '0',
        platinum: '0'
      },
      totalWeight: '0',
      handoutId: '- MEKD9jf3med -8',
      characterId: ' 0 --Test',
      inventory: [
        {
          id: IIM_ITEM_IDENTIFIER,
          handoutId: '- MEKD9jf3med -8',
          amount: '3',
          item: badItem
        }
      ]
    }
    
    expect(normalizeInventoryMeta(badInventoryKeys)).toMatchObject({
      id: IIM_INVENTORY_IDENTIFIER,
      totalWealth: {
        copper: '0',
        silver: '0',
        electrum: '0',
        gold: '0',
        platinum: '0'
      },
      totalWeight: '0',
      handoutId: '-MEKD9jf3med-8',
      characterId: '0--Test',
      inventory: [
        {
          id: IIM_ITEM_IDENTIFIER,
          handoutId: '-MEKD9jf3med-8',
          amount: '3',
          item: {
            'name': 'Test Item',
            'source': 'Test Source',
            'rarity': 'Test Rarity',
            'type': 'Test Type',
            'properties': '',
            'attunement': '',
            'weight': '2 lb.',
            'imageUrl': '',
            'price': '2 sp',
            'description': ''
          }
        }
      ]
    })
  })
})
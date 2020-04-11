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
  getTotalWeight
} from '../../src/helpers'

// Inject globals into space
require('../mocks')
import { TEST_PLAYER_ID, mockInventory } from '../data'
import { MOCK20player } from '../mocks/Objects/Mock20_player'
import { IIMInventoryCoins, IIMInvItemMetadata } from '../../src/types'
import { Items } from '../../src/items/items'
import { IIM_ITEM_IDENTIFIER } from '../../src/constants'

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
      copper: '4',
      silver: '2',
      electrum: '0',
      gold: '2',
      platinum: '1'
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
      copper: '76',
      silver: '84',
      electrum: '0',
      gold: '82215',
      platinum: '0'
    })
  })
})

describe('getTotalWeight', () => {
  it('should return the weight of a collection of weighted items', () => {
    expect(getTotalWeight(mockInventory)).toStrictEqual('16')
  })
})
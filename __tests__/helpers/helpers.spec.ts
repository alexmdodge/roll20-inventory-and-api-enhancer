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
  getCommandTextAfter
} from '../../src/helpers'

// Inject globals into space
require('../mocks')
import { TEST_PLAYER_ID } from '../data'
import { MOCK20player } from '../mocks/Objects/Mock20_player'

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
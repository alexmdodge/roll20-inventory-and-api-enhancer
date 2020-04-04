import { Roll20Message, Roll20MessageType, Roll20Object } from '../../src/types'

export const TEST_PLAYER_ID = 'test_player'

// export const mockRoll20Player: Roll20Object = {

// }

export const validChatMessage: Roll20Message = {
  type: Roll20MessageType.API,
  content: '!iim create-item',
  playerid: TEST_PLAYER_ID,
  who: TEST_PLAYER_ID,
}

export const invalidChatMessage: Roll20Message = {
  type: Roll20MessageType.General,
  content: '!iim create-bad-command',
  playerid: TEST_PLAYER_ID,
  who: TEST_PLAYER_ID
}

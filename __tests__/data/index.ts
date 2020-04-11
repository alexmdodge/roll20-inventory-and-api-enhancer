import { Roll20Message, Roll20MessageType, IIMInvItemMetadata, IIMItem } from '../../src/types'
import { IIM_ITEM_IDENTIFIER } from '../../src/constants'

export const TEST_PLAYER_ID = 'test_player'

export const validChatMessage: Roll20Message = {
  type: Roll20MessageType.API,
  content: '!iim create-item',
  playerid: TEST_PLAYER_ID,
  who: TEST_PLAYER_ID
}

export const invalidChatMessage: Roll20Message = {
  type: Roll20MessageType.General,
  content: '!iim create-bad-command',
  playerid: TEST_PLAYER_ID,
  who: TEST_PLAYER_ID
}

const blankItem: IIMItem = {
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

export const mockInventory: IIMInvItemMetadata[] = [
  {
    id: IIM_ITEM_IDENTIFIER,
    handoutId: null,
    amount: '3',
    item: {
      ...blankItem,
      'name': 'Test Item 1',
      'weight': '2lb',
      'price': '2gp'
    }
  },
  {
    id: IIM_ITEM_IDENTIFIER,
    handoutId: null,
    amount: '2',
    item: {
      ...blankItem,
      'name': 'Test Item 2',
      'weight': '2 lb.',
      'price': '2 sp'
    }
  },
  {
    id: IIM_ITEM_IDENTIFIER,
    handoutId: null,
    amount: '20',
    item: {
      ...blankItem,
      'name': 'Test Item 3',
      'weight': '6.02pounds',
      'price': '2copper'
    }
  },
  {
    id: IIM_ITEM_IDENTIFIER,
    handoutId: null,
    amount: '5',
    item: {
      ...blankItem,
      'name': 'Test Item 4',
      'weight': '0.001lbs',
      'price': '1 pp'
    }
  },
  {
    id: IIM_ITEM_IDENTIFIER,
    handoutId: null,
    amount: '',
    item: {
      ...blankItem,
      'name': 'Test Item 5',
      'weight': '6lbs',
      'price': '2 cp'
    }
  }
]
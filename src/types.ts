import { IIM_INVENTORY_IDENTIFIER, IIM_ITEM_IDENTIFIER } from './constants'

export type AttributeValue = string | number | boolean

export function isString(value: AttributeValue): value is string {
  return typeof value === 'string'
}

export enum Roll20ObjectType {
  Path = 'path',
  Text = 'text',
  Graphic = 'graphic',
  Page = 'page',
  Campaign = 'campaign',
  Player = 'player',
  Macro = 'macro',
  Rollable_Table = 'rollabletable',
  Table_Item = 'tableitem',
  Character = 'character',
  Handout = 'handout',
  Attribute = 'attribute',
}

export enum Roll20MessageType {
  API = 'api',
  General = 'general'
}

export interface Roll20Message {
  type: Roll20MessageType;
  content: string;
  playerid: string;
  who: string;
}

export interface Roll20Object {
  id: string;
  get(property: 'notes' | 'gmnotes' | 'bio', cb: (value: string) => void);
  get(property: string): AttributeValue;
  get(property: 'displayname'): string;
  get(property: 'name'): string;
  get(property: 'current'): string;
  set(property: string, value: AttributeValue);
  remove(options?: any);
}

export interface Roll20ObjectAttributes {
  [key: string]: AttributeValue;
}

export interface Roll20JournalObjectAttributes extends Roll20ObjectAttributes {
  name?: string;

  /**
   * Comma delimited list of player ids that can see this journal object
   */
  inplayerjournals?: string;

  /**
   * Comma delimited list of player ids that can control and edit this journal object
   */
  controlledby?: string;
}

export interface IIMContext {
  type: Roll20MessageType;
  player: Roll20Object;
  command: {
    id: string;
    trigger: string;
    options: string;
  };
}

export interface IIMInventoryCoins {
  copper: string;
  silver: string;
  electrum: string;
  gold: string;
  platinum: string;
}

export interface IIMInventoryMetadata {
  id: typeof IIM_INVENTORY_IDENTIFIER;
  characterName: string | null;
  characterId: string | null;
  handoutId: string | null;
  totalWealth: IIMInventoryCoins;
  totalWeight: string;
  inventory: IIMInvItemMetadata[];
}

export interface IIMItem {
  name: string;
  source: string;
  rarity: string;
  type: string;
  properties: string;
  attunement: string;
  weight: string;
  imageUrl?: string | null;
  price: string;
  description: string;
}

export interface IIMItemMetadata {
  id: typeof IIM_ITEM_IDENTIFIER;
  handoutId: string | null;
  item: IIMItem;
}

export interface IIMInvItemMetadata extends IIMItemMetadata {
  amount: string;
}

export enum ButtonSize {
  Small = 'small',
  Medium = 'medium',
  Large = 'large'
}

export enum IIMInventoryItemUpdateType {
  Add = 'add',
  Remove = 'remove'
}
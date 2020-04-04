import {
  IIMItemMetadata, ButtonSize
} from '../types'
import {
  containerStyles,
  itemImageStyles,
  apiControlStyles
} from './styles'
import {
  CopyItemButtonTemplate,
  AddItemToInventoryTemplate,
  CreateItemButtonTemplate,
  UpdateItemImageTemplate,
  UpdateItemTemplate,
  UpdateItemDescTemplate
} from './buttons'

/**
 * Using a template, renders an item handout which includes data and helpers for working
 * with the IIM items
 */
const ItemTemplate = (itemMeta: IIMItemMetadata): string => {
  const { handoutId, item } = itemMeta
  return [
    // Item header with image banner
    `<div class="iim__handout-container" style="${containerStyles}">`,
    `<img style="${itemImageStyles}" src="${item.imageUrl}">`,
    `<h1>${item.name}</h1>`,

    // Initial section for rarity and type info
    '<p style="font-style: italic;">',
    `${item.type}${item.rarity.length > 0 ? `, rarity (${item.rarity.toLowerCase()})` : ''}`,
    '</p>',

    // Generic properties
    '<h3> Properties </h3>',
    `${item.properties.length > 0 ? `<p>${item.properties}</p>` : ''}`,
    `<p style="font-style: italic;">weight (${item.weight}), attunement (${item.attunement || 'none'})</p>`,

    // Complex description with HTML support
    `${item.description && `<h3> Description </h3><p>${item.description}</p>`}`,
    '</div>',

    // API controls sections
    `<div style="${apiControlStyles}">`,
    CopyItemButtonTemplate(handoutId, ButtonSize.Small),
    CreateItemButtonTemplate(ButtonSize.Small),
    AddItemToInventoryTemplate(handoutId, item.name, ButtonSize.Small),
    UpdateItemTemplate(handoutId, ButtonSize.Small),
    UpdateItemImageTemplate(handoutId, ButtonSize.Small),
    UpdateItemDescTemplate(handoutId, ButtonSize.Small),
    '</div>'
  ].join('')
}

export {
  ItemTemplate
}
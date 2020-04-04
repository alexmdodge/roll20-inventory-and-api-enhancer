import {
  IIMInventoryMetadata, ButtonSize, IIMInvItemMetadata
} from '../types'
import {
  containerStyles,
  inventoryHeaderImgStyles,
  inventoryItemApiStyles,
  centerText
} from './styles'
import { INVENTORY_HEADER_IMG } from '../constants'
import { UpdateInventoryItemTemplate, DeleteInventoryItemTemplate } from './buttons'
import { handoutLink } from '../helpers'

const renderActionsCell = (inventoryHandoutId: string | null, itemMeta: IIMInvItemMetadata): string => {
  const { handoutId: itemHandoutId, amount } = itemMeta
  if (!inventoryHandoutId || !itemHandoutId) {
    return `<td style="${centerText}">---</td>`
  }

  return [
    `<td style="position:relative;${centerText}">`,
    UpdateInventoryItemTemplate(inventoryHandoutId, itemHandoutId, ButtonSize.Small),
    amount === '0' ? DeleteInventoryItemTemplate(inventoryHandoutId, itemHandoutId, ButtonSize.Small) : '',
    '</td>'
  ].join('')
}

const TableHeaderItemsTemplate = () => {
  return [
    `<th style="${centerText}">Item Name</th>`,
    `<th style="${centerText}">Amount</th>`,
    `<th style="${centerText}">Value</th>`,
    `<th style="${centerText}">Weight</th>`,
    `<th style="${centerText}">Actions</th>`
  ].join('')
}

const renderBodyItems = (itemMeta: IIMInvItemMetadata, inventoryHandoutId: string | null) => {
  const { handoutId, item, amount } = itemMeta
  const { name, price, weight } = item
  const itemName = handoutId
    ? `<a href=${handoutLink(handoutId)} style="${inventoryItemApiStyles}">${name}</a></td>`
    : `${name}`

  return [
    // Item Name
    `<td style="${centerText}">${itemName}</td>`,

    // Amount in Inventory
    `<td style="${centerText}">${amount}</td>`,

    // Item Value (in gp)
    `<td style="${centerText}">${price}</td>`,

    // Item Weight (in pounds)
    `<td style="${centerText}">${weight}</td>`,

    // Actions that can be taken on the item
    renderActionsCell(inventoryHandoutId, itemMeta)
  ].join('')
}

const TableBodyItemsTemplate = (inventoryMeta: IIMInventoryMetadata) => {
  const { handoutId: inventoryHandoutId, inventory } = inventoryMeta
  return inventory
    .map(item => renderBodyItems(item, inventoryHandoutId))
    .map(item => `<tr>${item}</tr>`)
    .join('')
}

const TableHeaderTemplate = () => [
  '<thead>',
  `<tr>${TableHeaderItemsTemplate()}</tr>`,
  '</thead>'
].join('')

const TableBodyTemplate = (inventoryMeta: IIMInventoryMetadata) => [
  '<tbody>',
  `${TableBodyItemsTemplate(inventoryMeta)}`,
  '</tbody>'
].join('')

/**
 * Using a template, renders an item handout which includes data and helpers for working
 * with the IIM items
 */
export const InventoryTemplate = (inventoryMeta: IIMInventoryMetadata): string => [
  `<div class="iim__inventory-container" style="${containerStyles}">`,
  `<img style="${inventoryHeaderImgStyles}" src="${INVENTORY_HEADER_IMG}">`,
  '<table>',
  TableHeaderTemplate(),
  TableBodyTemplate(inventoryMeta),
  '</table>',
  '</div>'
].join('')
 
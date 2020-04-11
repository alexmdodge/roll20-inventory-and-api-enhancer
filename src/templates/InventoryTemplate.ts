import {
  IIMInventoryMetadata, ButtonSize, IIMInvItemMetadata
} from '../types'
import {
  containerStyles,
  inventoryHeaderImgStyles,
  inventoryItemApiStyles,
  centerText,
  invApiControlStyles
} from './styles'
import { INVENTORY_HEADER_IMG } from '../constants'
import { UpdateInventoryItemTemplate, DeleteInventoryItemTemplate } from './buttons'
import { handoutLink } from '../helpers'
import { UpdateInventoryTemplate } from './buttons/UpdateInventoryTemplate'

const InventoryApiControls = (inventoryMeta: IIMInventoryMetadata) => {
  return [
    `<div style="${invApiControlStyles}">`,
    UpdateInventoryTemplate(inventoryMeta.handoutId, ButtonSize.Small),
    '</div>'
  ].join('')
}

const InventoryInfo = (inventoryMeta: IIMInventoryMetadata) => {
  return [
    '<div>',
    InventoryWealthInfo(inventoryMeta),
    InventoryWeightInfo(inventoryMeta),
    '</div>'
  ].join('')
}

const InventoryWealthInfo = (inventoryMeta: IIMInventoryMetadata) => {
  const { totalWealth } = inventoryMeta
  return [
    '<div>',
    `<span><img src="https://app.roll20.net/images/dndstyling/copper.png" />${totalWealth.copper}</span>`,
    `<span><img src="https://app.roll20.net/images/dndstyling/silver.png" />${totalWealth.silver}</span>`,
    `<span><img src="https://app.roll20.net/images/dndstyling/electrum.png" />${totalWealth.electrum}</span>`,
    `<span><img src="https://app.roll20.net/images/dndstyling/gold.png" />${totalWealth.gold}</span>`,
    `<span><img src="https://app.roll20.net/images/dndstyling/platnum.png" />${totalWealth.platinum}</span>`,
    '</div>'
  ].join('')
}

const InventoryWeightInfo = (inventoryMeta: IIMInventoryMetadata) => {
  const { totalWeight } = inventoryMeta
  return [
    '<div>',
    `<span><img src="https://imgsrv.roll20.net?src=https%3A//raw.githubusercontent.com/Roll20/roll20-character-sheets/master/5th%2520Edition%2520OGL%2520by%2520Roll20/images/weight_lbs.png" />${totalWeight}</span>`,
    '</div>'
  ].join('')
}

const renderActionsCell = (inventoryHandoutId: string | null, itemMeta: IIMInvItemMetadata): string => {
  const { handoutId: itemHandoutId, amount, item } = itemMeta
  if (!inventoryHandoutId || !itemHandoutId) {
    return `<td style="${centerText}">---</td>`
  }

  return [
    `<td style="position:relative;${centerText}">`,
    UpdateInventoryItemTemplate(inventoryHandoutId, itemHandoutId, ButtonSize.Small),
    amount === '0' ? DeleteInventoryItemTemplate(inventoryHandoutId, item.name, ButtonSize.Small) : '',
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
  InventoryApiControls(inventoryMeta),
  InventoryInfo(inventoryMeta),
  '<table>',
  TableHeaderTemplate(),
  TableBodyTemplate(inventoryMeta),
  '</table>',
  '</div>'
].join('')
 
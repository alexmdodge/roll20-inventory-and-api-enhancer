import {
  IIMInventoryMetadata, ButtonSize, IIMInvItemMetadata
} from '../types'
import {
  containerStyles,
  inventoryHeaderImgStyles,
  inventoryItemThumbStyles,
  inventoryItemApiStyles,
  centerText,
  leftText,
  noPad,
  noMargin,
  invApiControlStyles
} from './styles'
import { INVENTORY_HEADER_IMG } from '../constants'
import { UpdateInventoryItemTemplate, DeleteInventoryItemTemplate } from './buttons'
import { handoutLink, getCharacterCarryWeight } from '../helpers'
import { UpdateInventoryTemplate } from './buttons/UpdateInventoryTemplate'
import { css } from '../templates/utils'

const InventoryApiControls = (inventoryMeta: IIMInventoryMetadata) => {
  return [
    `<div style="${invApiControlStyles}">`,
    UpdateInventoryTemplate(inventoryMeta.characterName, ButtonSize.Small),
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

  const inventoryWealthStyles = css({
    'text-align': 'center',
    'margin-bottom': '10px'
  })
  const invWealthContainerStyles = css({
    'font-size': '16px',
    'margin-right': '15px'
  })
  const invWealthImgStyles = css({
    'height': '19px',
    'margin-right': '5px',
    'margin-bottom': '2px'
  })

  const CoinAmount = (img: string, amount: string) => {
    return `<span style="${invWealthContainerStyles}"><img style="${invWealthImgStyles}" src="${img}">${amount}</span>`
  }

  return [
    `<div style="${inventoryWealthStyles}">`,
    CoinAmount('https://app.roll20.net/images/dndstyling/copper.png', totalWealth.copper),
    CoinAmount('https://app.roll20.net/images/dndstyling/silver.png', totalWealth.silver),
    CoinAmount('https://app.roll20.net/images/dndstyling/electrum.png', totalWealth.electrum),
    CoinAmount('https://app.roll20.net/images/dndstyling/gold.png', totalWealth.gold),
    CoinAmount('https://app.roll20.net/images/dndstyling/platnum.png', totalWealth.platinum),
    '</div>'
  ].join('')
}

const InventoryWeightInfo = (inventoryMeta: IIMInventoryMetadata) => {
  const { totalWeight, characterId } = inventoryMeta
  const inventoryWeightStyles = css({
    'text-align': 'center',
    'margin-bottom': '20px'
  })
  const invWeightContainerStyles = css({
    'font-size': '16px',
    'margin-right': '15px'
  })
  const invWeightImgStyles = css({
    'height': '19px',
    'margin-right': '5px',
    'margin-bottom': '5px'
  })

  const weightIcon = 'https://imgsrv.roll20.net?src=https%3A//raw.githubusercontent.com/Roll20/roll20-character-sheets/master/5th%2520Edition%2520OGL%2520by%2520Roll20/images/weight_lbs.png'

  return [
    `<div style="${inventoryWeightStyles}">`,
    `<span style="${invWeightContainerStyles}">`,
    `<img style="${invWeightImgStyles}" src="${weightIcon}" />`,
    getCharacterCarryWeight(characterId, totalWeight),
    '</span>',
    '</div>'
  ].join('')
}

const renderActionsCell = (charName: string | null, itemMeta: IIMInvItemMetadata): string => {
  const { handoutId: itemHandoutId, amount, item } = itemMeta
  if (!charName || !itemHandoutId) {
    return `<td style="${centerText}">---</td>`
  }

  return [
    `<td style="position:relative;${centerText}">`,
    UpdateInventoryItemTemplate(charName, itemHandoutId, ButtonSize.Small),
    amount === '0' ? DeleteInventoryItemTemplate(charName, item.name, ButtonSize.Small) : '',
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

const renderBodyItems = (itemMeta: IIMInvItemMetadata, charName: string | null) => {
  const { handoutId, item, amount } = itemMeta
  const { name, price, weight, imageUrl } = item
  const itemName = handoutId
    ? `<a href=${handoutLink(handoutId)} style="${inventoryItemApiStyles}"><span style="${noMargin}${noPad}color:#444;">${name}</span></a>`
    : `${name}`

  // Optionally transform the URL from full to thumb
  const notPlaceholderCell = itemName.indexOf('---') < 0
  const itemImage = imageUrl && notPlaceholderCell
    ? `<img style="${inventoryItemThumbStyles}" src="${imageUrl}">`
    : ``
  
  const initialCellStyle = notPlaceholderCell ? leftText : centerText

  return [
    // Item Name and Icon
    `<td style="${initialCellStyle}">`,
      `${itemImage}`,
      `<p style="${noPad}${noMargin}font-weight:bold;display:inline-block;">${itemName}</p>`,
    `</td>`,

    // Amount in Inventory
    `<td style="${centerText}">${amount}</td>`,

    // Item Value (in gp)
    `<td style="${centerText}">${price}</td>`,

    // Item Weight (in pounds)
    `<td style="${centerText}">${weight}</td>`,

    // Actions that can be taken on the item
    renderActionsCell(charName, itemMeta)
  ].join('')
}

const TableBodyItemsTemplate = (inventoryMeta: IIMInventoryMetadata) => {
  const { inventory, characterName } = inventoryMeta
  return inventory
    .map(item => renderBodyItems(item, characterName))
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
 
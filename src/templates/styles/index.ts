import { css } from '../utils'

export const containerStyles = css({
  'padding': '20px',
  'margin-left': '-20px',
  'margin-bottom': '10px',
  'width': '100%',
  'background-color': '#f1f0e8',
  'border-radius': '5px',
  'overflow': 'auto'
})

export const inventoryContainerStyles = css({
  'background-color': '#fbedba'
})

export const itemImageStyles = css({
  'max-height': '200px',
  'border-radius': '5px',
  'margin-bottom': '10px',
  'margin-left': '10px',
  'float': 'right'
})

export const inventoryHeaderImgStyles = css({
  'height': '100px',
  'display': 'block',
  'margin': '10px auto'
})

export const inventoryItemApiStyles = css({
  'cursor': 'pointer',
  'text-decoration': 'none',
  'color': 'darkgreen'
})

export const apiControlStyles = css({
  'padding-bottom': '10px',
  'margin-left': '-20px',
  'width': '100%'
})

export const centerText = css({
  'text-align': 'center'
})

export * from './button'

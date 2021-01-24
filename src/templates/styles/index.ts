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

export const inventoryItemThumbStyles = css({
  'height': '30px',
  'width': '30px',
  'display': 'inline-block',
  'margin': '2px 10px 2px',
  'border': '1px solid #555'
})

export const inventoryItemApiStyles = css({
  'cursor': 'pointer',
  'text-decoration': 'none'
})

export const apiControlStyles = css({
  'padding-bottom': '10px',
  'margin-left': '-20px',
  'width': '100%'
})

export const invApiControlStyles = css({
  'text-align': 'center',
  'padding-bottom': '10px',
  'width': '100%'
})

export const centerText = css({
  'text-align': 'center',
  'vertical-align': 'middle'
})

export const leftText =  css({
  'text-align': 'left',
  'vertical-align': 'middle'
})

export const noPad = css({
  'padding': '0px',
})

export const noMargin = css({
  'margin': '0px'
})

export * from './button'

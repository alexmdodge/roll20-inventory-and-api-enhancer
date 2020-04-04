import { css } from '../utils'
import { ButtonSize } from '../../types'

export const buttonStyles = css({
  'display': 'inline-block',
  'padding': '4px 10px',
  'margin': '0 2.5px',
  'font-size': '13px',
  'line-height': '18px',
  'color': '#333',
  'text-align': 'center',
  'text-shadow': '0 1px 1px rgba(255,255,255,0.75)',
  'vertical-align': 'middle',
  'background-color': '#f5f5f5',
  'background-image': [
    '-moz-linear-gradient(top,#fff,#e6e6e6)',
    '-ms-linear-gradient(top,#fff,#e6e6e6)',
    '-webkit-gradient(linear,0 0,0 100%,from(#fff),to(#e6e6e6))',
    '-webkit-linear-gradient(top,#fff,#e6e6e6)',
    '-o-linear-gradient(top,#fff,#e6e6e6)',
    'linear-gradient(top,#fff,#e6e6e6)'
  ],
  'background-repeat': 'repeat-x',
  'border-color': [
    '#e6e6e6 #e6e6e6 #bfbfbf',
    'rgba(0,0,0,0.1) rgba(0,0,0,0.1) rgba(0,0,0,0.25)'
  ],
  'border': '1px solid #ccc',
  'border-bottom-color': '#bbb',
  '-webkit-border-radius': '4px',
  '-moz-border-radius': '4px',
  'border-radius': '4px',
  '-webkit-box-shadow': 'inset 0 1px 0 rgba(255,255,255,0.2), 0 1px 2px rgba(0,0,0,0.05)',
  '-moz-box-shadow': 'inset 0 1px 0 rgba(255,255,255,0.2),0 1px 2px rgba(0,0,0,0.05)',
  'box-shadow': 'inset 0 1px 0 rgba(255,255,255,0.2), 0 1px 2px rgba(0,0,0,0.05)',
  'cursor': 'pointer',
  '*margin-left': '.3em',
  'text-decoration': 'none'
})

export function getButtonSizeStyles(size: ButtonSize = ButtonSize.Medium): string {
  return {
    [ButtonSize.Small]: css({
      'padding': '2px 6px',
      'font-size': '10px',
      'line-height': '14px'
    }),
    [ButtonSize.Medium]: '',
    [ButtonSize.Large]: css({
      'padding': '8px 20px',
      'font-size': '16px',
      'line-height': '20px'
    })
  }[size]
}
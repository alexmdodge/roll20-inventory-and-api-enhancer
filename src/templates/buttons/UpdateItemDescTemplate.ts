import { buttonStyles, getButtonSizeStyles } from '../styles'
import { updateItemDescCommandTemplate } from '../../commands'
import { ButtonSize } from '../../types'

export const UpdateItemDescTemplate = (itemHandoutId: string, size: ButtonSize) =>
  `<a
  href="${updateItemDescCommandTemplate(itemHandoutId)}"
  style="${buttonStyles}${getButtonSizeStyles(size)}"
>
  Add Description
</a>`

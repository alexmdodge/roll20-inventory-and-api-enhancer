import { buttonStyles, getButtonSizeStyles } from '../styles'
import { updateItemImageCommandTemplate } from '../../commands'
import { ButtonSize } from '../../types'

export const UpdateItemImageTemplate = (itemHandoutId: string, size: ButtonSize) =>
  `<a
  href="${updateItemImageCommandTemplate(itemHandoutId)}"
  style="${buttonStyles}${getButtonSizeStyles(size)}"
>
  Change Image
</a>`

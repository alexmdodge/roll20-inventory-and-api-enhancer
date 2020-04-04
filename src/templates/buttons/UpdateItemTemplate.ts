import { buttonStyles, getButtonSizeStyles } from '../styles'
import { updateItemCommandTemplate } from '../../commands'
import { ButtonSize } from '../../types'

export const UpdateItemTemplate = (itemHandoutId: string, size: ButtonSize) =>
  `<a
  href="${updateItemCommandTemplate(itemHandoutId)}"
  style="${buttonStyles}${getButtonSizeStyles(size)}"
>
  Update
</a>`

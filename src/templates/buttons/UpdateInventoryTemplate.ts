import { buttonStyles, getButtonSizeStyles } from '../styles'
import { updateInventoryCommandTemplate } from '../../commands'
import { ButtonSize } from '../../types'

export const UpdateInventoryTemplate = (charName: string, size: ButtonSize) =>
  `<a
  href="${updateInventoryCommandTemplate(charName)}"
  style="${buttonStyles}${getButtonSizeStyles(size)}"
>
  Refresh
</a>`

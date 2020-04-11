import { buttonStyles, getButtonSizeStyles } from '../styles'
import { updateInventoryCommandTemplate } from '../../commands'
import { ButtonSize } from '../../types'

export const UpdateInventoryTemplate = (inventoryHandoutId: string, size: ButtonSize) =>
  `<a
  href="${updateInventoryCommandTemplate(inventoryHandoutId)}"
  style="${buttonStyles}${getButtonSizeStyles(size)}"
>
  Refresh
</a>`

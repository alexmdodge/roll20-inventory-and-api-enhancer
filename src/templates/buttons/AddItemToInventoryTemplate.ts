import { buttonStyles, getButtonSizeStyles } from '../styles'
import { addItemToInventoryCommandTemplate } from '../../commands'
import { ButtonSize } from '../../types'

export const AddItemToInventoryTemplate = (handoutId: string, name: string, size: ButtonSize) =>
  `<a
  href="${addItemToInventoryCommandTemplate(handoutId, name)}"
  style="${buttonStyles}${getButtonSizeStyles(size)}"
>
  Add to Inventory
</a>`

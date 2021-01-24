import { ButtonSize } from '../../types'
import { buttonStyles, getButtonSizeStyles } from '../styles'
import { deleteInventoryItemCommandTemplate } from '../../commands'

export const DeleteInventoryItemTemplate = (charName: string, itemHandoutId: string, size: ButtonSize) =>
  `<a
  href="${deleteInventoryItemCommandTemplate(charName, itemHandoutId)}"
  style="${buttonStyles}${getButtonSizeStyles(size)}"
>
  Clear
</a>`

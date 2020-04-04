import { ButtonSize } from '../../types'
import { buttonStyles, getButtonSizeStyles } from '../styles'
import { deleteInventoryItemCommandTemplate } from '../../commands'

export const DeleteInventoryItemTemplate = (invHandoutId: string, itemHandoutId: string, size: ButtonSize) =>
  `<a
  href="${deleteInventoryItemCommandTemplate(invHandoutId, itemHandoutId)}"
  style="${buttonStyles}${getButtonSizeStyles(size)}"
>
  Clear
</a>`

import { ButtonSize } from '../../types'
import { buttonStyles, getButtonSizeStyles } from '../styles'
import { updateInventoryItemCommandTemplate } from '../../commands'

export const UpdateInventoryItemTemplate = (invHandoutId: string, itemHandoutId: string, size: ButtonSize) =>
  `<a
  href="${updateInventoryItemCommandTemplate(invHandoutId, itemHandoutId)}"
  style="${buttonStyles}${getButtonSizeStyles(size)}"
>
  Update
</a>`

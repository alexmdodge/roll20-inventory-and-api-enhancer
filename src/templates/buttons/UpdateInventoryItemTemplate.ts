import { ButtonSize } from '../../types'
import { buttonStyles, getButtonSizeStyles } from '../styles'
import { updateInventoryItemCommandTemplate } from '../../commands'

export const UpdateInventoryItemTemplate = (charName: string, itemHandoutId: string, size: ButtonSize) =>
  `<a
  href="${updateInventoryItemCommandTemplate(charName, itemHandoutId)}"
  style="${buttonStyles}${getButtonSizeStyles(size)}"
>
  Update
</a>`

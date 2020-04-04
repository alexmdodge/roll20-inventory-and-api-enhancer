import { buttonStyles, getButtonSizeStyles } from '../styles'
import { createItemCommandTemplate } from '../../commands'
import { ButtonSize } from '../../types'

const CreateItemButtonTemplate = (size: ButtonSize) =>
  `<a
  href="${createItemCommandTemplate()}"
  style="${buttonStyles}${getButtonSizeStyles(size)}"
>
  New Item
</a>`

export {
  CreateItemButtonTemplate
}
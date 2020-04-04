import { buttonStyles, getButtonSizeStyles } from '../styles'
import { copyItemCommandTemplate } from '../../commands'
import { ButtonSize } from '../../types'

const CopyItemButtonTemplate = (handoutId: string, size: ButtonSize) =>
  `<a
  href="${copyItemCommandTemplate(handoutId)}"
  style="${buttonStyles}${getButtonSizeStyles(size)}"
>
  Copy Item
</a>`

export {
  CopyItemButtonTemplate
}
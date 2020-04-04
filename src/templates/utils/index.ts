export interface InlineCSS {
  [key: string]: string | string[];
}

export function css(styles: InlineCSS): string {
  return Object.keys(styles)
    .map(styleName => {
      const cssValue = styles[styleName]

      let valuesToMap: string[]
      if (!Array.isArray(cssValue)) {
        valuesToMap = [ cssValue ]
      } else {
        valuesToMap = cssValue
      }

      return valuesToMap.map(value => `${styleName}: ${value};`).join(' ')
    })
    .join(' ')
    .trim()
}

export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
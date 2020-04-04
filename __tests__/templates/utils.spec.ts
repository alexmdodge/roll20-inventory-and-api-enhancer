import {
  css,
  capitalize
} from '../../src/templates/utils'
import {
  isUrl
} from '../../src/utils'

describe('isUrl', () => {
  it('validates that a url is correct', () => {
    expect(isUrl('https://github.com/segmentio/is-url/blob/master/index.js')).toStrictEqual(true)
  })

  it('validates that an incorrect url is incorrect: ', () => {
    expect(isUrl('https:/something .com')).toStrictEqual(false)
  })
})

describe('css', () => {
  it('renders a CSS object to a string', () => {
    const sampleCss = css({
      'margin': '32px',
      'padding': '10px'
    })

    const expectedInlineCss = 'margin: 32px; padding: 10px;'

    expect(sampleCss).toStrictEqual(expectedInlineCss)
  })

  it('renders a CSS object with fallbacks for the same style value', () => {
    const sampleCss = css({
      'margin': '32px',
      'padding': '10px',
      'multi': [
        '-prefixed-value',
        'value'
      ]
    })

    const expectedInlineCss = 'margin: 32px; padding: 10px; multi: -prefixed-value; multi: value;'

    expect(sampleCss).toStrictEqual(expectedInlineCss)
  })
})

describe('capitalize', () => {
  it('capitalizes a word and returns the result', () => {
    expect(capitalize('blah')).toStrictEqual('Blah')
  })
})

'use strict'

var assert = require('power-assert')

var ParseJapaneseBasic = require('../')

describe('ParseJapaneseBasicTest', () => {
  it('normal', () => {
    var japanese = new ParseJapaneseBasic()

    var text = 'タイトル\n' +
        '\n' +
        '1 これは前段です。' +
        'これは中段（２文の場合は後段。）です。' +
        'これは後段です。\n' +
        '（見出し）\n' +
        'さらに文です。\n'

    var cst = japanese.parse(text)

    // ParagraphNodeは5つ
    assert(cst.children.length === 5)

    // 2段落目は空行
    assert(cst.children[1].children.length === 1)
    assert(cst.children[1].children[0].value === '\n')

    // 5段落目はTextNodeとWhiteSpaceNode
    assert(cst.children[4].children.length === 2)
    assert(cst.children[4].children[0].value = 'さらに文です。')
    assert(cst.children[4].children[1].value = '\n')
  })
})

'use strict'

var ParseJapaneseBasic = require('../')

var inspect = require('unist-util-inspect')

var options = {
  position: true
}

var japanese = new ParseJapaneseBasic(options)

var text = 'タイトル\n' +
    '\n' +
    '1 これは前段です。これは中段（２文の場合は後段。）です。これは後段です。\n'

var cst = japanese.parse(text)

console.log(JSON.stringify(cst, null, ' '))
console.log(inspect(cst))

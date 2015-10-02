/**
 * @author Kenichiro Murata
 * @copyright 2015 Kenichiro Murata
 * @license MIT
 * @fileoverview Japanese (natural language) parser basic module.
 */

'use strict'

/**
 * Dependencies.
 */

var Jaco = require('jaco').Jaco

/**
 * Constants.
 */

var LINEBREAKE_MARK = /\r?\n/g

/**
 * Tokenize
 * @param parser
 * @param text
 * @returns {{type: string, children: Array}}
 */
function tokenize (parser, text) {
  var textLines = text.split(LINEBREAKE_MARK)

  if (textLines[textLines.length - 1] === '') {
    textLines = textLines.splice(0, textLines.length - 1)
  }

  var rootNode = parser.createParentNode('Root')

  /**
   * Callback Function
   * @param element
   * @param index
   * @param array
   */
  function tokenizeByLine (element, index, array) {
    parser.line = index + 1
    parser.column = 1

    var paragraphNode = parser.createParentNode('Paragraph')

    // 空行ではない場合
    if (element !== '') {
      // 半角括弧を全角括弧に変換
      var str = new Jaco(element).toWideJapneseSymbol().toString()

      // 改行ノードをParagraphNodeに追加する
      parser.add(parser.createTextNode('Text', str), paragraphNode)
    }

    // 改行ノードをParagraphNodeに追加する
    parser.add(parser.createTextNode('WhiteSpace', '\n'), paragraphNode)

    // ParagraphNodeをRoodNodeに追加
    parser.add(paragraphNode, rootNode)
  }

  textLines.forEach(tokenizeByLine)

  return rootNode
}

/**
 * Transform Japanese natural language into
 * an NLCST-tree.
 *
 * @param {VFile?} file - Virtual file.
 * @param {Object?} options - Configuration.
 * @constructor {ParseJapanese}
 */
function ParseJapaneseBasic (file, options) {
  var offset = 0
  var line = 1
  var column = 1
  var position

  if (!(this instanceof ParseJapaneseBasic)) {
    return new ParseJapaneseBasic(file, options)
  }

  if (file && file.message) {
    this.file = file
  } else {
    options = file
  }

  position = options && options.position

  if (position !== null && position !== undefined) {
    this.position = Boolean(position)
  }

  this.offset = offset
  this.line = line
  this.column = column
}

/**
 * Quick access to the prototype.
 */

var parseJapaneseBasicPrototype = ParseJapaneseBasic.prototype

/**
 * Default position.
 */
parseJapaneseBasicPrototype.position = true

/**
 * Easy access to the document parser.
 * @param value
 */
parseJapaneseBasicPrototype.parse = function (value) {
  return tokenize(this, this.file ? this.file.toString() : value)
}

/**
 * Return current position
 * @returns {{line: *, column: *, offset: number}}
 */
parseJapaneseBasicPrototype.now = function () {
  return {
    'line': this.line,
    'column': this.column,
    'offset': this.offset
  }
}

/**
 * Return next position
 * @param value
 * @returns {{line, column, offset}|{line: *, column: *, offset: number}}
 */
parseJapaneseBasicPrototype.next = function (value) {
  var length = this.stringToArray(value).length
  this.offset += length
  this.column += length
  return this.now()
}

/**
 * Create position
 * @param value
 * @returns {{start: ({line, column, offset}|{line: *, column: *, offset: number}), end: ({line, column, offset}|{line: *, column: *, offset: number})}}
 */
parseJapaneseBasicPrototype.createPosition = function (value) {
  return {
    start: this.now(),
    end: this.next(value)
  }
}

/**
 * Create ParentNode for RootNode, SentenceNode and WordNode.
 * @param type
 * @returns {{type: string, children: Array}}
 */
parseJapaneseBasicPrototype.createParentNode = function (type) {
  var node = {
    type: type + 'Node',
    children: []
  }
  if (this.position) {
    node.position = {}
  }
  return node
}

/**
 * Create TextNode for SymbolNode, PunctuationNode, WhiteSpaceNode, SourceNode, and TextNode.
 * @param type
 * @param value
 * @returns {{type: string, value: *}}
 */
parseJapaneseBasicPrototype.createTextNode = function (type, value) {
  var node = {
    type: type + 'Node',
    value: value
  }
  if (this.position) {
    node.position = this.createPosition(value)
  }

  return node
}

/**
 * Add Node to ParentNode
 * @param node
 * @param parent
 */
parseJapaneseBasicPrototype.add = function (node, parent) {
  parent.children.push(node)
  if (this.position) {
    parent.position = {
      start: parent.children[0].position.start,
      end: node.position.end
    }
  }
}

/**
 * サロゲートペアに対応した配列化
 * @param value
 * @returns {Array|{index: number, input: string}|*|Array}
 */
parseJapaneseBasicPrototype.stringToArray = function (value) {
  return value.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[^\uD800-\uDFFF]/g) || []
}

/**
 * Expose.
 */

module.exports = ParseJapaneseBasic

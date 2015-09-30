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
var VFile = require('vfile')

/**
 * Constants.
 */

var LINEBREAKE_MARK = /\r?\n/g

/**
 * サロゲートペアに対応した配列化
 * @param str
 * @returns {Array|{index: number, input: string}|*|Array}
 */
function stringToArray (str) {
  return str.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[^\uD800-\uDFFF]/g) || []
}

/**
 * Tokenize
 * @param parser
 * @param text
 * @returns {{type: string, children: Array}}
 */
function tokenize (parser, text) {
  var offset = 0
  var line, column

  var textLines = text.split(LINEBREAKE_MARK)

  if (textLines[textLines.length - 1] === '') {
    textLines = textLines.splice(0, textLines.length - 1)
  }

  var rootNode = createParentNode('Root')

  /**
   * Return current position
   * @returns {{line: *, column: *, offset: number}}
   */
  function now () {
    return {
      'line': line,
      'column': column,
      'offset': offset
    }
  }

  /**
   * Return next position
   * @param value
   * @returns {{line, column, offset}|{line: *, column: *, offset: number}}
   */
  function next (value) {
    var length = stringToArray(value).length
    offset += length
    column += length
    return now()
  }

  /**
   * Create position
   * @param value
   * @returns {{start: ({line, column, offset}|{line: *, column: *, offset: number}), end: ({line, column, offset}|{line: *, column: *, offset: number})}}
   */
  function createPosition (value) {
    return {
      start: now(),
      end: next(value)
    }
  }

  /**
   * Create ParentNode for RootNode, SentenceNode and WordNode.
   * @param type
   * @returns {{type: string, children: Array}}
   */
  function createParentNode (type) {
    var node = {
      type: type + 'Node',
      children: []
    }
    if (parser.position) {
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
  function createTextNode (type, value) {
    var node = {
      type: type + 'Node',
      value: value
    }
    if (parser.position) {
      node.position = createPosition(value)
    }

    return node
  }

  /**
   * Add Node to ParentNode
   * @param node
   * @param parent
   */
  function add (node, parent) {
    parent.children.push(node)
    if (parser.position) {
      parent.position = {
        start: parent.children[0].position.start,
        end: node.position.end
      }
    }
  }

  /**
   * Callback Function
   * @param element
   * @param index
   * @param array
   */
  function tokenizeByLine (element, index, array) {
    line = index + 1
    column = 1

    var paragraphNode = createParentNode('Paragraph')

    // 空行ではない場合
    if (element !== '') {
      // 半角括弧を全角括弧に変換
      var str = new Jaco(element).toWideJapneseSymbol().toString()

      // 改行ノードをParagraphNodeに追加する
      add(createTextNode('Text', str), paragraphNode)
    }

    // 改行ノードをParagraphNodeに追加する
    add(createTextNode('WhiteSpace','\n'), paragraphNode)

    // ParagraphNodeをRoodNodeに追加
    add(paragraphNode, rootNode)
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
  var position

  if (!(this instanceof ParseJapaneseBasic)) {
    return new ParseJapaneseBasic(file, options)
  }

  if (file && file instanceof VFile) {
    this.file = file
  } else {
    options = file
  }

  position = options && options.position

  if (position !== null && position !== undefined) {
    this.position = Boolean(position)
  }

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
 * Expose.
 */

module.exports = ParseJapaneseBasic

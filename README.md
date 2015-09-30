# parse-japanese-basic [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

A Japanese language parser producing [NLCST](https://github.com/wooorm/nlcst) nodes.
This module is a basic module for retext-japanese.

*   For semantics of nodes, see [NLCST](https://github.com/wooorm/nlcst);

## Installation

[npm](https://docs.npmjs.com/cli/install):

```bash
npm install parse-japanese-basic
```

## Usage

```javascript
var inspect = require('unist-util-inspect')

var ParseJapaneseBasic = require('parse-japanese-basic')
var japanese = new ParseJapaneseBasic()

var text = 'タイトル\n' +
             '\n' +
             '1 これは前段です。これは中段（２文の場合は後段。）です。これは後段です。\n'
             
var cst = japanese.parse(text)

console.log(inspect(cst))

/**
* RootNode[3]
* ├─ ParagraphNode[2]
* │  ├─ TextNode: 'タイトル'
* │  └─ WhiteSpaceNode: '
* '
* ├─ ParagraphNode[1]
* │  └─ WhiteSpaceNode: '
* '
* └─ ParagraphNode[2]
*    ├─ TextNode: '1 これは前段です。これは中段（２文の場合は後段。）です。これは後段です。'
*    └─ WhiteSpaceNode: '
* '
*/

```

## API

*   [ParseJapaneseBasic(options?)](#parsejapaneseoptions)
*   [ParseJapaneseBasic#parse(value)](#parsejapaneseparsevalue)

### ParseJapaneseBasic(options?)

Exposes the functionality needed to tokenize natural Japanese languages into a syntax tree.

Parameters:

*   `options` (`Object`, optional)

    *   `position` (`boolean`, default: `true`) - Whether to add positional information to nodes.
                

### ParseJapaneseBasic#parse(value)

Tokenize natural Japanese languages into an [NLCST](https://github.com/wooorm/nlcst)
[syntax tree](#syntax-tree-format).

Parameters:
	
*   `value` ([`VFile`](https://github.com/wooorm/vfile) or `string`)
    — Text document;


## Related

*   [parse-latin](https://github.com/wooorm/parse-latin)
*   [nlcst](https://github.com/wooorm/nlcst)
*   [retext](https://github.com/wooorm/retext)

## License

[MIT](LICENSE)

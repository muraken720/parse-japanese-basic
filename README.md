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
* RootNode[3] (1:1-3:39, 0-44)
* ├─ ParagraphNode[2] (1:1-1:6, 0-5)
* │  ├─ TextNode: "タイトル" (1:1-1:5, 0-4)
* │  └─ WhiteSpaceNode: "\n" (1:5-1:6, 4-5)
* ├─ ParagraphNode[1] (2:1-2:2, 5-6)
* │  └─ WhiteSpaceNode: "\n" (2:1-2:2, 5-6)
* └─ ParagraphNode[2] (3:1-3:39, 6-44)
*    ├─ TextNode: "1 これは前段です。これは中段（２文の場合は後段。）です。これは後段です。" (3:1-3:38, 6-43)
*    └─ WhiteSpaceNode: "\n" (3:38-3:39, 43-44)
*/

```

## API

*   [ParseJapaneseBasic(options?)](#parsejapanesebasicoptions)
*   [ParseJapaneseBasic#parse(value)](#parsejapanesebasicparsevalue)

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

*   [retext-japanese](https://github.com/muraken720/retext-japanese)
*   [nlcst](https://github.com/wooorm/nlcst)
*   [retext](https://github.com/wooorm/retext)
*   [parse-latin](https://github.com/wooorm/parse-latin)

## License

[MIT](LICENSE)

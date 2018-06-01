# apple-icns
[![npm](https://img.shields.io/npm/v/apple-icns.svg?style=flat-square)](https://npmjs.com/package/apple-icns)
[![npm license](https://img.shields.io/npm/l/apple-icns.svg?style=flat-square)](https://npmjs.com/package/apple-icns)
[![npm downloads](https://img.shields.io/npm/dm/apple-icns.svg?style=flat-square)](https://npmjs.com/package/apple-icns)
[![build status](https://img.shields.io/travis/jhermsmeier/node-apple-icns/master.svg?style=flat-square)](https://travis-ci.org/jhermsmeier/node-apple-icns)

Apple IconSet (.icns) file format

## Install via [npm](https://npmjs.com)

```sh
$ npm install --save apple-icns
```

## Used by

- [moimart/hyper-folder-icon](https://github.com/moimart/hyper-folder-icon) – A [Hyperterm](https://hyper.is) extension to show the folder icon in MacOS

## Usage

```js
var Icns = require( 'apple-icns' )
```

### Opening an icon set

```js
var iconset = new Icns( filename )

iconset.open( function( error ) {
  console.log( 'iconset', error || iconset )
})
```

```js
console.log( iconset.entries )
```

```js
[
  IconEntry {
    type: 'is32',
    length: 774,
    offset: 8,
    width: 16,
    height: 16,
    depth: 24,
    channels: 3,
    format: 'raw',
    isMask: false,
    isCompressed: true,
    description: '16×16 24-bit icon',
    osVersion: '8.5',
    uncompressedSize: 2304
  },
  // ... More entries omitted for brevity ...
  IconEntry {
    type: 'ic09',
    length: 158264,
    offset: 134167,
    width: 512,
    height: 512,
    depth: -1,
    channels: -1,
    format: 'jpeg2000',
    isMask: false,
    isCompressed: false,
    description: '512×512 icon in JPEG 2000 or PNG format',
    osVersion: '10.5',
    uncompressedSize: null
  }
]
```

### Reading an icon

```js
iconset.readEntryData( iconset.entries[3], function( error, buffer ) {
  console.log( 'Icon', error || buffer )
})
```

## TODO

- [ ] extraction (dumping raw jpeg/png, and decompress and combine for raw)
- [ ] creation
- [ ] addition

## References

- https://en.wikipedia.org/wiki/Apple_Icon_Image_format
- http://www.ezix.org/project/wiki/MacOSXIcons
- http://www.macdisk.com/maciconen.php
- http://icns.sourceforge.net/

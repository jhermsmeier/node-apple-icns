# apple-icns
[![npm](https://img.shields.io/npm/v/apple-icns.svg?style=flat-square)](https://npmjs.com/package/apple-icns)
[![npm license](https://img.shields.io/npm/l/apple-icns.svg?style=flat-square)](https://npmjs.com/package/apple-icns)
[![npm downloads](https://img.shields.io/npm/dm/apple-icns.svg?style=flat-square)](https://npmjs.com/package/apple-icns)
[![build status](https://img.shields.io/travis/jhermsmeier/node-apple-icns/master.svg?style=flat-square)](https://travis-ci.org/jhermsmeier/node-apple-icns)

Apple Icon Image format

## Install via [npm](https://npmjs.com)

```sh
$ npm install --save apple-icns
```

## Usage

```js
var Icns = require( 'apple-icns' )
```

**Opening an icon set**

```js
var iconset = new Icns( filename )

iconset.open( function( error ) {
  console.log( 'iconset', error || iconset )
})

```

**Reading an icon**

```js
iconset.readEntryData( iconset.entries[3], function( error, data ) {
  console.log( 'Icon', error || data )
})
```

## References

- https://en.wikipedia.org/wiki/Apple_Icon_Image_format
- http://www.ezix.org/project/wiki/MacOSXIcons
- http://www.macdisk.com/maciconen.php
- http://icns.sourceforge.net/

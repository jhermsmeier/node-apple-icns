var Icns = require( './icns' )

/**
 * IconEntry
 * @constructor
 * @returns {IconEntry}
 */
function IconEntry() {

  if( !(this instanceof IconEntry) ) {
    return new IconEntry()
  }

  this.type = 0
  this.length = 0
  this.offset = -1
  this.width = 0
  this.height = 0
  this.depth = 0
  this.channels = 0
  this.format = null
  this.isMask = false
  this.isCompressed = false
  this.description = null
  this.osVersion = null
  this.ignore = false

}

IconEntry.parse = function( buffer, offset ) {
  return new IconEntry().parse( buffer, offset )
}

/**
 * IconEntry prototype
 * @ignore
 */
IconEntry.prototype = {

  constructor: IconEntry,

  parse( buffer, offset ) {

    offset = offset || 0

    this.type = buffer.toString( 'ascii', offset + 0, offset + 4 )
    this.length = buffer.readUInt32BE( offset + 4 )

    var type = Icns.TYPE[ this.type ]

    let newTypes = [ "info" ];//, "ic04", "ic05" ]

    let found = newTypes.find((element) => {
      return element == this.type
    })

    if (found) {
      this.ignore = true;
      return this;
    }

    if( type == null) {
      throw new Error( `Unknown icns resource type "${this.type}"` )
    }

    this.width = type.width
    this.height = type.height
    this.depth = type.depth
    this.channels = type.channels
    this.format = type.format
    this.isMask = !!type.isMask
    this.description = type.description
    this.osVersion = type.os

    // To determine whether the image data is compressed we need to check
    // the stored byte length against the theoretical size
    var isRaw = this.format === 'raw'
    var uncompressedSize = this.width * this.height * this.channels * this.depth

    this.isCompressed = isRaw && ( uncompressedSize > ( this.length - 8 ) )
    this.uncompressedSize = isRaw ? uncompressedSize / 8 : null

    return this

  },

  write( buffer, offset ) {

    buffer = buffer || Buffer.alloc( this.size + this.data.length )
    offset = offset || 0

    buffer.write( this.type, offset + 0, offset + 4, 'ascii' )
    buffer.writeUInt32BE( this.length, offset + 4 )

    return buffer

  },

}

// Exports
module.exports = IconEntry

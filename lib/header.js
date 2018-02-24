var Icns = require( './icns' )

/**
 * Header
 * @constructor
 * @returns {Header}
 */
function Header() {

  if( !(this instanceof Header) ) {
    return new Header()
  }

  this.signature = 'icns' // 0x69636e73
  this.length = 0

}

Header.parse = function( buffer, offset ) {
  return new Header().parse( buffer, offset )
}

/**
 * Header prototype
 * @ignore
 */
Header.prototype = {

  constructor: Header,

  parse( buffer, offset ) {

    offset = offset || 0

    this.signature = buffer.toString( 'ascii', offset + 0, offset + 4 )
    this.length = buffer.readUInt32BE( offset + 4 )

    return this

  },

  write( buffer, offset ) {

    buffer = buffer || Buffer.alloc( this.size )
    offset = offset || 0

    buffer.write( this.signature, offset + 0, offset + 4, 'ascii' )
    buffer.writeUInt32BE( this.length, offset + 4 )

    return buffer

  },

}

// Exports
module.exports = Header

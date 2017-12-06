var fs = require( 'fs' )

class Icns {

  constructor( filename, options ) {

    this.filename = filename
    this.options = Object.assign({}, Icns.defaults, options)
    this.header = new Icns.Header()
    this.entries = []

  }

  open( callback ) {
    fs.open( this.filename, this.options.flags, this.options.mode, ( error, fd ) => {
      if( error ) return callback( error )
      this.fd = fd
      this.readHeader(( error ) => {
        if( error ) return callback( error )
        this.readEntries(( error ) => {
          callback( error )
        })
      })
    })
  }

  readHeader( callback ) {

    var buffer = Buffer.alloc( 8 )
    var offset = 0
    var length = buffer.length
    var position = 0

    fs.read( this.fd, buffer, offset, length, position, ( error, bytesRead, buffer ) => {

      if( error ) {
        return callback( error )
      }

      this.header.parse( buffer )
      callback && callback()

    })

  }

  readEntries( callback ) {

    var buffer = Buffer.alloc( 16 )
    var length = buffer.length
    var offset = 0
    var position = 8

    this.entries.length = 0

    var read = ( next ) => {
      fs.read( this.fd, buffer, offset, length, position, ( error, bytesRead, buffer ) => {

        if( error ) {
          return next( error )
        }

        var entry = new Icns.IconEntry().parse( buffer )

        entry.offset = position

        if( buffer.indexOf( Icns.JPEG2000, 8 ) === 8 ) {
          entry.format = 'jpeg2000'
        } else if( buffer.indexOf( Icns.PNG, 8 ) === 8 ) {
          entry.format = 'png'
        }

        position += entry.length

        next( null, entry )

      })
    }

    var run = ( error, entry ) => {

      if( error ) {
        return callback( error )
      }

      if( entry ) {
        this.entries.push( entry )
      }

      if( position < this.header.length ) {
        read( run )
      } else {
        callback( null, this.entries )
      }

    }

    run()

  }

  readEntryData( entry, callback ) {

    // Entry length includes the two uint32 fields,
    // so we need to substract 8 bytes to arrive at the data length
    var buffer = Buffer.alloc( entry.length - 8 )
    var length = buffer.length
    var position = entry.offset + 8
    var offset = 0

    fs.read( this.fd, buffer, offset, length, position, ( error, bytesRead, buffer ) => {
      if( !error && ( bytesRead !== length ) ) {
        error = new Error( `Bytes read mismatch; expected ${length}, read ${bytesRead}` )
      }
      callback( error, buffer )
    })

  }

  close( callback ) {
    fs.close( this.fd, ( error ) => {
      this.fd = null
      callback && callback( error )
    })
  }

}

Icns.defaults = {
  flags: 'r',
}

// Icns.JPEG2000 = Buffer.from( '0000000C6A5020200D0A870A', 'hex' )
Icns.JPEG2000 = Buffer.from( '0000000C6A502020', 'hex' )
Icns.PNG = Buffer.from( '89504E470D0A1A0A', 'hex' )

/**
 * OSType (or ResType) data
 * @type {Object}
 */
Icns.TYPE = {
  'ICON': { length: 128, width: 32, height: 32, channels: 1, depth: 1, format: 'raw', os: '1.0', description: '32×32 1-bit mono icon' },
  'ICN#': { length: 256, width: 32, height: 32, channels: 2, depth: 1, format: 'raw', os: '6.0', description: '32×32 1-bit mono icon with 1-bit mask' },
  'icm#': { length: 48, width: 16, height: 12, channels: 1, depth: 1, format: 'raw', os: '6.0', description: '16×12 1-bit mono icon with 1-bit mask' },
  'icm4': { length: 96, width: 16, height: 12, channels: 3, depth: 4, format: 'raw', os: '7.0', description: '16×12 4-bit icon' },
  'icm8': { length: 192, width: 16, height: 12, channels: 3, depth: 8, format: 'raw', os: '7.0', description: '16×12 8-bit icon' },
  'ics#': { length: 64, width: 16, height: 16, channels: 1, depth: 1, format: 'raw', isMask: true, os: '6.0', description: '16×16 1-bit mask' },
  'ics4': { length: 128, width: 16, height: 16, channels: 3, depth: 4, format: 'raw', os: '7.0', description: '16×16 4-bit icon' },
  'ics8': { length: 256, width: 16, height: 16, channels: 3, depth: 8, format: 'raw', os: '7.0', description: '16×16 8-bit icon' },
  'is32': { length: -1, width: 16, height: 16, channels: 3, depth: 24, format: 'raw', os: '8.5', description: '16×16 24-bit icon' },
  's8mk': { length: 256, width: 16, height: 16, channels: 1, depth: 8, format: 'raw', isMask: true, os: '8.5', description: '16×16 8-bit mask' },
  'icl4': { length: 512, width: 32, height: 32, channels: 3, depth: 4, format: 'raw', os: '7.0', description: '32×32 4-bit icon' },
  'icl8': { length: 1024, width: 32, height: 32, channels: 3, depth: 8, format: 'raw', os: '7.0', description: '32×32 8-bit icon' },
  'il32': { length: -1, width: 32, height: 32, channels: 3, depth: 24, format: 'raw', os: '8.5', description: '32×32 24-bit icon' },
  'l8mk': { length: 1024, width: 32, height: 32, channels: 1, depth: 8, format: 'raw', isMask: true, os: '8.5', description: '32×32 8-bit mask' },
  'ich#': { length: 288, width: 48, height: 48, channels: 1, depth: 1, format: 'raw', isMask: true, os: '8.5', description: '48×48 1-bit mask' },
  'ich4': { length: 1152, width: 48, height: 48, channels: 3, depth: 4, format: 'raw', os: '8.5', description: '48×48 4-bit icon' },
  'ich8': { length: 2304, width: 48, height: 48, channels: 3, depth: 8, format: 'raw', os: '8.5', description: '48×48 8-bit icon' },
  'ih32': { length: -1, width: 48, height: 48, channels: 3, depth: 24, format: 'raw', os: '8.5', description: '48×48 24-bit icon' },
  'h8mk': { length: 2304, width: 48, height: 48, channels: 1, depth: 8, format: 'raw', isMask: true, os: '8.5', description: '48×48 8-bit mask' },
  'it32': { length: -1, width: 128, height: 128, channels: 3, depth: 24, format: 'raw', os: '10.0', description: '128×128 24-bit icon' },
  't8mk': { length: 16384, width: 128, height: 128, channels: 1, depth: 8, format: 'raw', isMask: true, os: '10.0', description: '128×128 8-bit mask' },
  'icp4': { length: -1, width: 16, height: 16, channels: -1, depth: -1, format: null, os: '10.7', description: '16×16 icon in JPEG 2000 or PNG format' },
  'icp5': { length: -1, width: 32, height: 32, channels: -1, depth: -1, format: null, os: '10.7', description: '32×32 icon in JPEG 2000 or PNG format' },
  'icp6': { length: -1, width: 64, height: 64, channels: -1, depth: -1, format: null, os: '10.7', description: '64×64 icon in JPEG 2000 or PNG format' },
  'ic07': { length: -1, width: 128, height: 128, channels: -1, depth: -1, format: null, os: '10.7', description: '128×128 icon in JPEG 2000 or PNG format' },
  'ic08': { length: -1, width: 256, height: 256, channels: -1, depth: -1, format: null, os: '10.5', description: '256×256 icon in JPEG 2000 or PNG format' },
  'ic09': { length: -1, width: 512, height: 512, channels: -1, depth: -1, format: null, os: '10.5', description: '512×512 icon in JPEG 2000 or PNG format' },
  'ic10': { length: -1, width: 1024, height: 1024, channels: -1, depth: -1, format: null, os: '10.7', description: '1024×1024 in 10.7 (or 512×512@2x "retina" in 10.8) icon in JPEG 2000 or PNG format' },
  'ic11': { length: -1, width: 32, height: 32, channels: -1, depth: -1, format: null, os: '10.8', description: '16×16@2x "retina" icon in JPEG 2000 or PNG format' },
  'ic12': { length: -1, width: 64, height: 64, channels: -1, depth: -1, format: null, os: '10.8', description: '32×32@2x "retina" icon in JPEG 2000 or PNG format' },
  'ic13': { length: -1, width: 256, height: 256, channels: -1, depth: -1, format: null, os: '10.8', description: '128×128@2x "retina" icon in JPEG 2000 or PNG format' },
  'ic14': { length: -1, width: 512, height: 512, channels: -1, depth: -1, format: null, os: '10.8', description: '256×256@2x "retina" icon in JPEG 2000 or PNG format' },
}

Icns.Header = class Header {

  constructor() {
    this.signature = 'icns' // 0x69636e73
    this.length = 0
  }

  parse( buffer, offset ) {

    offset = offset || 0

    this.signature = buffer.toString( 'ascii', offset + 0, offset + 4 )
    this.length = buffer.readUInt32BE( offset + 4 )

    return this

  }

  write( buffer, offset ) {

    buffer = buffer || Buffer.alloc( this.size )
    offset = offset || 0

    buffer.write( this.signature, offset + 0, offset + 4, 'ascii' )
    buffer.writeUInt32BE( this.length, offset + 4 )

    return buffer

  }

}

Icns.IconEntry = class IconEntry {

  constructor() {
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
  }

  parse( buffer, offset ) {

    offset = offset || 0

    this.type = buffer.toString( 'ascii', offset + 0, offset + 4 )
    this.length = buffer.readUInt32BE( offset + 4 )

    var type = Icns.TYPE[ this.type ]

    if( type == null ) {
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
    this.uncompressedSize = isRaw ? uncompressedSize : null

    return this

  }

  write( buffer, offset ) {

    buffer = buffer || Buffer.alloc( this.size + this.data.length )
    offset = offset || 0

    buffer.write( this.type, offset + 0, offset + 4, 'ascii' )
    buffer.writeUInt32BE( this.length, offset + 4 )

    return buffer

  }

}

module.exports = Icns

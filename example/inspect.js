var fs = require( 'fs' )
var path = require( 'path' )
var Icns = require( '..' )
var argv = process.argv.slice( 2 )

var filename = path.resolve( argv.shift() )
var iconset = new Icns( filename )

iconset.open( function() {
  console.log( 'iconset', iconset )
  iconset.readEntryData( iconset.entries[ iconset.entries.length - 1 ], function( error, data ) {
    console.log( 'Icon', iconset.entries.length,  error || data )
  })
})

var rle = module.exports

/**
 * Decode a raw, run-length encoded image stream
 * See https://www.macdisk.com/maciconen.php#RLE
 * @param {Icns.IconEntry} entry - Icon entry
 * @param {Buffer} buffer - Compressed image data
 * @returns {Buffer} - RGB(A) buffer
 */
rle.decode = function( entry, buffer ) {

  // Data is stored in red run, green run, blue run
  // So we decompress to pixel format RGBA
  // RED:   byte[0], byte[4], byte[8]  ...
  // GREEN: byte[1], byte[5], byte[9]  ...
  // BLUE:  byte[2], byte[6], byte[10] ...
  // ALPHA: byte[3], byte[7], byte[11] do nothing with these bytes

  return buffer

}

rle.encodeColor = function( buffer, depth ) {
  return buffer
}

rle.encodeMask = function( buffer, depth ) {
  return buffer
}

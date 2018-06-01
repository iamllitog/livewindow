export function toNormalNumber (numStr) {
  numStr = numStr.trim()
  if (numStr.substr(numStr.length - 1, 1) === '万') {
    return Number(numStr.substr(0, numStr.length - 1)) * 10000
  }

  return Number(numStr)
};

/**
 * Normalize a port into a number, string, or false.
 */
export function normalizePort (val) {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
};

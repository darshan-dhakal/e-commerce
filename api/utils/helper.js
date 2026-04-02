function generateUniqueId () {
  return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
// Create HMAC SHA256 hash and encode it in Base64
function generateHmacSha256Hash (data, secretKey) {
  const crypto = require('crypto')
  const hash = crypto.createHmac('sha256', secretKey)
  hash.update(data)
  return hash.digest('base64')
}

module.exports = { generateUniqueId, generateHmacSha256Hash }

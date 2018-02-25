'use strict'

const fs = require('fs')

module.exports = {
  mp3DataUri (path) {
    const audioUriPrefix = 'data:audio/mp3;base64,'
    const blob = fs.readFileSync(path)
    const base64 = Buffer.from(blob).toString('base64')
    const uri = audioUriPrefix + base64
    return uri
  }
}

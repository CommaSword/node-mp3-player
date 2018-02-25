'use strict'

const sinon = require('sinon')
const proxyquire = require('proxyquire').noCallThru()

module.exports = {
  mockAudioConstructor (electronSpawn) {
    function returnSpawn () {
      return electronSpawn
    }
    returnSpawn['@global'] = true
    return proxyquire('../', {
      'electron-spawn': returnSpawn
    })
  },
  mockElectronApp (electronSpawn, AudioSpy) {
    global.Audio = AudioSpy
    return proxyquire('../lib/electron', {
      'electron': {
        remote: {
          process: electronSpawn
        }
      }
    })
  },
  mockDomAudioApi () {
    const play = sinon.spy()
    const stop = sinon.spy()
    const loop = sinon.spy()
    const volume = sinon.spy()
    const api = new Proxy({play, stop}, {
      set: (oTarget, target, val) => {
        if (target === 'loop') loop(val)
        if (target === 'volume') volume(val)
        oTarget[target] = val
        return true
      }
    })
    return {play, stop, loop, volume, api}
  }
}

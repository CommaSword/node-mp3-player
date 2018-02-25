'use strict'

const test = require('tape')
const { PassThrough } = require('stream')
const sinon = require('sinon')
const {
  mockAudioConstructor,
  mockElectronApp,
  mockDomAudioApi
} = require('./mocks')
const { mp3DataUri } = require('./utils')

test('Can instantiate mp3 file', async t => {
  try {
    t.plan(1)
    const expected = mp3DataUri(`${__dirname}/fixtures/foo.mp3`)
    const { api } = mockDomAudioApi()
    const AudioSpy = sinon.stub().returns(api)
    const electronSpawn = {
      stdin: PassThrough({objectMode: true}),
      stderr: PassThrough({objectMode: true}),
      stdout: PassThrough({objectMode: true})
    }
    const { createAudio } = mockAudioConstructor(electronSpawn)
    mockElectronApp(electronSpawn, AudioSpy)()
    const Audio = await createAudio()
    await Audio(`${__dirname}/fixtures/foo.mp3`)
    t.equals(AudioSpy.args[0][0], expected, 'AudioSpy called with proper uri')
  } catch (e) {
    t.fail(e)
    t.end()
  }
})

test('Can change volume on the fly', async t => {
  try {
    t.plan(1)
    const { volume, api } = mockDomAudioApi()
    const AudioSpy = sinon.stub().returns(api)
    const electronSpawn = {
      stdin: PassThrough({objectMode: true}),
      stderr: PassThrough({objectMode: true}),
      stdout: PassThrough({objectMode: true})
    }
    const { createAudio } = mockAudioConstructor(electronSpawn)
    mockElectronApp(electronSpawn, AudioSpy)()
    const Audio = await createAudio()
    const aud = await Audio(`${__dirname}/fixtures/foo.mp3`)
    await aud.volume(0.5)
    t.equals(volume.args[0][0], 0.5, 'volume set to 0.5')
  } catch (e) {
    t.fail(e)
    t.end()
  }
})

test('Can get volume', async t => {
  try {
    t.plan(1)
    const { api } = mockDomAudioApi()
    const AudioSpy = sinon.stub().returns(api)
    const electronSpawn = {
      stdin: PassThrough({objectMode: true}),
      stderr: PassThrough({objectMode: true}),
      stdout: PassThrough({objectMode: true})
    }
    const { createAudio } = mockAudioConstructor(electronSpawn)
    mockElectronApp(electronSpawn, AudioSpy)()
    const Audio = await createAudio()
    const aud = await Audio(`${__dirname}/fixtures/foo.mp3`)
    await aud.volume(0.5)
    const currentVolume = await aud.volume()
    t.equals(currentVolume, 0.5, 'volume set to 0.5')
  } catch (e) {
    t.fail(e)
    t.end()
  }
})

test('Can get loop', async t => {
  try {
    t.plan(1)
    const { api } = mockDomAudioApi()
    const AudioSpy = sinon.stub().returns(api)
    const electronSpawn = {
      stdin: PassThrough({objectMode: true}),
      stderr: PassThrough({objectMode: true}),
      stdout: PassThrough({objectMode: true})
    }
    const { createAudio } = mockAudioConstructor(electronSpawn)
    mockElectronApp(electronSpawn, AudioSpy)()
    const Audio = await createAudio()
    const aud = await Audio(`${__dirname}/fixtures/foo.mp3`)
    await aud.loop(false)
    const currentLooping = await aud.loop()
    t.equals(currentLooping, false, 'not looping')
  } catch (e) {
    t.fail(e)
    t.end()
  }
})

test('Can play audio', async t => {
  try {
    t.plan(1)
    const { play, api } = mockDomAudioApi()
    const AudioSpy = sinon.stub().returns(api)
    const electronSpawn = {
      stdin: PassThrough({objectMode: true}),
      stderr: PassThrough({objectMode: true}),
      stdout: PassThrough({objectMode: true})
    }
    const { createAudio } = mockAudioConstructor(electronSpawn)
    mockElectronApp(electronSpawn, AudioSpy)()
    const Audio = await createAudio()
    const aud = await Audio(`${__dirname}/fixtures/foo.mp3`)
    await aud.play()
    t.ok(play.calledOnce, 'audio played')
  } catch (e) {
    t.fail(e)
    t.end()
  }
})

test('Can loop audio', async t => {
  try {
    t.plan(1)
    const { loop, api } = mockDomAudioApi()
    const AudioSpy = sinon.stub().returns(api)
    const electronSpawn = {
      stdin: PassThrough({objectMode: true}),
      stderr: PassThrough({objectMode: true}),
      stdout: PassThrough({objectMode: true})
    }
    const { createAudio } = mockAudioConstructor(electronSpawn)
    mockElectronApp(electronSpawn, AudioSpy)()
    const Audio = await createAudio()
    const aud = await Audio(`${__dirname}/fixtures/foo.mp3`)
    await aud.loop(true)
    t.ok(loop.calledWith(true), 'audio looped')
  } catch (e) {
    t.fail(e)
    t.end()
  }
})

test('Can unloop audio', async t => {
  try {
    t.plan(1)
    const { loop, api } = mockDomAudioApi()
    const AudioSpy = sinon.stub().returns(api)
    const electronSpawn = {
      stdin: PassThrough({objectMode: true}),
      stderr: PassThrough({objectMode: true}),
      stdout: PassThrough({objectMode: true})
    }
    const { createAudio } = mockAudioConstructor(electronSpawn)
    mockElectronApp(electronSpawn, AudioSpy)()
    const Audio = await createAudio()
    const aud = await Audio(`${__dirname}/fixtures/foo.mp3`)
    await aud.loop(false)
    t.ok(loop.calledWith(false), 'audio unlooped')
  } catch (e) {
    t.fail(e)
    t.end()
  }
})

test('Can stop audio', async t => {
  try {
    t.plan(1)
    const { stop, api } = mockDomAudioApi()
    const AudioSpy = sinon.stub().returns(api)
    const electronSpawn = {
      stdin: PassThrough({objectMode: true}),
      stderr: PassThrough({objectMode: true}),
      stdout: PassThrough({objectMode: true})
    }
    const { createAudio } = mockAudioConstructor(electronSpawn)
    mockElectronApp(electronSpawn, AudioSpy)()
    const Audio = await createAudio()
    const aud = await Audio(`${__dirname}/fixtures/foo.mp3`)
    await aud.stop()
    t.ok(stop.calledOnce, 'audio stopped')
  } catch (e) {
    t.fail(e)
    t.end()
  }
})

test('ERROR - play command times out properly', async t => {
  try {
    t.plan(1)
    const { api } = mockDomAudioApi()
    const AudioSpy = sinon.stub().returns(api)
    const electronSpawn = {
      stdin: PassThrough({objectMode: true}),
      stderr: PassThrough({objectMode: true}),
      stdout: PassThrough({objectMode: true})
    }
    electronSpawn.stdout._transform = function (data, encoding, callback) {
      const obj = JSON.parse(data)
      if (obj.play) {
        callback(null, '{}')
      } else {
        callback(null, data)
      }
    }
    const { createAudio } = mockAudioConstructor(electronSpawn)
    mockElectronApp(electronSpawn, AudioSpy)()
    const Audio = await createAudio()
    const aud = await Audio(`${__dirname}/fixtures/foo.mp3`)
    try {
      await aud.play()
      t.fail('did not throw when play hangs')
    } catch (e) {
      t.equals(e.message, 'timed out waiting for electron process', 'proper message thrown')
    }
  } catch (e) {
    t.fail(e)
    t.end()
  }
})

test('ERROR - loop command times out properly', async t => {
  try {
    t.plan(1)
    const { api } = mockDomAudioApi()
    const AudioSpy = sinon.stub().returns(api)
    const electronSpawn = {
      stdin: PassThrough({objectMode: true}),
      stderr: PassThrough({objectMode: true}),
      stdout: PassThrough({objectMode: true})
    }
    electronSpawn.stdout._transform = function (data, encoding, callback) {
      const obj = JSON.parse(data)
      if (obj.loop) {
        callback(null, '{}')
      } else {
        callback(null, data)
      }
    }
    const { createAudio } = mockAudioConstructor(electronSpawn)
    mockElectronApp(electronSpawn, AudioSpy)()
    const Audio = await createAudio()
    const aud = await Audio(`${__dirname}/fixtures/foo.mp3`)
    try {
      await aud.loop()
      t.fail('did not throw when play hangs')
    } catch (e) {
      t.equals(e.message, 'timed out waiting for electron process', 'proper message thrown')
    }
  } catch (e) {
    t.fail(e)
    t.end()
  }
})

test('ERROR - volume command times out properly', async t => {
  try {
    t.plan(1)
    const { api } = mockDomAudioApi()
    const AudioSpy = sinon.stub().returns(api)
    const electronSpawn = {
      stdin: PassThrough({objectMode: true}),
      stderr: PassThrough({objectMode: true}),
      stdout: PassThrough({objectMode: true})
    }
    electronSpawn.stdout._transform = function (data, encoding, callback) {
      const obj = JSON.parse(data)
      if (obj.volume) {
        callback(null, '{}')
      } else {
        callback(null, data)
      }
    }
    const { createAudio } = mockAudioConstructor(electronSpawn)
    mockElectronApp(electronSpawn, AudioSpy)()
    const Audio = await createAudio()
    const aud = await Audio(`${__dirname}/fixtures/foo.mp3`)
    try {
      await aud.volume()
      t.fail('did not throw when play hangs')
    } catch (e) {
      t.equals(e.message, 'timed out waiting for electron process', 'proper message thrown')
    }
  } catch (e) {
    t.fail(e)
    t.end()
  }
})

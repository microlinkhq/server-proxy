'use strict'

const { send } = require('micro')
const got = require('got')

const { MICROLINK_ORIGIN, MICROLINK_API_KEY } = process.env

if (!MICROLINK_ORIGIN) {
  throw new Error("Environment variable `MICROLINK_ORIGIN` can't be empty")
}

if (!MICROLINK_API_KEY) {
  throw new Error("Environment variable `MICROLINK_API_KEY` can't be empty")
}

const origin = MICROLINK_ORIGIN.split(',').map(n => n.trim())

module.exports = (req, res) => {
  try {
    const isAllowed = origin.includes(req.headers.origin)
    return isAllowed
      ? req.pipe(
        got.stream(`https://pro.microlink.io${req.url.substring(1)}`, {
          headers: {
            'x-api-key': MICROLINK_API_KEY
          }
        })
      )
      : send(res, 401)
  } catch (err) {
    console.log('ERROR!!!', error)
  }
}

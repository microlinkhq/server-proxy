'use strict'

const { send, sendError } = require('micro')
const get = require('simple-get')

const { MICROLINK_ORIGIN, MICROLINK_API_KEY } = process.env

if (!MICROLINK_ORIGIN) {
  throw new Error("Environment variable `MICROLINK_ORIGIN` can't be empty")
}

if (!MICROLINK_API_KEY) {
  throw new Error("Environment variable `MICROLINK_API_KEY` can't be empty")
}

const origin = MICROLINK_ORIGIN.split(',').map(n => n.trim())

module.exports = (req, res) => {
  if (!origin.includes(req.headers.origin)) return send(res, 401)

  get(
    {
      url: `https://pro.microlink.io${req.url.substring(1)}`,
      headers: {
        'x-api-key': MICROLINK_API_KEY
      }
    },
    (error, stream) => (error ? sendError(req, res, error) : stream.pipe(res))
  )
}

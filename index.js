'use strict'

const { send, sendError } = require('micro')
const { getDomain } = require('tldts')
const get = require('simple-get')

const { DOMAINS, API_KEY } = process.env

if (!DOMAINS) {
  throw new Error("Environment variable `DOMAINS` can't be empty")
}

if (!API_KEY) {
  throw new Error("Environment variable `API_KEY` can't be empty")
}

const HEADERS = [
  'access-control-expose-headers',
  'x-response-time',
  'x-pricing-plan',
  'x-cache-ttl',
  'x-fetch-mode',
  'x-cache-status',
  'x-fetch-time',
  'x-fetch-date',
  'x-cache-expired-at'
]

const CACHE = {}

const trustedDomains = DOMAINS.split(',').map(n => n.trim())

const isTrustedDomain = origin =>
  CACHE[origin] || (CACHE[origin] = trustedDomains.includes(getDomain(origin)))

const setHeader = (res, value, key) => {
  if (value) res.setHeader(value, key)
}

module.exports = (req, res) => {
  const originHeader = req.headers['x-forwarded-host'] || req.headers.origin
  if (!isTrustedDomain(originHeader)) return send(res, 401)

  setHeader(res, 'Access-Control-Allow-Origin', originHeader)

  get(
    {
      url: `https://pro.microlink.io${req.url.substring(1)}`,
      headers: {
        'x-api-key': API_KEY
      }
    },
    (error, stream) => {
      if (error) return sendError(req, res, error)
      HEADERS.forEach(header => setHeader(res, header, stream.headers[header]))
      stream.pipe(res)
    }
  )
}

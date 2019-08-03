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

module.exports = (req, res) => {
  if (!isTrustedDomain(req.headers.origin)) return send(res, 401)
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin)

  get(
    {
      url: `https://pro.microlink.io${req.url.substring(1)}`,
      headers: {
        'x-api-key': API_KEY
      }
    },
    (error, stream) => {
      if (error) return sendError(req, res, error)
      HEADERS.forEach(header => res.setHeader(header, stream.headers[header]))
      stream.pipe(res)
    }
  )
}

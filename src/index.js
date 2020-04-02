'use strict'

const { getDomain } = require('tldts')
const mql = require('@microlink/mql')
const { promisify } = require('util')
const { send } = require('micri')
const stream = require('stream')

const pipeline = promisify(stream.pipeline)

const REQUIRED_ENVS = ['DOMAINS', 'API_KEY']

const CACHE = Object.create(null)

const missing = REQUIRED_ENVS.filter(key => process.env[key] == null)

if (missing.length > 0) {
  throw new Error(`Missing required environment variable(s): ${missing.join(', ')}`)
}

const trustedDomains = process.env.DOMAINS.split(',').map(n => n.trim())

const isTrustedDomain = origin =>
  CACHE[origin] || (CACHE[origin] = trustedDomains.includes(getDomain(origin)))

const verifyDomain = (req, res) => {
  const originHeader = req.headers.origin || req.headers['x-forwarded-host']
  if (!isTrustedDomain(originHeader)) return send(res, 401)
  res.setHeader('Access-Control-Allow-Origin', originHeader)
}

const toSearchParams = req => new URL(req.url, 'http://localhost').searchParams

module.exports = (req, res) => {
  verifyDomain(req, res)

  const stream = mql.stream('https://pro.microlink.io', {
    searchParams: toSearchParams(req),
    headers: {
      'x-api-key': process.env.API_KEY,
      accept: req.headers.accept
    }
  })

  pipeline(stream, res)
}

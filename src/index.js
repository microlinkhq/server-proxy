'use strict'

const mql = require('@microlink/mql')
const { promisify } = require('util')
const createCors = require('cors')
const stream = require('stream')
const pipeline = promisify(stream.pipeline)

const REQUIRED_ENVS = ['DOMAINS', 'API_KEY']

const missing = REQUIRED_ENVS.filter(key => process.env[key] == null)

if (missing.length > 0) {
  throw new Error(`Missing required environment variable(s): ${missing.join(', ')}`)
}

const { DOMAINS, API_KEY, API_ENDPOINT = 'https://pro.microlink.io' } = process.env

const allowedDomains = DOMAINS.split(',').map(n => n.trim())

const toSearchParams = req => new URL(req.url, 'http://localhost').searchParams

const proxy = (req, res) => {
  const stream = mql.stream(API_ENDPOINT, {
    searchParams: toSearchParams(req),
    headers: {
      'x-api-key': API_KEY,
      accept: req.headers.accept
    }
  })

  pipeline(stream, res)
}

const cors = createCors({ origin: allowedDomains })

module.exports = (req, res) => cors(req, res, () => proxy(req, res))

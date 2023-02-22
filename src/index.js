'use strict'

const mql = require('@microlink/mql')
const createCors = require('cors')

const REQUIRED_ENVS = ['ORIGINS', 'API_KEY']

const missing = REQUIRED_ENVS.filter(key => process.env[key] == null)

if (missing.length > 0) {
  throw new Error(`Missing required environment variable(s): ${missing.join(', ')}`)
}

const { ORIGINS, API_KEY, API_ENDPOINT = 'https://pro.microlink.io' } = process.env

const toSearchParams = req => new URL(req.url, 'http://[::]').searchParams

const proxy = (req, res) =>
  mql
    .stream(API_ENDPOINT, {
      searchParams: toSearchParams(req),
      headers: {
        'x-api-key': API_KEY,
        accept: req.headers.accept
      }
    })
    .pipe(res)

const cors = createCors({
  allowedHeaders: '*',
  maxAge: 86400,
  methods: ['GET', 'OPTIONS'],
  origin: ORIGINS.split(',').map(n => n.trim())
})

module.exports = (req, res) => cors(req, res, () => proxy(req, res))

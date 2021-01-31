<div align="center">
  <img src="https://cdn.microlink.io/banner/proxy.png" alt="microlink">
  <br><br>
</div>

[![Deploy with ZEIT Now](https://zeit.co/button)](https://zeit.co/new/project?template=https://github.com/microlinkhq/proxy)
[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

> Interact with Microlink API without exposing your creedentials.

## Motivation

Interacting directly with [Microlink API](https://microlink.io/docs/api/getting-started/overview) from frontend side is one of the most common scenarios.

However, it could be a risk security scenario if you are exposing your [`x-api-key`](https://microlink.io/docs/api/api-basics/authentication), being possible that anyone can steal it and consume your API quota.

For preventing that, this tiny microservice allows you interact with Microlink API without compromising your credentials.

## Usage

Deploy this microservice, setting up the necessaries environment variables.

After that, every time you need to interact with Microlink API, just call the microservice URL instead.

If you are using [`mql`](https://github.com/microlinkhq/mql), setup it as `endpoint` parameter:

```js
const mql = require('@microlink/mql')

mql('https://microlink.io', {
  endpoint: 'https://proxy.now.sh'
})
```

## Environment Variables

### DOMAINS

*Required*</br>
Type: `string`|`string[]`

The list of allowed domains authorized to consume your Microlink API credentials.

### API_KEY

*Required*</br>
Type: `string`

Your Microlink API key used to [authenticate](https://microlink.io/docs/api/api-basics/authentication) your requests.

## License

**microlink** © [Microlink](https://microlink.io), Released under the [MIT](https://github.com/microlinkhq/proxy/blob/master/LICENSE.md) License.<br>
Authored and maintained by Kiko Beats with help from [contributors](https://github.com/microlinkhq/proxy/contributors).

> [microlink.io](https://microlink.io) · GitHub [@MicrolinkHQ](https://github.com/microlinkhq) · Twitter [@microlinkhq](https://twitter.com/microlinkhq)

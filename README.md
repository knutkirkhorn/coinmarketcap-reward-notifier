# coinmarketcap-reward-notifier

> Get notified when new rewards are available on [CoinMarketCap](https://coinmarketcap.com/)

[![Discord server](https://img.shields.io/discord/891699682961686549?color=5865F2&logo=discord&logoColor=white)](https://discord.gg/CBtDPB5eFE) [![Docker Pulls](https://img.shields.io/docker/pulls/knutkirkhorn/coinmarketcap-reward-notifier)](https://hub.docker.com/r/knutkirkhorn/coinmarketcap-reward-notifier) [![Docker Image Size](https://badgen.net/docker/size/knutkirkhorn/coinmarketcap-reward-notifier)](https://hub.docker.com/r/knutkirkhorn/coinmarketcap-reward-notifier)

Notifies on Discord if new rewards are available on [CoinMarketCap](https://coinmarketcap.com/). Fetches newest rewards from their [API](https://api.coinmarketcap.com/shop/v3/product/list). It notifies to a Discord channel using [Discord Webhooks](https://discord.com/developers/docs/resources/webhook).

<div align="center">
	<img src="https://raw.githubusercontent.com/knutkirkhorn/coinmarketcap-reward-notifier/main/media/example.png" alt="CoinMarketCap reward notification example">
</div>

## Usage

### Join my Discord server

You can follow notifications in my [notifier server on Discord](https://discord.gg/CBtDPB5eFE) if you don't want to set this up yourself. It is possible to forward the messages from this server to your own.

### Within a Docker container

#### From Docker Hub Image

This will pull the image from [Docker Hub](https://hub.docker.com/) and run the image with the provided configuration for web hooks as below. It's required to provide account addresses, names and the Webhook URL or both the Webhook ID and token.

```sh
# Providing a Discord Webhook URL
$ docker run -d -e DISCORD_WEBHOOK_URL=<URL_HERE> knutkirkhorn/coinmarketcap-reward-notifier
```

#### From source code

```sh
# Build container from source
$ docker build -t coinmarketcap-reward-notifier .

# Providing a Discord Webhook URL
$ docker run -d -e DISCORD_WEBHOOK_URL=<URL_HERE> coinmarketcap-reward-notifier
```

### Outside of a Docker container

```sh
# Install
$ npm install

# Run
$ npm start
```

### Environment variables

Provide these with the docker run command or store these in a `.env` file.

- `DISCORD_WEBHOOK_URL`
    - URL to the Discord Webhook containing both the ID and the token
    - Format: `DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/<ID_HERE>/<TOKEN_HERE>`
- `DISCORD_WEBHOOK_ID`
    - ID for the Discord Webhook
- `DISCORD_WEBHOOK_TOKEN`
    - Token for the Discord Webhook
- `WAIT_TIMEOUT` ***(optional)***
    - The time interval in milliseconds between each check of CoinMarketCap rewards.
    - Default: `3600000` (60 minutes)

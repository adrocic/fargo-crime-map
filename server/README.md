<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Fargo Crime Map API

This is the backend API for the Fargo Crime Map project. It provides endpoints for retrieving crime data and map tiles.

## Features

- Dispatch log API endpoint to retrieve crime data
- OpenStreetMap tile caching and serving
- CouchDB integration for data persistence
- Swagger API documentation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- CouchDB (local or remote)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```
# CouchDB Configuration
COUCHDB_URL=http://localhost:5984
COUCHDB_USERNAME=admin
COUCHDB_PASSWORD=password

# Google Maps API (get a key from https://developers.google.com/maps/documentation/javascript/get-api-key)
GOOGLE_MAPS_API_KEY=

# Port Configuration (default: 3000)
PORT=3000

# Mock Data Configuration
USE_MOCK_DATA=true
```

### Running CouchDB with Docker

If you want to use Docker for CouchDB:

```bash
docker-compose up -d
```

After starting CouchDB for the first time, run the setup script:

```bash
# Windows
powershell -ExecutionPolicy Bypass -File ./setup-couchdb.ps1

# Linux/Mac
chmod +x setup-couchdb.sh
./setup-couchdb.sh
```

### Running the API

Development mode:

```bash
npm run start:dev
```

Production mode:

```bash
npm run build
npm run start:prod
```

## API Documentation

Once the server is running, you can access the Swagger documentation at:

```
http://localhost:3000/api
```

## Project Structure

- `src/controllers/` - API endpoint controllers
- `src/services/` - Business logic
- `src/modules/` - NestJS modules
- `src/utils/` - Utility functions
- `static/maptiles/` - Local storage for cached map tiles

## License

MIT

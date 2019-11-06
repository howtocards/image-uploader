# image-uploader

## Setup

```sh
yarn
```

## Configuration

with env variables

- **VOLUME** — relative or absolute path where to save files. default `./files`
- **LISTEN_PORT** — port where to start http server. default `4000`

## Development

- `yarn start` — run uploader server
- `CTRL+C` — stop server

## API

### `POST /upload`

- `Content-Type: multipart/form-data`

Receives one or multiple files in body.

**Returns**: `application/json`

**All files uploaded**:

```json
{
  "status": "ok",
  "files": [
    {
      "ok": true,
      "path": "/H23s/9-z1/1kPi6Enkch1lMXLrfwcEcg8RJkpnti.jpg",
      "name": "example"
    }
  ]
}
```

**Not all files uploaded**:

```json
{
  "status": "partial",
  "files": [
    {
      "ok": true,
      "path": "/H23s/9-z1/1kPi6Enkch1lMXLrfwcEcg8RJkpnti.jpg",
      "name": "example1"
    },
    {
      "ok": false,
      "error": "UNEXPECTED ERROR : THIS IS NOT A CONSTANT",
      "name": "example2"
    }
  ]
}
```

**All failed**:

```json
{
  "status": "ok",
  "files": [
    {
      "ok": false,
      "error": "UNEXPECTED ERROR : THIS IS NOT A CONSTANT",
      "name": "example"
    }
  ]
}
```

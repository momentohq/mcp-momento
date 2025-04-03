# Basic MCP Server

A simple Model Context Protocol (MCP) server implementation for Momento Cache in Node.js.

## Tools

- `get` -- Get the cache value stored for the given key. Returns a `Hit` if the key was found, `Miss` if the key was not found, or `Error` if the request failed.
- `set` -- Sets the value in cache with a given Time To Live (TTL) seconds. If a value for this key is already present, it will be replaced by the new value regardless of the previous value's data type. Returns a `Success` or `Error` response.

## Setup

1. Get a Momento API key from the [Momento Console](https://console.gomomento.com/).

2. Install dependencies:
```bash
npm install
```

3. Build the server:
```bash
npm run build
```

4. Set optional environment variables to configure the cache name and Time To Live (TTL) for items in the cache.
```bash
export MOMENTO_CACHE_NAME="your-cache-name"
export DEFAULT_TTL_SECONDS=60
```

## Usage with NPX

```json
{
  "mcpServers": {
    "momento": {
      "command": "npx",
      "args": [
        "-y",
        "@gomomento/mcp-momento"
      ],
      "env": {
        "MOMENTO_API_KEY": "your-api-key"
      }
    }
  }
}
```

## Usage with MCP Inspector

```bash
export MOMENTO_API_KEY="your-api-key"
npx @modelcontextprotocol/inspector node dist/index.js
```
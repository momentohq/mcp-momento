# Basic MCP Server

A simple Model Context Protocol (MCP) server implementation for Momento Cache in Node.js.

## Tools

- `get`
- `set`

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

4. Set optional environment variables to configure the cache name and time-to-live (TTL) for items in the cache.
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
[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/momentohq-mcp-momento-badge.png)](https://mseep.ai/app/momentohq-mcp-momento)

# Momento MCP Server

A simple Model Context Protocol (MCP) server implementation for Momento Cache.

Available on npmjs as [`@gomomento/mcp-momento`](https://www.npmjs.com/package/@gomomento/mcp-momento)

## Tools

- `get`
  - Get the cache value stored for the given key.
  - Inputs:
    - `key` string -- the key to look up in the cache.
    - `cacheName` string -- the name cache where the key presides (*optional*)
  - Returns:
    - `Hit` with the found value if the key was found.
    - `Miss` if the key was not found.
    - `Error` if the request failed.
- `set`
  - Sets the value in cache with a given Time To Live (TTL) seconds. If a value for this key is already present, it will be replaced by the new value regardless of the previous value's data type.
  - Inputs:
    - `key`: string -- the key to set in the cache
    - `value`: string -- the value to set for the given key
    - `ttl`: integer -- the number of seconds to keep this value in the cache (*optional*)
    - `cacheName`: string -- the name of the cache to store the key in (*optional*)
  - Returns:
    - `Success` if the key was successfully written to the cache.
    - `Error` if the request failed.
- `list-caches`
  - Lists the names of all the caches in your Momento account.
  - Inputs:
    - (none)
  - Returns:
    - `Success` with a comma separated list of cache names
    - `Error` if the request failed
- `create-cache`
  - Creates a new cache in your Momento account
  - Inputs:
    - `name`: string - the name of the cache to create
  - Returns:
    - `Success` if the cache was successfully created
    - `Error` if the request failed
- `delete-cache`
  - Deletes a cache from your Momento account
  - Inputs:
    - `name`: string - the name of the cache to delete
  - Returns:
    - `Success` if the cache was successfully deleted
    - `Error` if the request failed

## Quickstart

1. Get a Momento API key from the [Momento Console](https://console.gomomento.com/). *Note - to run control plane tools (`list-caches`, `create-cache`, `delete-cache`), you must use a **super user API key**.*

2. Set environment variables to configure the cache name and Time To Live (TTL) for items in the cache.
    ```bash
    # required
    export MOMENTO_API_KEY="your-api-key"

    # optional
    export MOMENTO_CACHE_NAME="your-cache-name"
    export DEFAULT_TTL_SECONDS=60
    ```
  If you do not set these values, it will use `mcp-momento` as the cache name and `60 seconds` for the default time to live.

### Usage with MCP Inspector

```bash
npx -y @modelcontextprotocol/inspector npx @gomomento/mcp-momento@latest
```

### Usage with NPX on Claude Desktop

Note: if you're using `nodenv`, replace the plain `npx` with the path to your npx binary (e.g. `/Users/username/.nodenv/shims/npx`).

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
        "MOMENTO_API_KEY": "your-api-key",
        "MOMENTO_CACHE_NAME": "your-cache-name",
        "DEFAULT_TTL_SECONDS": 60
      }
    }
  }
}
```

## Setup for local development

1. Install dependencies:
    ```bash
    npm install
    ```

2. Build the server:
    ```bash
    npm run build
    ```

3. Run with MCP Inspector
    ```bash
    export MOMENTO_API_KEY="your-api-key"
    npx @modelcontextprotocol/inspector node dist/index.js
    ```

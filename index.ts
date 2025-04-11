#!/usr/bin/env node
import {
  CacheClient,
  CacheGetResponse,
  CacheSetResponse,
  ListCachesResponse,
  CreateCacheResponse,
  DeleteCacheResponse,
  Configurations,
  CredentialProvider,
  NoopMomentoLoggerFactory,
} from "@gomomento/sdk";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create server instance
const mcpServer = new McpServer({
  name: "momento",
  version: "0.1.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Helper function for reading environment variables
function readEnvironmentVariable(name: string, defaultValue: string): string {
  const value = process.env[name];
  if (!value) {
    console.warn(
      `Environment variable ${name} is not set. Using default value ${defaultValue}.`
    );
    return defaultValue;
  }
  return value;
}

// Create Momento client
const defaultTtlSeconds = Number(
  readEnvironmentVariable("DEFAULT_TTL_SECONDS", "60")
);
const momento = new CacheClient({
  credentialProvider: CredentialProvider.fromEnvVar("MOMENTO_API_KEY"),
  configuration: Configurations.Laptop.v1(new NoopMomentoLoggerFactory()),
  defaultTtlSeconds,
});

// Initialize the cache if it does not already exist
const defaultCacheName = readEnvironmentVariable(
  "MOMENTO_CACHE_NAME",
  "mcp-momento"
);

// Schema definitions
const GetArgsSchema = z.object({
  key: z.string().describe("The key to get from the cache"),
  cacheName: z
    .string()
    .describe(
      "The name of the cache to get the value from. Uses the default cache name if not provided."
    )
    .optional(),
});

const SetArgsSchema = z.object({
  key: z.string().describe("The key to set in the cache"),
  value: z.string().describe("The value to set in the cache"),
  ttl: z.number().describe("The TTL for the key in seconds").optional(),
  cacheName: z
    .string()
    .describe(
      "The name of the cache to set the value in. Uses the default cache name if not provided."
    )
    .optional(),
});

const CreateCacheArgsSchema = z.object({
  name: z.string().describe("The name of the cache to create"),
});

const DeleteCacheArgsSchema = z.object({
  name: z.string().describe("The name of the cache to delete"),
});

// Tool handlers seem to register the tools for 'tools/list' endpoint too
mcpServer.tool(
  "get",
  "get a key-value pair from the cache",
  GetArgsSchema.shape,
  async ({ key, cacheName }) => {
    cacheName = cacheName ?? defaultCacheName;
    const result = await momento.get(cacheName, key);
    switch (result.type) {
      case CacheGetResponse.Hit:
        return {
          content: [
            { type: "text", text: `Status: HIT\nValue: ${result.value()}` },
          ],
        };
      case CacheGetResponse.Miss:
        return {
          content: [{ type: "text", text: "Status: MISS" }],
        };
      case CacheGetResponse.Error:
        return {
          content: [
            {
              type: "text",
              text: `Status: ERROR:\nDetails: ${result.message()}`,
            },
          ],
        };
      default:
        return {
          content: [
            {
              type: "text",
              text: `Status: UNKNOWN RESPONSE:\nDetails: ${result}`,
            },
          ],
        };
    }
  }
);

mcpServer.tool(
  "set",
  "set a key-value pair in the cache",
  SetArgsSchema.shape,
  async ({ key, value, ttl, cacheName }) => {
    cacheName = cacheName ?? defaultCacheName;
    const result = await momento.set(cacheName, key, value, { ttl });
    switch (result.type) {
      case CacheSetResponse.Success:
        return {
          content: [{ type: "text", text: "Status: SUCCESS" }],
        };
      case CacheSetResponse.Error:
        return {
          content: [
            {
              type: "text",
              text: `Status: ERROR:\nDetails: ${result.message()}`,
            },
          ],
        };
      default:
        return {
          content: [
            {
              type: "text",
              text: `Status: UNKNOWN RESPONSE:\nDetails: ${result}`,
            },
          ],
        };
    }
  }
);

mcpServer.tool(
  "list-caches",
  "Lists all cache names in your Momento account",
  {},
  async () => {
    const result = await momento.listCaches();
    switch (result.type) {
      case ListCachesResponse.Success:
        return {
          content: [
            {
              type: "text",
              text: `Status: SUCCESS\nCaches: ${result
                .getCaches()
                .map((cache) => cache.getName())
                .join("\n")}`,
            },
          ],
        };
      case ListCachesResponse.Error:
        return {
          content: [
            {
              type: "text",
              text: `Status: ERROR:\nDetails: ${result.message()}`,
            },
          ],
        };
      default:
        return {
          content: [
            {
              type: "text",
              text: `Status: UNKNOWN RESPONSE:\nDetails: ${result}`,
            },
          ],
        };
    }
  }
);

mcpServer.tool(
  "create-cache",
  "Creates a new cache",
  CreateCacheArgsSchema.shape,
  async ({ name }) => {
    const result = await momento.createCache(name);
    switch (result.type) {
      case CreateCacheResponse.Success:
        return {
          content: [
            {
              type: "text",
              text: `Status: SUCCESS`,
            },
          ],
        };
      case CreateCacheResponse.Error:
        return {
          content: [
            {
              type: "text",
              text: `Status: ERROR:\nDetails: ${result.message()}`,
            },
          ],
        };
      default:
        return {
          content: [
            {
              type: "text",
              text: `Status: UNKNOWN RESPONSE:\nDetails: ${result}`,
            },
          ],
        };
    }
  }
);

mcpServer.tool(
  "delete-cache",
  "Deletes a cache and all contained values from your Momento account",
  DeleteCacheArgsSchema.shape,
  async ({ name }) => {
    const result = await momento.deleteCache(name);
    switch (result.type) {
      case DeleteCacheResponse.Success:
        return {
          content: [
            {
              type: "text",
              text: `Status: SUCCESS`,
            },
          ],
        };
      case DeleteCacheResponse.Error:
        return {
          content: [
            {
              type: "text",
              text: `Status: ERROR:\nDetails: ${result.message()}`,
            },
          ],
        };
      default:
        return {
          content: [
            {
              type: "text",
              text: `Status: UNKNOWN RESPONSE:\nDetails: ${result}`,
            },
          ],
        };
    }
  }
);

async function main() {
  // Run the server
  const transport = new StdioServerTransport();
  await mcpServer.connect(transport);
  console.error("Momento MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});

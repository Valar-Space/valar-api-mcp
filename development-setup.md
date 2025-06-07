# Development Setup Guide

This guide helps you set up the Valar API MCP for development and testing.

## Quick Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up credentials for testing (optional):**
   ```bash
   # For local testing only - in production, credentials come from MCP client
   export VALAR_USERNAME="your_username"
   export VALAR_PASSWORD="your_password"
   ```

3. **Validate configuration:**
   ```bash
   pnpm validate
   ```

4. **Build the project:**
   ```bash
   pnpm build
   ```

5. **Test the MCP server (development mode):**
   ```bash
   pnpm dev
   ```

## Testing with MCP Inspector

You can test the MCP using the MCP Inspector tool:

1. **Install MCP Inspector:**
   ```bash
   npx @modelcontextprotocol/inspector
   ```

2. **Run the inspector with your MCP:**
   ```bash
   npx @modelcontextprotocol/inspector node dist/index.js
   ```

## Configuration for Cursor

Add this to your Cursor MCP configuration file:

```json
{
  "mcpServers": {
    "valar-api": {
      "command": "node",
      "args": ["./dist/index.js"],
      "cwd": "/absolute/path/to/valar-mcp",
      "env": {
        "VALAR_USERNAME": "your_valar_username",
        "VALAR_PASSWORD": "your_valar_password"
      }
    }
  }
}
```

**Important**: Replace `/absolute/path/to/valar-mcp` with the actual absolute path to your project directory.

## Available Commands

- `pnpm validate` - Validate configuration and environment
- `pnpm build` - Build TypeScript to JavaScript
- `pnpm dev` - Run in development mode with tsx
- `pnpm start` - Run the built version
- `pnpm mcp` - Alias for start

## Testing the Tools

Once the MCP is running, you can test these tools:

1. **list-microservices** - No parameters required
2. **get-api-spec** - Requires: microservice name
3. **list-endpoints** - Requires: microservice name
4. **get-endpoint-info** - Requires: microservice name, path, optional method
5. **search-endpoints** - Requires: microservice name, search query

## Example Workflow

```bash
# 1. Set up environment
export VALAR_USERNAME="your_username"
export VALAR_PASSWORD="your_password"

# 2. Validate and build
pnpm validate
pnpm build

# 3. Test with MCP Inspector
npx @modelcontextprotocol/inspector node dist/index.js

# 4. In the inspector, try these tools:
# - list-microservices
# - search-endpoints with microservice="orbits" and query="orbit"
```

## Troubleshooting

- **Build errors**: Run `pnpm install` to ensure all dependencies are installed
- **Credential errors**: Make sure VALAR_USERNAME and VALAR_PASSWORD are set in your MCP client configuration
- **Runtime errors**: Check that the microservice URLs in config.ts are correct
- **Authentication errors**: Verify your credentials with the actual Valar APIs
- **MCP connection errors**: Ensure the absolute path in your MCP config is correct

## Customizing Microservices

Edit `src/config.ts` to add or modify microservices:

```typescript
export const MICROSERVICES: MicroserviceConfig[] = [
  {
    name: 'your-service',
    baseUrl: 'https://api-your-service.valar.com',
    oauthUrl: 'https://api-your-service.valar.com/oauth/token',
    docsPath: '/docs/openapi.json',
    description: 'Your service description'
  },
  // ... existing services
];
```

Remember to rebuild after making changes: `pnpm build` 
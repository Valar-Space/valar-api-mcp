# 🚀 Valar API MCP

**The ultimate superpower for Valar frontend developers!** 

Turn this simple request...

> **Developer**: *"Integrate the Orbits table with the API backend"*

...into this **magical** workflow:

```
🤖 Cursor + Valar API MCP:
  ├── 🔍 Instantly searches across ALL Valar microservices
  ├── 📡 Finds relevant orbit endpoints automatically  
  ├── 📝 Downloads fresh API documentation in real-time
  ├── 🧠 Understands request/response schemas
  └── ✨ Generates perfect integration code
```

**No more hunting through Swagger docs. No more outdated API references. No more guessing.** 

This MCP (Model Context Protocol) server transforms how you work with Valar's microservice ecosystem by giving Cursor **direct access** to live API documentation from all your services.

## 🌟 Why This MCP Will Change Your Life

- **🔐 Zero-Config OAuth**: Automatically handles authentication with ALL Valar APIs
- **🌐 Multi-Microservice Magic**: Access documentation from orbits, users, analytics, and any future services
- **🎯 Intelligent Discovery**: Ask for "user permissions" and instantly find the right endpoints
- **⚡ Real-Time Everything**: Fresh OpenAPI specs on every request - no stale docs ever
- **🔎 Smart Search**: Find endpoints by functionality, not just names - search "upload image" and get relevant endpoints
- **💡 Context-Aware**: Cursor understands your entire API ecosystem and suggests the best approaches

## 🎬 See It In Action

Imagine these **real conversations** with Cursor:

### 🛰️ Scenario 1: "Add user authentication to the orbit viewer"
```
You: "Add user authentication to the orbit viewer"

Cursor: Let me help you integrate authentication! 
*[Uses Valar API MCP to search for auth endpoints]*

I found the users API has several authentication endpoints:
- POST /auth/login - User login with credentials
- GET /auth/profile - Get current user profile  
- POST /auth/refresh - Refresh access token

Here's the integration code:
[Generates perfect TypeScript with proper types]
```

### 📊 Scenario 2: "Show analytics for orbit calculations"
```
You: "Show analytics for orbit calculations"

Cursor: I'll integrate analytics tracking for you!
*[Searches analytics API for relevant endpoints]*

Found these analytics endpoints:
- POST /analytics/events - Track user events
- GET /analytics/metrics - Get calculation metrics
- POST /analytics/orbit-usage - Track orbit computation usage

[Generates complete analytics integration with error handling]
```

### 🔍 Scenario 3: "Find all endpoints that work with orbit data"
```
You: "Find all endpoints that work with orbit data" 

Cursor: *[Searches across ALL microservices for "orbit"]*

Found 12 orbit-related endpoints across 3 microservices:

🛰️ Orbits API:
- GET /orbits - List all orbits
- POST /orbits - Create new orbit
- GET /orbits/{id}/trajectory - Get orbit path

👥 Users API:  
- GET /users/{id}/orbits - User's saved orbits
- POST /users/{id}/orbit-preferences - Save orbit settings

📊 Analytics API:
- POST /analytics/orbit-calculations - Track computations
- GET /analytics/orbit-popularity - Most viewed orbits

[Shows detailed docs for each endpoint]
```

**This is the power of having live API docs at your fingertips!** 🚀

## 🚀 Ready to Transform Your Development Experience?

**Just 3 steps to API enlightenment:**

1. **⚡ Quick Setup** - Clone, build, configure (5 minutes)
2. **🔌 Connect to Cursor** - Add one JSON config block
3. **🎉 Start Coding** - Ask Cursor anything about your APIs

**Your future self will thank you.** No more:
- ❌ Switching between 12 browser tabs to find API docs
- ❌ Guessing parameter names and types
- ❌ Using outdated API examples that don't work
- ❌ Writing integration code from scratch every time

**Instead, you get:**
- ✅ Instant access to live API docs in your editor
- ✅ AI that understands your entire microservice ecosystem  
- ✅ Perfect code generation with correct types and error handling
- ✅ Natural language API discovery and integration

---

## 🛠️ Technical Details

### Available Tools

### `list-microservices`
Lists all configured Valar microservices with their base URLs and descriptions.

### `get-api-spec`
Downloads the complete OpenAPI specification for a specific microservice.
- **Parameters**: `microservice` (string) - Name of the microservice

### `list-endpoints`
Lists all available endpoints for a specific microservice.
- **Parameters**: `microservice` (string) - Name of the microservice

### `get-endpoint-info`
Gets detailed information about a specific API endpoint.
- **Parameters**: 
  - `microservice` (string) - Name of the microservice
  - `path` (string) - API endpoint path (e.g., "/users", "/orbits/{id}")
  - `method` (optional string) - HTTP method (GET, POST, PUT, DELETE, etc.)

### `search-endpoints`
Searches for endpoints using keywords across paths, descriptions, tags, and parameters.
- **Parameters**:
  - `microservice` (string) - Name of the microservice to search in
  - `query` (string) - Search query

## ⚡ 5-Minute Setup

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd valar-mcp
pnpm install
```

### 2. Build the MCP
```bash
pnpm build
```

### 3. Add to Cursor

Add this **one block** to your Cursor MCP configuration:

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

**That's it!** Restart Cursor and you're ready to unlock API superpowers! 🦸‍♂️

### 4. (Optional) Configure Additional Microservices

Want to add more APIs? Edit `src/config.ts`:

```typescript
export const MICROSERVICES: MicroserviceConfig[] = [
  {
    name: 'orbits',
    baseUrl: 'https://api-orbits.valar.com',
    oauthUrl: 'https://api-orbits.valar.com/oauth/token',
    docsPath: '/docs/openapi.json',
    description: 'Valar Orbits API - handles orbital data and calculations'
  },
  // Add more microservices here...
];
```

### 5. Test Your Setup (Optional)

```bash
# Validate everything is working
pnpm validate

# Test with MCP Inspector
npx @modelcontextprotocol/inspector node dist/index.js
```

## Usage Examples

### Example Workflow: Integrating Orbits Table with API

1. **Discover Available Microservices**
   ```
   Use tool: list-microservices
   ```

2. **Search for Orbits-Related Endpoints**
   ```
   Use tool: search-endpoints
   - microservice: "orbits"
   - query: "table"
   ```

3. **Get Detailed Endpoint Information**
   ```
   Use tool: get-endpoint-info
   - microservice: "orbits"
   - path: "/orbits"
   - method: "GET"
   ```

4. **Get Complete API Specification (if needed)**
   ```
   Use tool: get-api-spec
   - microservice: "orbits"
   ```

### 🎯 Pro Tips for Maximum Awesomeness

Once you're set up, try these **power moves**:

- **🎮 Natural Language Queries**: Ask "How do I get user preferences?" instead of hunting through docs
- **🔗 Cross-Service Discovery**: Find related endpoints across multiple microservices instantly  
- **📋 Schema Exploration**: Get full TypeScript types generated from OpenAPI schemas
- **🚀 Rapid Prototyping**: Build API integrations in seconds, not hours
- **🔄 Always Fresh**: Never worry about stale documentation again

### 💡 Example Cursor Conversations

Try these exact phrases with Cursor after setup:

```
"Show me all endpoints for managing user data"
"How do I upload orbit calculations to analytics?"  
"What's the schema for the orbit trajectory endpoint?"
"Find endpoints that return user preferences"
"Generate code to authenticate and fetch orbit data"
```

**Watch Cursor transform from a code editor into an API integration wizard!** ✨

## Configuration

### Microservice Configuration

Each microservice in `src/config.ts` requires:

- `name`: Unique identifier for the microservice
- `baseUrl`: Base URL of the API server
- `oauthUrl`: OAuth token endpoint URL
- `docsPath`: Path to the OpenAPI JSON specification
- `description`: Optional description of the microservice

### Authentication

The MCP uses OAuth 2.0 password grant flow. Credentials are provided by the MCP client configuration:

- `VALAR_USERNAME`: Your Valar account username (set in client config)
- `VALAR_PASSWORD`: Your Valar account password (set in client config)

Tokens are automatically cached and refreshed as needed. This approach ensures credentials are managed securely by the client rather than stored in the server.

## Error Handling

The MCP provides detailed error messages for common issues:

- Invalid microservice names
- Authentication failures
- Missing endpoints
- Network connectivity issues

## Security

- Credentials are stored as environment variables
- OAuth tokens are cached in memory only
- All API calls use HTTPS
- Tokens are automatically refreshed when expired

## Development

### Project Structure

```
src/
├── index.ts          # Main MCP server
├── config.ts         # Microservice configurations
├── types.ts          # TypeScript type definitions
├── api-client.ts     # OAuth and HTTP client
└── api-service.ts    # Business logic and formatting
```

### Adding New Microservices

1. Add the microservice configuration to `MICROSERVICES` array in `src/config.ts`
2. Ensure the microservice follows the same OAuth and OpenAPI patterns
3. Test the integration using the MCP tools

### Building

The project uses TypeScript and builds to the `dist/` directory:

```bash
pnpm build  # Compiles TypeScript to JavaScript
```

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify `VALAR_USERNAME` and `VALAR_PASSWORD` are set correctly in your MCP client configuration
   - Check that the OAuth URLs are accessible

2. **Microservice Not Found**
   - Ensure the microservice name matches exactly (case-insensitive)
   - Check that the microservice is configured in `src/config.ts`

3. **Network Errors**
   - Verify microservice URLs are accessible
   - Check network connectivity and firewall settings

### Debug Mode

Run with debug logging:

```bash
DEBUG=* pnpm dev
```

## License

MIT License - see LICENSE file for details. 
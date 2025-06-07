#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    ToolSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { ValarApiClient } from './api-client.js';
import { ValarApiService } from './api-service.js';
import {
    getOAuthCredentials,
    getAllMicroservices,
    getMicroserviceByName
} from './config.js';

// Initialize the server
const server = new Server(
    {
        name: 'valar-api-mcp',
        version: '1.0.0',
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// Initialize services (will be created when credentials are available)
let apiClient: ValarApiClient | null = null;
let apiService: ValarApiService | null = null;

function ensureServicesInitialized(): { apiClient: ValarApiClient; apiService: ValarApiService } {
    if (!apiClient || !apiService) {
        throw new Error('Valar API services not initialized. This should not happen as they are initialized at startup.');
    }
    return { apiClient, apiService };
}

// Define tool schemas
const ListMicroservicesSchema = ToolSchema.parse({
    name: 'list-microservices',
    description: 'List all available Valar microservices with their configurations',
    inputSchema: {
        type: 'object',
        properties: {},
        required: [],
    },
});

const GetApiSpecSchema = ToolSchema.parse({
    name: 'get-api-spec',
    description: 'Download the complete OpenAPI specification for a specific microservice',
    inputSchema: {
        type: 'object',
        properties: {
            microservice: {
                type: 'string',
                description: 'Name of the microservice (e.g., "orbits", "users", "analytics")',
            },
        },
        required: ['microservice'],
    },
});

const ListEndpointsSchema = ToolSchema.parse({
    name: 'list-endpoints',
    description: 'List all available endpoints for a specific microservice',
    inputSchema: {
        type: 'object',
        properties: {
            microservice: {
                type: 'string',
                description: 'Name of the microservice',
            },
        },
        required: ['microservice'],
    },
});

const GetEndpointInfoSchema = ToolSchema.parse({
    name: 'get-endpoint-info',
    description: 'Get detailed information about a specific endpoint',
    inputSchema: {
        type: 'object',
        properties: {
            microservice: {
                type: 'string',
                description: 'Name of the microservice',
            },
            path: {
                type: 'string',
                description: 'API endpoint path (e.g., "/users", "/orbits/{id}")',
            },
            method: {
                type: 'string',
                description: 'HTTP method (optional, if not specified returns all methods for the path)',
                enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
            },
        },
        required: ['microservice', 'path'],
    },
});

const SearchEndpointsSchema = ToolSchema.parse({
    name: 'search-endpoints',
    description: 'Search for endpoints across a microservice using keywords',
    inputSchema: {
        type: 'object',
        properties: {
            microservice: {
                type: 'string',
                description: 'Name of the microservice to search in',
            },
            query: {
                type: 'string',
                description: 'Search query (searches in paths, descriptions, tags, parameters, etc.)',
            },
        },
        required: ['microservice', 'query'],
    },
});

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            ListMicroservicesSchema,
            GetApiSpecSchema,
            ListEndpointsSchema,
            GetEndpointInfoSchema,
            SearchEndpointsSchema,
        ],
    };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
    const { name, arguments: args } = request.params;

    try {
        switch (name) {
            case 'list-microservices': {
                const microservices = getAllMicroservices();
                let result = 'Available Valar Microservices:\n\n';

                for (const ms of microservices) {
                    result += `**${ms.name}**\n`;
                    result += `  Base URL: ${ms.baseUrl}\n`;
                    result += `  OAuth URL: ${ms.oauthUrl}\n`;
                    result += `  Docs Path: ${ms.docsPath}\n`;
                    if (ms.description) {
                        result += `  Description: ${ms.description}\n`;
                    }
                    result += '\n';
                }

                return {
                    content: [{ type: 'text', text: result }],
                };
            }

            case 'get-api-spec': {
                const { microservice } = z.object({
                    microservice: z.string(),
                }).parse(args);

                const msConfig = getMicroserviceByName(microservice);
                if (!msConfig) {
                    throw new Error(`Microservice "${microservice}" not found. Available: ${getAllMicroservices().map(ms => ms.name).join(', ')}`);
                }

                const { apiService } = ensureServicesInitialized();
                const spec = await apiService.getOpenApiSpec(msConfig);

                return {
                    content: [
                        {
                            type: 'text',
                            text: `OpenAPI Specification for ${msConfig.name}:\n\n${JSON.stringify(spec, null, 2)}`
                        }
                    ],
                };
            }

            case 'list-endpoints': {
                const { microservice } = z.object({
                    microservice: z.string(),
                }).parse(args);

                const msConfig = getMicroserviceByName(microservice);
                if (!msConfig) {
                    throw new Error(`Microservice "${microservice}" not found. Available: ${getAllMicroservices().map(ms => ms.name).join(', ')}`);
                }

                const { apiService } = ensureServicesInitialized();
                const endpoints = await apiService.getAllEndpoints(msConfig);

                let result = `Endpoints for ${msConfig.name} (${endpoints.length} total):\n\n`;

                for (const endpoint of endpoints) {
                    result += `**${endpoint.method} ${endpoint.path}**\n`;
                    if (endpoint.operation.summary) {
                        result += `  Summary: ${endpoint.operation.summary}\n`;
                    }
                    if (endpoint.operation.tags && endpoint.operation.tags.length > 0) {
                        result += `  Tags: ${endpoint.operation.tags.join(', ')}\n`;
                    }
                    result += '\n';
                }

                return {
                    content: [{ type: 'text', text: result }],
                };
            }

            case 'get-endpoint-info': {
                const { microservice, path, method } = z.object({
                    microservice: z.string(),
                    path: z.string(),
                    method: z.string().optional(),
                }).parse(args);

                const msConfig = getMicroserviceByName(microservice);
                if (!msConfig) {
                    throw new Error(`Microservice "${microservice}" not found. Available: ${getAllMicroservices().map(ms => ms.name).join(', ')}`);
                }

                const { apiService } = ensureServicesInitialized();
                const endpoints = await apiService.getEndpointInfo(msConfig, path, method);

                let result = `Endpoint Information for ${path} in ${msConfig.name}:\n\n`;

                for (const endpoint of endpoints) {
                    result += apiService.formatEndpointSummary(endpoint);
                    result += '\n---\n\n';
                }

                return {
                    content: [{ type: 'text', text: result }],
                };
            }

            case 'search-endpoints': {
                const { microservice, query } = z.object({
                    microservice: z.string(),
                    query: z.string(),
                }).parse(args);

                const msConfig = getMicroserviceByName(microservice);
                if (!msConfig) {
                    throw new Error(`Microservice "${microservice}" not found. Available: ${getAllMicroservices().map(ms => ms.name).join(', ')}`);
                }

                const { apiService } = ensureServicesInitialized();
                const results = await apiService.searchEndpoints(msConfig, query);
                const formatted = apiService.formatSearchResults(results);

                return {
                    content: [{ type: 'text', text: formatted }],
                };
            }

            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
            content: [{ type: 'text', text: `Error: ${errorMessage}` }],
            isError: true,
        };
    }
});

// Start the server
async function main() {
    // Test authentication immediately on startup
    try {
        console.error('Initializing Valar API MCP server...');
        const credentials = getOAuthCredentials();
        const testApiClient = new ValarApiClient(credentials);
        const microservices = getAllMicroservices();

        await testApiClient.testAuthentication(microservices);

        // Initialize the global services after successful authentication
        apiClient = testApiClient;
        apiService = new ValarApiService(apiClient);

    } catch (error) {
        console.error('Failed to authenticate with Valar API:', error instanceof Error ? error.message : error);
        console.error('Please check your VALAR_USERNAME and VALAR_PASSWORD credentials.');
        process.exit(1);
    }

    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Valar API MCP server running on stdio');
}

main().catch((error) => {
    console.error('Fatal error in main():', error);
    process.exit(1);
}); 
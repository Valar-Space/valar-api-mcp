import { ValarApiClient } from './api-client.js';
import {
    MicroserviceConfig,
    OpenAPISpec,
    EndpointInfo,
    SearchResult,
    OpenAPIOperation
} from './types.js';

export class ValarApiService {
    constructor(private apiClient: ValarApiClient) { }

    async getOpenApiSpec(microservice: MicroserviceConfig): Promise<OpenAPISpec> {
        return await this.apiClient.fetchOpenApiSpec(microservice);
    }

    async getAllEndpoints(microservice: MicroserviceConfig): Promise<EndpointInfo[]> {
        const spec = await this.getOpenApiSpec(microservice);
        const endpoints: EndpointInfo[] = [];

        for (const [path, pathItem] of Object.entries(spec.paths)) {
            for (const [method, operation] of Object.entries(pathItem)) {
                if (this.isValidHttpMethod(method)) {
                    endpoints.push({
                        path,
                        method: method.toUpperCase(),
                        operation: operation as OpenAPIOperation,
                        microservice: microservice.name
                    });
                }
            }
        }

        return endpoints;
    }

    async getEndpointInfo(
        microservice: MicroserviceConfig,
        path: string,
        method?: string
    ): Promise<EndpointInfo[]> {
        const spec = await this.getOpenApiSpec(microservice);
        const endpoints: EndpointInfo[] = [];

        // Normalize path (ensure it starts with /)
        const normalizedPath = path.startsWith('/') ? path : `/${path}`;

        const pathItem = spec.paths[normalizedPath];
        if (!pathItem) {
            // Try fuzzy matching if exact path not found
            const fuzzyPath = Object.keys(spec.paths).find(p =>
                p.toLowerCase().includes(normalizedPath.toLowerCase()) ||
                normalizedPath.toLowerCase().includes(p.toLowerCase())
            );

            if (fuzzyPath) {
                return this.getEndpointInfo(microservice, fuzzyPath, method);
            }

            throw new Error(`Endpoint ${normalizedPath} not found in ${microservice.name} API`);
        }

        for (const [httpMethod, operation] of Object.entries(pathItem)) {
            if (this.isValidHttpMethod(httpMethod)) {
                if (!method || httpMethod.toLowerCase() === method.toLowerCase()) {
                    endpoints.push({
                        path: normalizedPath,
                        method: httpMethod.toUpperCase(),
                        operation: operation as OpenAPIOperation,
                        microservice: microservice.name
                    });
                }
            }
        }

        if (method && endpoints.length === 0) {
            throw new Error(`Method ${method} not found for endpoint ${normalizedPath} in ${microservice.name} API`);
        }

        return endpoints;
    }

    async searchEndpoints(
        microservice: MicroserviceConfig,
        query: string
    ): Promise<SearchResult[]> {
        const endpoints = await this.getAllEndpoints(microservice);
        const results: SearchResult[] = [];
        const queryLower = query.toLowerCase();

        for (const endpoint of endpoints) {
            const matches: string[] = [];
            let score = 0;

            // Search in path
            if (endpoint.path.toLowerCase().includes(queryLower)) {
                matches.push(`path: ${endpoint.path}`);
                score += 10;
            }

            // Search in operation ID
            if (endpoint.operation.operationId?.toLowerCase().includes(queryLower)) {
                matches.push(`operationId: ${endpoint.operation.operationId}`);
                score += 8;
            }

            // Search in summary
            if (endpoint.operation.summary?.toLowerCase().includes(queryLower)) {
                matches.push(`summary: ${endpoint.operation.summary}`);
                score += 6;
            }

            // Search in description
            if (endpoint.operation.description?.toLowerCase().includes(queryLower)) {
                matches.push(`description: ${endpoint.operation.description}`);
                score += 4;
            }

            // Search in tags
            if (endpoint.operation.tags?.some(tag => tag.toLowerCase().includes(queryLower))) {
                const matchingTags = endpoint.operation.tags.filter(tag =>
                    tag.toLowerCase().includes(queryLower)
                );
                matches.push(`tags: ${matchingTags.join(', ')}`);
                score += 3;
            }

            // Search in parameters
            if (endpoint.operation.parameters?.some(param =>
                param.name.toLowerCase().includes(queryLower) ||
                param.description?.toLowerCase().includes(queryLower)
            )) {
                const matchingParams = endpoint.operation.parameters
                    .filter(param =>
                        param.name.toLowerCase().includes(queryLower) ||
                        param.description?.toLowerCase().includes(queryLower)
                    )
                    .map(param => param.name);
                matches.push(`parameters: ${matchingParams.join(', ')}`);
                score += 2;
            }

            if (matches.length > 0) {
                results.push({
                    endpoint,
                    score,
                    matches
                });
            }
        }

        // Sort by score (highest first)
        return results.sort((a, b) => b.score - a.score);
    }

    private isValidHttpMethod(method: string): boolean {
        const validMethods = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options'];
        return validMethods.includes(method.toLowerCase());
    }

    formatEndpointSummary(endpoint: EndpointInfo): string {
        const { path, method, operation, microservice } = endpoint;
        let summary = `**${method} ${path}** (${microservice})\n`;

        if (operation.summary) {
            summary += `Summary: ${operation.summary}\n`;
        }

        if (operation.description) {
            summary += `Description: ${operation.description}\n`;
        }

        if (operation.tags && operation.tags.length > 0) {
            summary += `Tags: ${operation.tags.join(', ')}\n`;
        }

        if (operation.parameters && operation.parameters.length > 0) {
            summary += `Parameters:\n`;
            for (const param of operation.parameters) {
                const required = param.required ? ' (required)' : ' (optional)';
                summary += `  - ${param.name} (${param.in})${required}: ${param.description || 'No description'}\n`;
            }
        }

        return summary;
    }

    formatSearchResults(results: SearchResult[]): string {
        if (results.length === 0) {
            return 'No endpoints found matching the search criteria.';
        }

        let output = `Found ${results.length} matching endpoints:\n\n`;

        for (const result of results.slice(0, 10)) { // Limit to top 10 results
            output += `**${result.endpoint.method} ${result.endpoint.path}** (${result.endpoint.microservice}) - Score: ${result.score}\n`;

            if (result.endpoint.operation.summary) {
                output += `  Summary: ${result.endpoint.operation.summary}\n`;
            }

            output += `  Matches: ${result.matches.join(', ')}\n\n`;
        }

        if (results.length > 10) {
            output += `... and ${results.length - 10} more results\n`;
        }

        return output;
    }
} 
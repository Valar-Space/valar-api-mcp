import axios, { AxiosInstance } from 'axios';
import { MicroserviceConfig, OAuthToken, OpenAPISpec, OAuthCredentials } from './types.js';

export class ValarApiClient {
    private tokens: Map<string, OAuthToken> = new Map();
    private axiosInstance: AxiosInstance;

    constructor(private credentials: OAuthCredentials) {
        this.axiosInstance = axios.create({
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'valar-api-mcp/1.0.0'
            }
        });
    }

    private async getValidToken(microservice: MicroserviceConfig): Promise<string> {
        const cached = this.tokens.get(microservice.name);

        // Check if we have a valid cached token
        if (cached && Date.now() < cached.expires_at) {
            return cached.access_token;
        }

        // Fetch new token
        const token = await this.fetchNewToken(microservice);
        this.tokens.set(microservice.name, token);
        return token.access_token;
    }

    private async fetchNewToken(microservice: MicroserviceConfig): Promise<OAuthToken> {
        try {
            // Use query parameters as shown in the example
            const tokenUrl = `${microservice.oauthUrl}?email=${encodeURIComponent(this.credentials.username)}&password=${encodeURIComponent(this.credentials.password)}`;

            const response = await this.axiosInstance.get(tokenUrl);

            const tokenData = response.data;

            return {
                access_token: tokenData.access_token,
                token_type: tokenData.token_type || 'Bearer',
                expires_in: tokenData.expires_in || 3600,
                expires_at: Date.now() + (tokenData.expires_in || 3600) * 1000
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(
                    `Failed to authenticate with ${microservice.name}: ${error.response?.data?.error_description || error.message}`
                );
            }
            throw new Error(`Authentication failed for ${microservice.name}: ${error}`);
        }
    }

    async fetchOpenApiSpec(microservice: MicroserviceConfig): Promise<OpenAPISpec> {
        try {
            const token = await this.getValidToken(microservice);
            const url = `${microservice.baseUrl}${microservice.docsPath}`;

            const response = await this.axiosInstance.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            return response.data as OpenAPISpec;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    // Token might be invalid, clear cache and retry once
                    this.tokens.delete(microservice.name);
                    const token = await this.getValidToken(microservice);
                    const url = `${microservice.baseUrl}${microservice.docsPath}`;

                    const retryResponse = await this.axiosInstance.get(url, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    return retryResponse.data as OpenAPISpec;
                }

                throw new Error(
                    `Failed to fetch OpenAPI spec for ${microservice.name}: ${error.response?.data?.message || error.message}`
                );
            }
            throw new Error(`Failed to fetch OpenAPI spec for ${microservice.name}: ${error}`);
        }
    }

    clearTokenCache(): void {
        this.tokens.clear();
    }

    getTokenInfo(microserviceName: string): OAuthToken | undefined {
        return this.tokens.get(microserviceName);
    }

    async testAuthentication(microservices: MicroserviceConfig[]): Promise<void> {
        console.error('Testing authentication for all microservices...');

        for (const microservice of microservices) {
            try {
                console.error(`  Testing ${microservice.name}...`);
                await this.getValidToken(microservice);
                console.error(`  ✓ ${microservice.name} authentication successful`);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                console.error(`  ✗ ${microservice.name} authentication failed: ${errorMessage}`);
                throw new Error(`Authentication failed for ${microservice.name}: ${errorMessage}`);
            }
        }

        console.error('All microservices authenticated successfully!');
    }
} 
import { MicroserviceConfig, OAuthCredentials } from './types.js';

// Configure your Valar microservices here
export const MICROSERVICES: MicroserviceConfig[] = [
    {
        name: 'service-orbits',
        baseUrl: 'https://api.valar.space',
        oauthUrl: 'https://api.valar.space/v1/token',
        docsPath: '/api-docs/Customer',
        description: 'Valar Orbits API - handles orbital data and calculations'
    },
    {
        name: 'service-async',
        baseUrl: 'https://staging-async.valar.space',
        oauthUrl: 'https://api.valar.space/v1/token',
        docsPath: '/v3/api-docs',
        description: 'Valar Async Jobs API - handles status of async jobs'
    },
    {
        name: 'service-auth',
        baseUrl: 'https://auth.valar.space',
        oauthUrl: 'https://api.valar.space/v1/token',
        docsPath: '/v3/api-docs',
        description: 'Valar Auth API - handles user management'
    }
    // Add more microservices as needed
];

export function getOAuthCredentials(): OAuthCredentials {
    const username = process.env.VALAR_USERNAME;
    const password = process.env.VALAR_PASSWORD;

    if (!username || !password) {
        throw new Error(
            'OAuth credentials not found. Please provide VALAR_USERNAME (email) and VALAR_PASSWORD through the MCP client configuration.'
        );
    }

    return { username, password };
}

export function getMicroserviceByName(name: string): MicroserviceConfig | undefined {
    return MICROSERVICES.find(ms => ms.name.toLowerCase() === name.toLowerCase());
}

export function getAllMicroservices(): MicroserviceConfig[] {
    return MICROSERVICES;
} 
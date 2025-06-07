export interface MicroserviceConfig {
    name: string;
    baseUrl: string;
    oauthUrl: string;
    docsPath: string;
    description?: string;
}

export interface OAuthCredentials {
    username: string;
    password: string;
}

export interface OAuthToken {
    access_token: string;
    token_type: string;
    expires_in: number;
    expires_at: number;
}

export interface OpenAPISpec {
    openapi: string;
    info: {
        title: string;
        version: string;
        description?: string;
    };
    servers?: Array<{
        url: string;
        description?: string;
    }>;
    paths: Record<string, Record<string, OpenAPIOperation>>;
    components?: {
        schemas?: Record<string, any>;
        securitySchemes?: Record<string, any>;
    };
}

export interface OpenAPIOperation {
    summary?: string;
    description?: string;
    operationId?: string;
    tags?: string[];
    parameters?: Array<{
        name: string;
        in: string;
        required?: boolean;
        description?: string;
        schema?: any;
    }>;
    requestBody?: {
        description?: string;
        required?: boolean;
        content?: Record<string, any>;
    };
    responses?: Record<string, {
        description: string;
        content?: Record<string, any>;
    }>;
}

export interface EndpointInfo {
    path: string;
    method: string;
    operation: OpenAPIOperation;
    microservice: string;
}

export interface SearchResult {
    endpoint: EndpointInfo;
    score: number;
    matches: string[];
} 
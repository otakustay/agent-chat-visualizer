export interface ApiErrorInit {
    message: string;
    status: number;
    statusText: string;
    response?: unknown;
}

export class ApiError extends Error {
    public status: number;
    public statusText: string;
    public response?: unknown;

    constructor(options: ApiErrorInit) {
        super(options.message);
        this.name = 'ApiError';
        this.status = options.status;
        this.statusText = options.statusText;
        this.response = options.response;
    }
}

export interface PostRequestOptions<I = any> extends Omit<RequestInit, 'body'> {
    body?: I;
}

export async function get<O = any>(url: string, options?: RequestInit): Promise<O> {
    const response = await fetch(url, options);

    if (!response.ok) {
        const errorInit = {
            message: `ApiError[status=${response.status}]`,
            status: response.status,
            statusText: response.statusText,
        };
        throw new ApiError(errorInit);
    }

    return response.json();
}

export async function post<I = any, O = any>(url: string, options?: PostRequestOptions<I>): Promise<O> {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        ...options,
        body: options?.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
        const errorInit = {
            message: `ApiError[status=${response.status}]`,
            status: response.status,
            statusText: response.statusText,
        };
        throw new ApiError(errorInit);
    }

    return response.json();
}

import { HTTPError } from '@/shared/errors/http-error';

export type ApiResponse<T> = {
    data: T;
    status: number;
    headers: Headers;
};

export type RequestConfig = {
    headers?: HeadersInit;
    signal?: AbortSignal;
    cache?: RequestCache;
    next?: NextFetchRequestConfig;
};

export type NextFetchRequestConfig = {
    revalidate?: number | false;
    tags?: string[];
};

export type ApiClient = {
    get: <T>(path: string, config?: RequestConfig) => Promise<ApiResponse<T>>;
    post: <T>(path: string, body: unknown, config?: RequestConfig) => Promise<ApiResponse<T>>;
    put: <T>(path: string, body: unknown, config?: RequestConfig) => Promise<ApiResponse<T>>;
    delete: <T>(path: string, config?: RequestConfig) => Promise<ApiResponse<T>>;
};

const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
    if (!response.ok) {
        throw new HTTPError(
            response.statusText,
            response.status,
            await response.json().catch(() => null)
        );
    }

    const data = await response.json() as T;
    return {
        data,
        status: response.status,
        headers: response.headers,
    };
};

export const createApiClient = (baseUrl: string = '', defaultHeaders: HeadersInit = {}): ApiClient => {
    const headers = {
        'Content-Type': 'application/json',
        ...defaultHeaders,
    };

    return {
        get: async <T>(path: string, config?: RequestConfig): Promise<ApiResponse<T>> => {
            const response = await fetch(`${baseUrl}${path}`, {
                method: 'GET',
                headers: { ...headers, ...config?.headers },
                signal: config?.signal,
                cache: config?.cache,
                next: config?.next,
            });
            return handleResponse<T>(response);
        },

        post: async <T>(path: string, body: unknown, config?: RequestConfig): Promise<ApiResponse<T>> => {
            const response = await fetch(`${baseUrl}${path}`, {
                method: 'POST',
                headers: { ...headers, ...config?.headers },
                body: JSON.stringify(body),
                signal: config?.signal,
                cache: config?.cache,
                next: config?.next,
            });
            return handleResponse<T>(response);
        },

        put: async <T>(path: string, body: unknown, config?: RequestConfig): Promise<ApiResponse<T>> => {
            const response = await fetch(`${baseUrl}${path}`, {
                method: 'PUT',
                headers: { ...headers, ...config?.headers },
                body: JSON.stringify(body),
                signal: config?.signal,
                cache: config?.cache,
                next: config?.next,
            });
            return handleResponse<T>(response);
        },

        delete: async <T>(path: string, config?: RequestConfig): Promise<ApiResponse<T>> => {
            const response = await fetch(`${baseUrl}${path}`, {
                method: 'DELETE',
                headers: { ...headers, ...config?.headers },
                signal: config?.signal,
                cache: config?.cache,
                next: config?.next,
            });
            return handleResponse<T>(response);
        },
    };
};

export const apiClient = createApiClient(process.env.NEXT_PUBLIC_API_URL); 
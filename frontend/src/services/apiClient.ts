/**
 * Civora API Client.
 *
 * Configurable HTTP client with automatic fallback to local mock mode
 * when the backend server is unreachable or disabled via VITE_USE_MOCK_API=true.
 */

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  isMock: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
const USE_MOCK_BY_DEFAULT = import.meta.env.VITE_USE_MOCK_API === 'true';

export class ApiClient {
  private baseUrl: string;
  private useMock: boolean;

  constructor(baseUrl: string = API_BASE_URL, useMock: boolean = USE_MOCK_BY_DEFAULT) {
    this.baseUrl = baseUrl;
    this.useMock = useMock;
  }

  public setMockMode(enabled: boolean) {
    this.useMock = enabled;
  }

  public isMockMode(): boolean {
    return this.useMock;
  }

  public async get<T>(path: string, mockFallback?: () => T): Promise<ApiResponse<T>> {
    if (this.useMock && mockFallback) {
      return { data: mockFallback(), error: null, isMock: true };
    }

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();
      return { data: json, error: null, isMock: false };
    } catch (err: any) {
      if (mockFallback) {
        console.warn(`[Civora API] Backend request failed (${err.message}). Using local fallback.`);
        return { data: mockFallback(), error: null, isMock: true };
      }
      return { data: null, error: err.message, isMock: false };
    }
  }

  public async post<T>(path: string, body: any, mockFallback?: () => T): Promise<ApiResponse<T>> {
    if (this.useMock && mockFallback) {
      return { data: mockFallback(), error: null, isMock: true };
    }

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();
      return { data: json, error: null, isMock: false };
    } catch (err: any) {
      if (mockFallback) {
        console.warn(`[Civora API] Backend POST failed (${err.message}). Using local fallback.`);
        return { data: mockFallback(), error: null, isMock: true };
      }
      return { data: null, error: err.message, isMock: false };
    }
  }
}

export const apiClient = new ApiClient();

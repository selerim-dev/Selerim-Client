// API Configuration
// Use environment variable if set, otherwise default to localhost in development
const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  // In development, default to localhost:8000
  if (process.env.NODE_ENV === 'development' || 
      (typeof window !== 'undefined' && window.location.hostname === 'localhost')) {
    return 'http://localhost:8000';
  }
  // Production default
  return 'https://api.selerim.com';
};

const API_BASE_URL = getApiBaseUrl();

// API Endpoints - Updated to match new Selerim Backend APIs
export const API_ENDPOINTS = {
  // Authentication - Updated endpoints
  LOGIN: '/api/v1/auth/login',
  LOGOUT: '/api/v1/auth/logout',
  REFRESH_TOKEN: '/api/v1/auth/refresh',
  FORGOT_PASSWORD: '/api/v1/auth/password-reset-request',
  RESET_PASSWORD: '/api/v1/auth/password-reset-confirm',
  CHANGE_PASSWORD: '/api/v1/auth/change-password',
  UPDATE_PROFILE: '/api/v1/auth/profile',
  GET_CURRENT_USER: '/api/v1/auth/me',
  
  // New Client Creation & Invitation Flow
  CREATE_CLIENT: '/api/v1/auth/create-client',
  HANDLE_INVITATION: '/api/v1/auth/invitation',
  GET_INVITATION_INFO: '/api/v1/auth/invitation',
  
  // Projects - Updated endpoints
  PROJECTS: '/api/v1/projects/',
  PROJECT_BY_ID: (id: string) => `/api/v1/projects/${id}`,
  PROJECT_PAYMENTS: (id: string) => `/api/v1/projects/${id}/payments`,
  PROJECT_PAYMENT_BY_ID: (projectId: string, paymentId: string) => `/api/v1/projects/${projectId}/payments/${paymentId}`,
} as const;

// API Client with error handling
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    console.log('Making API request to:', url);
    
    const config: RequestInit = {
      headers: {
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log('🚀 Making API request to:', url);
      console.log('📋 Request config:', {
        method: config.method,
        headers: config.headers,
        body: config.body ? 'Present' : 'None'
      });
      
      console.log('⏳ Waiting for response...');
      
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('⏰ Request timeout - aborting...');
        controller.abort();
      }, 15000); // 15 second timeout
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log('✅ API response received');
      console.log('📊 API response status:', response.status);
      console.log('🔗 API response URL:', response.url);
      console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));
      
      // Handle different response types
      const contentType = response.headers.get('content-type');
      let data: any;
      
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      // Log ALL responses for debugging (both success and error)
      console.log('📡 Complete API Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        method: config.method,
        headers: Object.fromEntries(response.headers.entries()),
        contentType: contentType,
        responseData: data,
        responseDataStringified: typeof data === 'object' ? JSON.stringify(data, null, 2) : data,
        timestamp: new Date().toISOString()
      });

      // Handle successful responses
      if (response.ok) {
        return data;
      }

      // Enhanced error logging for debugging
      console.error('❌ API Error Response Details:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        method: config.method,
        requestHeaders: config.headers,
        responseHeaders: Object.fromEntries(response.headers.entries()),
        contentType: contentType,
        rawResponseData: data,
        responseDataType: typeof data,
        responseDataKeys: typeof data === 'object' ? Object.keys(data) : 'N/A',
        responseDataDetail: data?.detail || 'No detail field',
        responseDataMessage: data?.message || 'No message field',
        timestamp: new Date().toISOString()
      });

      // Handle error responses
      if (response.status === 401) {
        // Check if there's a specific error message from the API
        if (data.detail) {
          throw new Error(data.detail);
        }
        throw new Error('Authentication required. Please log in again.');
      }
      
      if (response.status === 403) {
        // Check if there's a specific error message from the API
        if (data.detail) {
          throw new Error(data.detail);
        }
        throw new Error('You do not have permission to perform this action.');
      }
      
      if (response.status === 404) {
        // Check if there's a specific error message from the API
        if (data.detail) {
          throw new Error(data.detail);
        }
        throw new Error('The requested resource was not found.');
      }
      
      if (response.status === 422) {
        // Validation errors
        console.error('422 Validation Error Response:', data);
        
        if (data.detail && Array.isArray(data.detail)) {
          const errorMessages = data.detail
            .map((error: any) => `${error.loc?.join('.') || 'unknown'}: ${error.msg}`)
            .join('; ');
          throw new Error(`Validation failed: ${errorMessages}`);
        }
        
        if (data.errors) {
          const errorMessages = Object.entries(data.errors)
            .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
            .join('; ');
          throw new Error(`Validation failed: ${errorMessages}`);
        }
        
        // Handle specific validation error for query parameters
        if (data.detail && typeof data.detail === 'string' && data.detail.includes('query.args')) {
          throw new Error('API requires pagination parameters. Please try again.');
        }
        
        throw new Error(data.detail || 'Validation failed');
      }
      
      if (response.status >= 500) {
        // Log detailed error information for debugging
        console.error('🚨 500+ Server Error Details:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          headers: Object.fromEntries(response.headers.entries()),
          responseData: data,
          timestamp: new Date().toISOString()
        });
        
        // Try to extract meaningful error message from response
        let errorMessage = 'Server error. Please try again later.';
        
        if (data) {
          if (data.detail) {
            errorMessage = `Server error: ${data.detail}`;
          } else if (data.message) {
            errorMessage = `Server error: ${data.message}`;
          } else if (data.error) {
            errorMessage = `Server error: ${data.error}`;
          } else if (typeof data === 'string') {
            errorMessage = `Server error: ${data}`;
          } else {
            errorMessage = `Server error: ${JSON.stringify(data)}`;
          }
        }
        
        throw new Error(errorMessage);
      }

      // Enhanced error handling for all other status codes
      // Log the complete error structure for debugging
      console.error('🔍 Detailed Error Analysis:', {
        status: response.status,
        dataStructure: {
          hasDetail: 'detail' in data,
          hasMessage: 'message' in data,
          hasError: 'error' in data,
          hasErrors: 'errors' in data,
          dataKeys: typeof data === 'object' ? Object.keys(data) : 'N/A',
          detailType: data.detail ? typeof data.detail : 'undefined',
          detailIsArray: Array.isArray(data.detail),
          detailLength: Array.isArray(data.detail) ? data.detail.length : 'N/A'
        },
        rawData: data
      });

      // Always try to surface the API's error message first
      if (data.detail) {
        if (typeof data.detail === 'string') {
          throw new Error(data.detail);
        } else if (Array.isArray(data.detail)) {
          const errorMessages = data.detail
            .map((error: any) => {
              // Handle FastAPI validation errors
              if (error.loc && error.msg) {
                return `${error.loc.join('.')}: ${error.msg}`;
              }
              return error.msg || JSON.stringify(error);
            })
            .join('; ');
          throw new Error(errorMessages);
        } else {
          throw new Error(JSON.stringify(data.detail));
        }
      }
      
      // Fallback to other error message fields
      if (data.message) {
        throw new Error(data.message);
      }
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Last resort: generic error with status code and full response data
      const errorInfo = {
        status: response.status,
        statusText: response.statusText,
        data: data
      };
      throw new Error(`Request failed: ${JSON.stringify(errorInfo)}`);
      
    } catch (error) {
      console.error('💥 API request failed:', {
        error: error,
        errorType: error instanceof Error ? error.constructor.name : 'Unknown',
        errorMessage: error instanceof Error ? error.message : String(error),
        url: url,
        timestamp: new Date().toISOString()
      });
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        // This could be a CORS error or network issue
        if (error.message.includes('CORS') || error.message.includes('blocked')) {
          console.error('🚫 CORS Error detected - Backend needs CORS configuration');
          throw new Error('CORS error: Backend needs to allow requests from this origin. Please check backend CORS configuration.');
        }
        if (error.message.includes('Failed to fetch')) {
          console.error('🌐 Network Error - Could be CORS or connectivity issue');
          throw new Error('Network error: Unable to connect to the server. This could be a CORS issue or network problem.');
        }
        throw new Error('Network error. Please check your connection.');
      }
      
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('⏰ Request timeout - API may be slow or unresponsive');
        throw new Error('Request timeout. The API is taking too long to respond.');
      }
      
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string, token?: string, queryParams?: Record<string, any>): Promise<T> {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Add query parameters to endpoint if provided
    let fullEndpoint = endpoint;
    if (queryParams) {
      const params = new URLSearchParams();
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
      fullEndpoint = `${endpoint}?${params.toString()}`;
    }
    
    console.log('API GET request:', {
      endpoint: fullEndpoint,
      headers: headers,
      hasToken: !!token
    });
    
    return this.request<T>(fullEndpoint, {
      method: 'GET',
      headers,
    });
  }

  // POST request
  async post<T>(endpoint: string, data: any, token?: string): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return this.request<T>(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put<T>(endpoint: string, data: any, token?: string): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return this.request<T>(endpoint, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
  }

  // PATCH request
  async patch<T>(endpoint: string, data: any, token?: string): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return this.request<T>(endpoint, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete<T>(endpoint: string, token?: string): Promise<T> {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return this.request<T>(endpoint, {
      method: 'DELETE',
      headers,
    });
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Error handling utility
export const handleApiError = (error: any): string => {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error && typeof error === 'object' && error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

// Validation utility
export const validateRequiredFields = (data: Record<string, any>, requiredFields: string[]): string[] => {
  const errors: string[] = [];
  
  requiredFields.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      errors.push(`${field} is required`);
    }
  });
  
  return errors;
};

// Environment check
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// Debug utility for API responses
export const debugApiResponse = (response: any, context: string = 'API Response') => {
  console.group(`🔍 ${context} Debug`);
  console.log('Response Type:', typeof response);
  console.log('Response Keys:', typeof response === 'object' ? Object.keys(response) : 'N/A');
  console.log('Full Response:', response);
  console.log('Stringified Response:', JSON.stringify(response, null, 2));
  console.groupEnd();
};

// Enhanced error logging utility
export const logApiError = (error: any, context: string = 'API Error') => {
  console.group(`❌ ${context} Details`);
  console.error('Error Type:', error?.constructor?.name || typeof error);
  console.error('Error Message:', error?.message || error);
  console.error('Error Stack:', error?.stack);
  console.error('Full Error Object:', error);
  console.groupEnd();
};

// New API methods for client creation and invitation handling
export const createClient = async (clientData: {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
}) => {
  return apiClient.post(API_ENDPOINTS.CREATE_CLIENT, clientData);
};

export const handleInvitation = async (invitationData: {
  token: string;
  password: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}) => {
  return apiClient.post(API_ENDPOINTS.HANDLE_INVITATION, invitationData);
};

export const getInvitationInfo = async (token: string) => {
  return apiClient.get(API_ENDPOINTS.GET_INVITATION_INFO, undefined, { token });
};

// Enhanced project creation with new fields
export const createProject = async (projectData: {
  name: string;
  description: string;
  client_id: string;
  tier: 'STARTER' | 'GROWTH' | 'ENTERPRISE';
  start_date: string;
  end_date: string;
  budget: number;
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}, token: string) => {
  return apiClient.post(API_ENDPOINTS.PROJECTS, projectData, token);
};

// Enhanced project retrieval with filtering
export const getProjects = async (filters?: {
  status?: string;
  tier?: string;
  client_id?: string;
  page?: number;
  size?: number;
}, token?: string) => {
  return apiClient.get(API_ENDPOINTS.PROJECTS, token, filters);
}; 
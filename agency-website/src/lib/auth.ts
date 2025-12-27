// Authentication Service
import { 
  API_ENDPOINTS, 
  apiClient, 
  handleApiError, 
  validateRequiredFields
} from '../config/api';
import { 
  User, 
  TokenResponse, 
  UserLogin, 
  RefreshTokenRequest,
  PasswordResetRequest,
  PasswordResetConfirm,
  ChangePasswordRequest,
  UserUpdate,
  Project,
  ProjectCreate,
  ProjectPayment,
  ProjectPaymentCreate,
  ProjectPaymentUpdate,
  ProjectUpdate,
  Client
} from '../interfaces/auth';

class AuthService {

  // Authentication Methods
  async login(credentials: UserLogin): Promise<TokenResponse> {
    try {
      const requiredFields = ['email', 'password'];
      const errors = validateRequiredFields(credentials, requiredFields);
      
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      // Debug: Log the request details
      console.log('Login request:', {
        endpoint: API_ENDPOINTS.LOGIN,
        credentials: { email: credentials.email, password: '[REDACTED]' }
      });

      const response = await apiClient.post<TokenResponse>(
        API_ENDPOINTS.LOGIN,
        credentials
      );
      
      return response;
    } catch (error) {
      console.error('Login error details:', error);
      throw new Error(handleApiError(error));
    }
  }

  async logout(token: string): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.LOGOUT, {}, token);
    } catch (error) {
      // Don't throw error on logout failure
      console.warn('Logout error:', error);
    }
  }

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    try {
      const response = await apiClient.post<TokenResponse>(
        API_ENDPOINTS.REFRESH_TOKEN,
        { refresh_token: refreshToken }
      );
      
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      if (!email || email.trim() === '') {
        throw new Error('Email is required');
      }

      await apiClient.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const requiredFields = ['token', 'newPassword'];
      const errors = validateRequiredFields({ token, newPassword }, requiredFields);
      
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      await apiClient.post(API_ENDPOINTS.RESET_PASSWORD, {
        token,
        new_password: newPassword
      });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async changePassword(data: ChangePasswordRequest, token: string): Promise<void> {
    try {
      const requiredFields = ['current_password', 'new_password'];
      const errors = validateRequiredFields(data, requiredFields);
      
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      await apiClient.post(API_ENDPOINTS.CHANGE_PASSWORD, data, token);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async updateProfile(data: UserUpdate, token: string): Promise<User> {
    try {
      const response = await apiClient.patch<User>(
        API_ENDPOINTS.UPDATE_PROFILE,
        data,
        token
      );
      
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Project Management Methods
  async getClients(token: string): Promise<{ items: Client[]; total: number; page: number; per_page: number; total_pages: number }> {
    try {
      console.log('Making clients request');
      
      const response = await apiClient.get<Client[]>('/api/v1/clients/clients', token);
      
      // Transform the array response to match the expected format
      return {
        items: response || [],
        total: response?.length || 0,
        page: 1,
        per_page: response?.length || 0,
        total_pages: 1
      };
    } catch (error) {
      console.error('Clients request failed:', error);
      throw new Error(handleApiError(error));
    }
  }

  async getProjects(token: string, params?: {
    page?: number;
    per_page?: number;
    status?: string;
    priority?: string;
    tier?: string;
    search?: string;
  }): Promise<{ items: Project[]; total: number; page: number; per_page: number; total_pages: number }> {
    try {
      console.log('Making projects request');
      
      // Try the projects endpoint - if it fails, return empty result instead of throwing
      const response = await apiClient.get<{ items: Project[]; total: number; page: number; per_page: number; total_pages: number }>(API_ENDPOINTS.PROJECTS, token);
      
      return response;
    } catch (error) {
      console.error('Projects request failed:', error);
      
      // If the API endpoint doesn't work, return empty result instead of throwing
      console.log('Projects API not available, returning empty result');
      return {
        items: [],
        total: 0,
        page: 1,
        per_page: 10,
        total_pages: 0
      };
    }
  }

  async getProject(id: string, token: string): Promise<Project> {
    try {
      return await apiClient.get(API_ENDPOINTS.PROJECT_BY_ID(id), token);
    } catch (error) {
      // Check if it's an authentication error and trigger logout
      if (error instanceof Error && (
        error.message.includes('Authentication required') ||
        error.message.includes('401') ||
        error.message.includes('Unauthorized')
      )) {
        // Clear tokens and redirect to login
        this.clearTokens();
        this.clearUser();
        window.location.href = '/login';
        throw new Error('Session expired. Please log in again.');
      }
      throw new Error(handleApiError(error));
    }
  }

  async createProject(data: ProjectCreate, token: string): Promise<Project> {
    try {
      // Debug: Log the request data
      console.log('Creating project with data:', data);
      
      // Send all fields from ProjectCreate interface
      const cleanData = {
        title: data.title,
        description: data.description,
        status: data.status || 'planning',
        priority: data.priority || 'medium',
        tier: data.tier || 'starter',
        total_cost: data.total_cost,
        current_stage: data.current_stage,
        timeline: data.timeline || {},
        client_id: data.client_id,
        start_date: data.start_date,
        due_date: data.due_date,
        estimated_hours: data.estimated_hours,
        hourly_rate: data.hourly_rate,
        requirements: data.requirements,
        technical_specs: data.technical_specs,
        deliverables: data.deliverables,
        project_url: data.project_url,
        repository_url: data.repository_url,
        design_url: data.design_url,
        tags: data.tags,
        notes: data.notes
      };
      
      console.log('Sending clean data:', cleanData);
      
      // The backend should automatically set owner_id from the authenticated user
      // We don't need to send it from the frontend
      return await apiClient.post(API_ENDPOINTS.PROJECTS, cleanData, token);
    } catch (error) {
      console.error('Project creation error:', error);
      // Check if it's an authentication error and trigger logout
      if (error instanceof Error && (
        error.message.includes('Authentication required') ||
        error.message.includes('401') ||
        error.message.includes('Unauthorized')
      )) {
        // Clear tokens and redirect to login
        this.clearTokens();
        this.clearUser();
        window.location.href = '/login';
        throw new Error('Session expired. Please log in again.');
      }
      throw new Error(handleApiError(error));
    }
  }

  async updateProject(id: string, data: ProjectUpdate, token: string): Promise<Project> {
    try {
      return await apiClient.patch(API_ENDPOINTS.PROJECT_BY_ID(id), data, token);
    } catch (error) {
      // Check if it's an authentication error and trigger logout
      if (error instanceof Error && (
        error.message.includes('Authentication required') ||
        error.message.includes('401') ||
        error.message.includes('Unauthorized')
      )) {
        // Clear tokens and redirect to login
        this.clearTokens();
        this.clearUser();
        window.location.href = '/login';
        throw new Error('Session expired. Please log in again.');
      }
      throw new Error(handleApiError(error));
    }
  }

  async deleteProject(id: string, token: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.PROJECT_BY_ID(id), token);
    } catch (error) {
      // Check if it's an authentication error and trigger logout
      if (error instanceof Error && (
        error.message.includes('Authentication required') ||
        error.message.includes('401') ||
        error.message.includes('Unauthorized')
      )) {
        // Clear tokens and redirect to login
        this.clearTokens();
        this.clearUser();
        window.location.href = '/login';
        throw new Error('Session expired. Please log in again.');
      }
      throw new Error(handleApiError(error));
    }
  }

  // Payment Management Methods
  async getProjectPayments(projectId: string, token: string): Promise<ProjectPayment[]> {
    try {
      return await apiClient.get(API_ENDPOINTS.PROJECT_PAYMENTS(projectId), token);
    } catch (error) {
      // Check if it's an authentication error and trigger logout
      if (error instanceof Error && (
        error.message.includes('Authentication required') ||
        error.message.includes('401') ||
        error.message.includes('Unauthorized')
      )) {
        // Clear tokens and redirect to login
        this.clearTokens();
        this.clearUser();
        window.location.href = '/login';
        throw new Error('Session expired. Please log in again.');
      }
      throw new Error(handleApiError(error));
    }
  }

  async createProjectPayment(projectId: string, data: ProjectPaymentCreate, token: string): Promise<ProjectPayment> {
    try {
      return await apiClient.post(API_ENDPOINTS.PROJECT_PAYMENTS(projectId), data, token);
    } catch (error) {
      // Check if it's an authentication error and trigger logout
      if (error instanceof Error && (
        error.message.includes('Authentication required') ||
        error.message.includes('401') ||
        error.message.includes('Unauthorized')
      )) {
        // Clear tokens and redirect to login
        this.clearTokens();
        this.clearUser();
        window.location.href = '/login';
        throw new Error('Session expired. Please log in again.');
      }
      throw new Error(handleApiError(error));
    }
  }

  async updateProjectPayment(projectId: string, paymentId: string, data: ProjectPaymentUpdate, token: string): Promise<ProjectPayment> {
    try {
      return await apiClient.patch(API_ENDPOINTS.PROJECT_PAYMENT_BY_ID(projectId, paymentId), data, token);
    } catch (error) {
      // Check if it's an authentication error and trigger logout
      if (error instanceof Error && (
        error.message.includes('Authentication required') ||
        error.message.includes('401') ||
        error.message.includes('Unauthorized')
      )) {
        // Clear tokens and redirect to login
        this.clearTokens();
        this.clearUser();
        window.location.href = '/login';
        throw new Error('Session expired. Please log in again.');
      }
      throw new Error(handleApiError(error));
    }
  }

  async deleteProjectPayment(projectId: string, paymentId: string, token: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.PROJECT_PAYMENT_BY_ID(projectId, paymentId), token);
    } catch (error) {
      // Check if it's an authentication error and trigger logout
      if (error instanceof Error && (
        error.message.includes('Authentication required') ||
        error.message.includes('401') ||
        error.message.includes('Unauthorized')
      )) {
        // Clear tokens and redirect to login
        this.clearTokens();
        this.clearUser();
        window.location.href = '/login';
        throw new Error('Session expired. Please log in again.');
      }
      throw new Error(handleApiError(error));
    }
  }

  // Token Management
  setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
    }
  }

  getTokens(): { accessToken: string | null; refreshToken: string | null } {
    if (typeof window !== 'undefined') {
      return {
        accessToken: localStorage.getItem('access_token'),
        refreshToken: localStorage.getItem('refresh_token')
      };
    }
    return { accessToken: null, refreshToken: null };
  }

  clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  // User Management
  setUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  getUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  clearUser(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  }

  // Clear all auth data
  clearAll(): void {
    this.clearTokens();
    this.clearUser();
  }
}

// Create singleton instance
const authService = new AuthService();

// Token storage singleton for backward compatibility
export const tokenStorage = {
  setTokens: (accessToken: string, refreshToken: string) => authService.setTokens(accessToken, refreshToken),
  getTokens: () => authService.getTokens(),
  clearTokens: () => authService.clearTokens(),
  setUser: (user: User) => authService.setUser(user),
  getUser: () => authService.getUser(),
  clearUser: () => authService.clearUser(),
  clearAll: () => authService.clearAll()
};

export default authService; 
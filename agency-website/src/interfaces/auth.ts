// Authentication Interfaces

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  role: 'client' | 'admin' | 'owner';
  project_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
  notes?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  new_password: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface UserUpdate {
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
}

// Client Interface
export interface Client {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  avatar_url: string;
  role: 'client';
  project_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login_at: string;
  notes: string;
}

// Project Interfaces
export interface Project {
  id: string;
  title: string;
  description?: string;
  status: 'planning' | 'active' | 'completed' | 'on_hold' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tier: 'starter' | 'growth' | 'enterprise';
  total_cost?: number;
  current_stage?: string;
  timeline?: Record<string, any>;
  client_id?: string;
  client_name?: string;
  client_email?: string;
  owner_id: string;
  archived: boolean;
  created_at: string;
  updated_at: string;
  start_date?: string;
  due_date?: string;
  completed_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  hourly_rate?: number;
  total_budget?: number;
  actual_cost?: number;
  requirements?: string;
  technical_specs?: string;
  deliverables?: string;
  project_url?: string;
  repository_url?: string;
  design_url?: string;
  progress_percentage?: number;
  current_phase?: string;
  tags?: string;
  notes?: string;
  financial_summary?: {
    total_cost: number;
    total_paid: number;
    outstanding: number;
  };
}

export interface ProjectCreate {
  title: string;
  description?: string;
  status?: 'planning' | 'active' | 'completed' | 'on_hold' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  tier?: 'starter' | 'growth' | 'enterprise';
  total_cost?: number;
  current_stage?: string;
  timeline?: Record<string, any>;
  client_id?: string;
  start_date?: string;
  due_date?: string;
  estimated_hours?: number;
  hourly_rate?: number;
  requirements?: string;
  technical_specs?: string;
  deliverables?: string;
  project_url?: string;
  repository_url?: string;
  design_url?: string;
  tags?: string;
  notes?: string;
}

export interface ProjectUpdate {
  title?: string;
  description?: string;
  status?: 'planning' | 'active' | 'completed' | 'on_hold' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  tier?: 'starter' | 'growth' | 'enterprise';
  total_cost?: number;
  current_stage?: string;
  timeline?: Record<string, any>;
  archived?: boolean;
}

// Payment Interfaces
export interface ProjectPayment {
  id: string;
  project_id: string;
  title: string;
  amount: number;
  due_date: string;
  paid_date?: string;
  status: 'scheduled' | 'paid' | 'overdue';
  stripe_payment_intent_id?: string;
  tax_breakdown?: Record<string, any>;
  method?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectPaymentCreate {
  title: string;
  amount: number;
  due_date: string;
  paid_date?: string;
  status?: 'scheduled' | 'paid' | 'overdue';
  stripe_payment_intent_id?: string;
  tax_breakdown?: Record<string, any>;
  method?: string;
  notes?: string;
}

export interface ProjectPaymentUpdate {
  title?: string;
  amount?: number;
  due_date?: string;
  paid_date?: string;
  status?: 'scheduled' | 'paid' | 'overdue';
  notes?: string;
}

// Client Management Interfaces
export interface ClientCreate {
  name: string;
  email: string;
  phone?: string;
  notes?: string;
}

export interface ClientUpdate {
  name?: string;
  email?: string;
  phone?: string;
  notes?: string;
  status?: 'active' | 'inactive' | 'pending';
}

export interface ClientInvite {
  email: string;
  name?: string;
  project_id?: string;
  role?: 'client' | 'viewer';
  message?: string;
}

// Invitation Link Interfaces
export interface InvitationLinkCreate {
  project_id: string;
  email?: string;
  expires_in_days: number;
  role?: 'client' | 'viewer';
}

export interface InvitationLinkResponse {
  id: string;
  token: string;
  project_id: string;
  is_used: boolean;
  expires_at: string;
  created_at: string;
  project_title?: string;
}

export interface InvitationInfo {
  project_id: string;
  project_title: string;
  project_description?: string;
  expires_at: string;
  is_valid: boolean;
}

// Account Setup Interfaces
export interface AccountSetupRequest {
  token: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export interface AccountSetupResponse {
  user: User;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

// Admin Setup Interfaces
export interface AdminSetupRequest {
  admin_code: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface AdminSetupResponse {
  message: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

// API Response Interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// Dashboard Stats Interfaces
export interface DashboardStats {
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  total_clients: number;
  active_clients: number;
  total_revenue: number;
  monthly_revenue: number;
  total_paid: number;
  outstanding_revenue: number;
  next_payment_due?: {
    id: string;
    title: string;
    amount: number;
    due_date: string;
    project_title: string;
  };
}

// Error Interfaces
export interface AuthError {
  detail: string;
  status_code?: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

// State Interfaces
export interface AuthState {
  user: User | null;
  tokens: {
    access_token: string | null;
    refresh_token: string | null;
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Form interfaces for UI components
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  token: string;
  new_password: string;
  confirm_password: string;
}

export interface AccountSetupFormData {
  token: string;
  email: string;
  password: string;
  confirmPassword: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export interface AdminSetupFormData {
  admin_code: string;
  email: string;
  password: string;
  confirmPassword: string;
  first_name: string;
  last_name: string;
}

export interface ProjectFormData {
  title: string;
  description?: string;
  status: 'planning' | 'active' | 'completed' | 'on_hold' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  client_email?: string;
  budget?: number;
  start_date?: string;
  end_date?: string;
  tags?: string[];
  technologies?: string[];
}

export interface ClientFormData {
  name: string;
  email: string;
  phone?: string;
  notes?: string;
}

export interface InvitationFormData {
  email: string;
  name?: string;
  project_id?: string;
  role?: 'client' | 'viewer';
  message?: string;
}

// Contact Support Interface
export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
  priority?: 'low' | 'medium' | 'high';
} 